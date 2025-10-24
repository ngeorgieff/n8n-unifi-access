# Installation Guide

## Prerequisites

- n8n installed (version 0.200.0 or higher)
- UniFi Access controller with API access enabled
- Admin credentials for UniFi Access

## Installation Methods

### Method 1: Install via npm (Recommended for production)

```bash
# In your n8n installation directory
npm install n8n-nodes-unifi-access
```

Then restart n8n:
```bash
n8n start
```

### Method 2: Local Development Installation

1. Clone this repository:
```bash
git clone https://github.com/ngeorgieff/n8n-unifi-access.git
cd n8n-unifi-access
```

2. Install dependencies:
```bash
npm install
```

3. Build the node:
```bash
npm run build
```

4. Link the node to your n8n installation:
```bash
# Link to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-unifi-access
```

5. Set the custom extension environment variable:
```bash
export N8N_CUSTOM_EXTENSIONS="~/.n8n/custom"
```

6. Restart n8n

### Method 3: Docker Installation

If using n8n in Docker, mount the node directory:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd):/data/custom \
  -e N8N_CUSTOM_EXTENSIONS="/data/custom" \
  n8nio/n8n
```

## Verifying Installation

1. Open n8n in your browser
2. Create a new workflow
3. Search for "UniFi Access" in the node search
4. You should see the "UniFi Access" node available

## Configuration

### Setting up Credentials

1. In n8n, click on "Credentials" in the left sidebar
2. Click "New Credential"
3. Search for "UniFi Access API"
4. Fill in the following fields:
   - **Host**: Your UniFi Access controller URL (e.g., `https://unifi-access.example.com`)
   - **Username**: Admin username
   - **Password**: Admin password
   - **Ignore SSL Issues**: Enable if using self-signed certificates

5. Click "Test" to verify the connection
6. Click "Save" if the test is successful

## Troubleshooting

### Node not appearing
- Ensure n8n was restarted after installation
- Check that `N8N_CUSTOM_EXTENSIONS` is set correctly
- Verify the build completed successfully

### Authentication errors
- Verify your UniFi Access controller URL is correct
- Ensure credentials have admin access
- Check if SSL certificate validation is causing issues (enable "Ignore SSL Issues")

### API request failures
- Ensure UniFi Access API is enabled on your controller
- Check network connectivity between n8n and UniFi Access
- Review n8n logs for detailed error messages

## Next Steps

See [USAGE.md](./USAGE.md) for detailed usage instructions and examples.
