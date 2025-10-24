import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

/**
 * Make an authenticated API request to UniFi Access
 */
export async function unifiAccessApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('unifiAccessApi');

	if (!credentials) {
		throw new NodeApiError(this.getNode(), {
			message: 'No credentials returned!',
		});
	}

	// First, authenticate to get session token
	const loginOptions: IHttpRequestOptions = {
		method: 'POST',
		url: `${credentials.host}/api/auth/login`,
		body: {
			username: credentials.username,
			password: credentials.password,
		},
		json: true,
		skipSslCertificateValidation: credentials.allowUnauthorizedCerts as boolean,
		returnFullResponse: true,
	};

	let authToken = '';
	try {
		const loginResponse = await this.helpers.httpRequest(loginOptions);
		// Extract token from response - might be in headers or body
		if (loginResponse.headers && loginResponse.headers['x-csrf-token']) {
			authToken = loginResponse.headers['x-csrf-token'] as string;
		} else if (loginResponse.body && loginResponse.body.token) {
			authToken = loginResponse.body.token;
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), {
			message: 'Authentication failed',
			description: (error as Error).message || 'Unknown error',
		});
	}

	// Now make the actual API request
	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.host}${endpoint}`,
		body,
		qs,
		json: true,
		skipSslCertificateValidation: credentials.allowUnauthorizedCerts as boolean,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	// Add authentication token if we have one
	if (authToken) {
		options.headers = {
			...options.headers,
			'x-csrf-token': authToken,
		};
	}

	Object.assign(options, option);

	try {
		const response = await this.helpers.httpRequest(options);
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
