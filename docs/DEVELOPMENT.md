# Development Guide

This guide will help you set up your development environment and work on the UniFi Access n8n node.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git
- (Optional) Docker and Docker Compose for testing
- UniFi Access controller for testing (or access to one)

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/ngeorgieff/n8n-unifi-access.git
cd n8n-unifi-access

# Install dependencies
npm install
```

### 2. Build the Project

```bash
# Build once
npm run build

# Or watch for changes (recommended for development)
npm run dev
```

The build process:
1. Compiles TypeScript to JavaScript
2. Copies static assets (SVG icons, etc.) to `dist/`
3. Generates type declaration files

### 3. Link to n8n (Local Development)

#### Option A: Using npm link

```bash
# In the n8n-unifi-access directory
npm link

# In your n8n installation directory
npm link n8n-nodes-unifi-access
```

#### Option B: Using custom extensions

```bash
# Create custom extensions directory
mkdir -p ~/.n8n/custom

# Create symlink
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-unifi-access

# Set environment variable (add to your shell profile)
export N8N_CUSTOM_EXTENSIONS=~/.n8n/custom
```

#### Option C: Using Docker (Easiest)

```bash
# Start n8n with the node mounted
docker-compose up -d

# Access n8n at http://localhost:5678
# Default credentials: admin/admin
```

The docker-compose.yml automatically:
- Mounts your local code into n8n
- Sets up custom extensions
- Persists n8n data
- Enables development mode

## Development Workflow

### 1. Make Changes

Edit files in:
- `nodes/UnifiAccess/` - Node implementation
- `credentials/` - Credential types
- `docs/` - Documentation

### 2. Build

```bash
# Rebuild after changes
npm run build

# Or use watch mode
npm run dev
```

### 3. Restart n8n

If using Docker:
```bash
docker-compose restart n8n
```

If running locally:
```bash
# Stop n8n (Ctrl+C)
# Start again
n8n start
```

### 4. Test in n8n UI

1. Open n8n in browser
2. Create a new workflow
3. Add the "UniFi Access" node
4. Configure credentials
5. Test the operation

### 5. Check for Issues

```bash
# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
n8n-unifi-access/
├── credentials/
│   └── UnifiAccessApi.credentials.ts    # API credentials
├── nodes/
│   └── UnifiAccess/
│       ├── UnifiAccess.node.ts          # Main node
│       ├── GenericFunctions.ts          # API helpers
│       └── unifi.svg                     # Icon
├── docs/                                 # Documentation
├── examples/                             # Example workflows
├── dist/                                 # Build output (gitignored)
├── package.json                          # Package config
├── tsconfig.json                         # TypeScript config
└── .eslintrc.js                          # ESLint config
```

## Understanding the Code

### Node Structure

**UnifiAccess.node.ts** contains:
- `description`: Node metadata and parameters
- `execute()`: Main execution logic

```typescript
export class UnifiAccess implements INodeType {
  description: INodeTypeDescription = {
    // Node configuration
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Execution logic
  }
}
```

### Adding a New Operation

1. **Add operation to description:**
```typescript
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  displayOptions: {
    show: { resource: ['user'] }
  },
  options: [
    {
      name: 'Get',
      value: 'get',
      description: 'Get a user',
      action: 'Get a user',
    },
  ],
}
```

2. **Add parameters:**
```typescript
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['user'],
      operation: ['get'],
    },
  },
}
```

3. **Implement in execute():**
```typescript
if (resource === 'user' && operation === 'get') {
  const userId = this.getNodeParameter('userId', i) as string;
  const response = await unifiAccessApiRequest.call(
    this,
    'GET',
    `/api/v1/developer/users/${userId}`,
  );
  returnData.push({ json: response });
}
```

### API Helper Functions

**GenericFunctions.ts** contains:
- `unifiAccessApiRequest()`: Makes authenticated API requests

To add a new helper:
```typescript
export async function getUser(
  this: IExecuteFunctions,
  userId: string,
): Promise<any> {
  return await unifiAccessApiRequest.call(
    this,
    'GET',
    `/api/v1/developer/users/${userId}`,
  );
}
```

## Testing

### Manual Testing

1. **Set up test credentials** in n8n UI
2. **Create test workflow** with UniFi Access node
3. **Execute node** and verify output
4. **Test error cases:**
   - Invalid credentials
   - Network errors
   - Invalid input data

### Using Example Workflows

Import workflows from `examples/`:
1. In n8n, click "Import from File"
2. Select a workflow JSON
3. Update credentials
4. Execute workflow

### Testing API Endpoints

Use a tool like Postman or curl:

```bash
# Login
curl -X POST https://your-controller/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Create user
curl -X POST https://your-controller/api/v1/developer/users \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: YOUR_TOKEN" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com"}'
```

## Debugging

### Enable Debug Logging

In n8n:
```bash
export N8N_LOG_LEVEL=debug
n8n start
```

### Check Logs

Docker:
```bash
docker-compose logs -f n8n
```

Local:
```bash
# Logs are output to console
```

### Common Issues

**Node not appearing:**
- Ensure build completed successfully
- Restart n8n after building
- Check N8N_CUSTOM_EXTENSIONS is set

**TypeScript errors:**
- Run `npm install` to ensure dependencies are installed
- Check for syntax errors in your code
- Verify imports are correct

**API errors:**
- Check UniFi Access controller is accessible
- Verify credentials are correct
- Enable SSL bypass if using self-signed certs

## Code Style

### TypeScript

```typescript
// Good
const firstName = this.getNodeParameter('firstName', i) as string;

// Bad
const firstName = this.getNodeParameter('firstName', i);
```

### Async/Await

```typescript
// Good
const response = await unifiAccessApiRequest.call(...);

// Bad
unifiAccessApiRequest.call(...).then((response) => { ... });
```

### Error Handling

```typescript
try {
  const response = await apiCall();
  returnData.push({ json: response });
} catch (error) {
  if (this.continueOnFail()) {
    returnData.push({ json: { error: error.message } });
    continue;
  }
  throw error;
}
```

## Publishing

### Version Bump

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Update CHANGELOG.md with changes
```

### Build for Release

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
npm run lint
```

### Publish to npm

```bash
# Login to npm
npm login

# Publish
npm publish
```

## Resources

- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [UniFi Access API (Community Documentation)](https://github.com/hjdhjd/unifi-access) - Note: This is community-maintained reverse-engineered documentation and may not reflect the latest official API changes. Official Ubiquiti documentation should be consulted when available.

## Getting Help

- Check [existing issues](https://github.com/ngeorgieff/n8n-unifi-access/issues)
- Review [documentation](docs/)
- Ask in [n8n community](https://community.n8n.io/)

---

Happy coding! 🚀
