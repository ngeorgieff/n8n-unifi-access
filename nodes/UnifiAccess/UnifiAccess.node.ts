import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { unifiAccessApiRequest } from './GenericFunctions';

export class UnifiAccess implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'UniFi Access',
		name: 'unifiAccess',
		icon: 'file:unifi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with UniFi Access API',
		defaults: {
			name: 'UniFi Access',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'unifiAccessApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Visitor',
						value: 'visitor',
					},
				],
				default: 'user',
			},
			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new user',
						action: 'Create a user',
					},
					{
						name: 'Create Multiple',
						value: 'createMultiple',
						description: 'Create multiple users',
						action: 'Create multiple users',
					},
				],
				default: 'create',
			},
			// Visitor Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['visitor'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new visitor',
						action: 'Create a visitor',
					},
				],
				default: 'create',
			},
			// User Create Fields
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'First name of the user',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'Last name of the user',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'Email address of the user',
			},
			{
				displayName: 'Unit Number',
				name: 'unitNumber',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'Unit or apartment number',
			},
			{
				displayName: 'Type',
				name: 'userType',
				type: 'options',
				options: [
					{
						name: 'Owner',
						value: 'owner',
					},
					{
						name: 'Renter',
						value: 'renter',
					},
				],
				default: 'owner',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'Whether the user is an owner or renter',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'Phone number of the user',
			},
			{
				displayName: 'PIN Code',
				name: 'pinCode',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'Preferred 4-digit PIN code for access',
			},
			{
				displayName: 'License Plates',
				name: 'licensePlates',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create'],
					},
				},
				description: 'Comma-separated list of license plate numbers',
			},
			// User Create Multiple Fields
			{
				displayName: 'Users',
				name: 'users',
				type: 'json',
				default: '[]',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['createMultiple'],
					},
				},
				description:
					'JSON array of user objects. Each object should have: firstName, lastName, email, unitNumber (optional), userType (owner/renter), phoneNumber (optional), pinCode (optional), licensePlates (optional)',
				placeholder:
					'[{"firstName": "John", "lastName": "Doe", "email": "john@example.com", "unitNumber": "101", "userType": "owner", "phoneNumber": "555-1234", "pinCode": "1234", "licensePlates": "ABC123,XYZ789"}]',
			},
			// Visitor Create Fields
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['visitor'],
						operation: ['create'],
					},
				},
				description: 'First name of the visitor',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['visitor'],
						operation: ['create'],
					},
				},
				description: 'Last name of the visitor',
			},
			{
				displayName: 'Purpose',
				name: 'purpose',
				type: 'string',
				default: 'Delivery',
				displayOptions: {
					show: {
						resource: ['visitor'],
						operation: ['create'],
					},
				},
				description: 'Purpose of the visit (e.g., Delivery)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['visitor'],
						operation: ['create'],
					},
				},
				description: 'Email address of the visitor (optional)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'user') {
					if (operation === 'create') {
						// Get user data
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const unitNumber = this.getNodeParameter('unitNumber', i, '') as string;
						const userType = this.getNodeParameter('userType', i) as string;
						const phoneNumber = this.getNodeParameter('phoneNumber', i, '') as string;
						const pinCode = this.getNodeParameter('pinCode', i, '') as string;
						const licensePlatesStr = this.getNodeParameter('licensePlates', i, '') as string;

						// Parse license plates
						const licensePlates = licensePlatesStr
							? licensePlatesStr.split(',').map((plate) => plate.trim())
							: [];

						// Create user payload
						const body: any = {
							first_name: firstName,
							last_name: lastName,
							email: email,
							full_name: `${firstName} ${lastName}`,
							status: 'active',
						};

						// Add optional fields to custom metadata
						body.user_group_id = null; // Can be extended later
						body.metadata = {
							unit_number: unitNumber,
							user_type: userType,
							phone_number: phoneNumber,
							license_plates: licensePlates,
						};

						// Add PIN if provided
						if (pinCode) {
							body.access_code = pinCode;
						}

						// Make API request
						const response = await unifiAccessApiRequest.call(
							this,
							'POST',
							'/api/v1/developer/users',
							body,
						);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					} else if (operation === 'createMultiple') {
						// Get users array
						const usersJson = this.getNodeParameter('users', i) as string;
						let users: any[];

						try {
							users = JSON.parse(usersJson);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								'Users parameter must be valid JSON array',
								{ itemIndex: i },
							);
						}

						if (!Array.isArray(users)) {
							throw new NodeOperationError(
								this.getNode(),
								'Users parameter must be an array',
								{ itemIndex: i },
							);
						}

						// Create each user
						const results = [];
						for (const user of users) {
							const licensePlates = user.licensePlates
								? user.licensePlates.split(',').map((plate: string) => plate.trim())
								: [];

							const body: any = {
								first_name: user.firstName,
								last_name: user.lastName,
								email: user.email,
								full_name: `${user.firstName} ${user.lastName}`,
								status: 'active',
								user_group_id: null,
								metadata: {
									unit_number: user.unitNumber || '',
									user_type: user.userType || 'owner',
									phone_number: user.phoneNumber || '',
									license_plates: licensePlates,
								},
							};

							if (user.pinCode) {
								body.access_code = user.pinCode;
							}

							const response = await unifiAccessApiRequest.call(
								this,
								'POST',
								'/api/v1/developer/users',
								body,
							);
							results.push(response);
						}

						returnData.push({
							json: { users: results, count: results.length },
							pairedItem: { item: i },
						});
					}
				} else if (resource === 'visitor') {
					if (operation === 'create') {
						// Get visitor data
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const purpose = this.getNodeParameter('purpose', i, 'Delivery') as string;
						const email = this.getNodeParameter('email', i, '') as string;

						// Generate random 6-digit PIN
						const randomPin = Math.floor(100000 + Math.random() * 900000).toString();

						// Create visitor payload
						const body: any = {
							first_name: firstName,
							last_name: lastName,
							full_name: `${firstName} ${lastName}`,
							purpose: purpose,
							access_code: randomPin,
							status: 'active',
						};

						if (email) {
							body.email = email;
						}

						// Make API request to create visitor
						const response = await unifiAccessApiRequest.call(
							this,
							'POST',
							'/api/v1/developer/visitors',
							body,
						);

						// Include the generated PIN in the response
						returnData.push({
							json: {
								...response,
								generated_pin: randomPin,
							},
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message || 'Unknown error',
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
