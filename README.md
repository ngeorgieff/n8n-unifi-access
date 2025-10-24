# n8n-nodes-unifi-access

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

A custom n8n community node for integrating with Ubiquiti UniFi Access API. Automate user onboarding, visitor management, and access control workflows.

[![npm version](https://badge.fury.io/js/n8n-nodes-unifi-access.svg)](https://badge.fury.io/js/n8n-nodes-unifi-access)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **User Management**: Create single or multiple users with comprehensive details
- 👥 **Visitor Management**: Automatically generate visitor passes with 6-digit PINs
- 📋 **Rich User Data**: Support for names, emails, units, phone numbers, license plates, and custom PINs
- 🔐 **Secure Authentication**: Built-in credential management with SSL support
- 🔄 **Batch Operations**: Create multiple users in a single workflow step
- 🎯 **Google Forms Integration**: Seamlessly connect form submissions to access control
- ⚡ **Extensible Design**: Easy to add more UniFi Access operations

## Use Cases

### Residential Buildings
- **Onboarding**: Automatically create access credentials for new residents from lease applications
- **Move-outs**: Streamline offboarding process
- **Visitor Management**: Generate temporary access codes for guests and deliveries

### Office Buildings  
- **Employee Onboarding**: Create access badges from HR systems
- **Contractor Access**: Manage temporary visitor passes
- **Delivery Coordination**: Auto-generate pins for package deliveries

### Property Management
- **Multi-Property**: Manage access across multiple locations
- **Integration**: Connect with property management software
- **Reporting**: Track access events and user lifecycle

## Quick Start

### Installation

```bash
npm install n8n-nodes-unifi-access
```

For detailed installation instructions, see [INSTALLATION.md](docs/INSTALLATION.md).

### Basic Usage

1. **Add Credentials**: Configure your UniFi Access API credentials in n8n
2. **Add Node**: Search for "UniFi Access" in the node panel
3. **Configure**: Select resource (User/Visitor) and operation
4. **Connect**: Link to your workflow triggers (webhooks, forms, etc.)

For complete usage guide and examples, see [USAGE.md](docs/USAGE.md).

## Example Workflows

### Create User from Google Form

```
Google Forms → Function (transform data) → UniFi Access (Create User)
```

This workflow captures form submissions and automatically creates UniFi Access users with all necessary details including license plates and preferred PIN codes.

### Bulk User Import

```
Spreadsheet File → Function (array transform) → UniFi Access (Create Multiple)
```

Import multiple users from CSV/Excel in a single operation.

### Visitor with Email Notification

```
Webhook → UniFi Access (Create Visitor) → Email Send (with PIN)
```

Automatically create visitor passes and email the 6-digit access code.

See the `/examples` directory for complete workflow JSON files you can import into n8n.

## Available Operations

### User Resource

#### Create User
Create a single user with:
- First Name, Last Name, Email (required)
- Unit Number, Phone Number (optional)
- Owner/Renter designation
- Custom 4-digit PIN code
- Multiple license plates (comma-separated)

#### Create Multiple Users
Batch create users from a JSON array with the same fields as Create User.

### Visitor Resource

#### Create Visitor
Create a temporary visitor with:
- First Name, Last Name (required)
- Purpose (e.g., "Delivery")
- Email (optional)
- **Auto-generated 6-digit PIN** returned in response

## Configuration

### UniFi Access API Credentials

Required fields:
- **Host**: Your UniFi Access controller URL (e.g., `https://unifi-access.example.com`)
- **Username**: Admin username with API access
- **Password**: Admin password
- **Ignore SSL Issues**: Enable for self-signed certificates (development only)

## Documentation

- [Installation Guide](docs/INSTALLATION.md) - Setup and configuration
- [Usage Guide](docs/USAGE.md) - Detailed usage instructions and examples
- [API Reference](docs/USAGE.md#api-reference) - UniFi Access API endpoints

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/ngeorgieff/n8n-unifi-access.git
cd n8n-unifi-access

# Install dependencies
npm install

# Build the node
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

### Project Structure

```
n8n-unifi-access/
├── credentials/
│   └── UnifiAccessApi.credentials.ts    # API credential definitions
├── nodes/
│   └── UnifiAccess/
│       ├── UnifiAccess.node.ts          # Main node implementation
│       ├── GenericFunctions.ts          # API helper functions
│       └── unifi.svg                     # Node icon
├── examples/                             # Example workflows
├── docs/                                 # Documentation
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue describing the problem
2. **Suggest Features**: Share ideas for new operations or improvements
3. **Submit PRs**: Fork, create a feature branch, and submit a pull request
4. **Documentation**: Improve docs, add examples, write tutorials

### Adding New Operations

The node is designed to be extensible. To add new operations:

1. Add operation to the `properties` array in `UnifiAccess.node.ts`
2. Implement the operation logic in the `execute()` function
3. Add corresponding API request in `GenericFunctions.ts`
4. Update documentation and examples

Potential future operations:
- Get user details
- Update user information  
- Delete/deactivate users
- List users with filters
- Manage access schedules
- Control door locks
- Query access logs

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/ngeorgieff/n8n-unifi-access/issues)
- **Documentation**: [docs/](docs/)
- **Examples**: [examples/](examples/)

## Acknowledgments

- Built for [n8n](https://n8n.io) - Workflow automation platform
- Integrates with [Ubiquiti UniFi Access](https://ui.com/door-access) - Access control system
- Inspired by the n8n community node ecosystem

## Disclaimer

This is a community-maintained project and is not officially supported by Ubiquiti or n8n. Use at your own risk. Always test thoroughly in a development environment before production use.

---

Made with ❤️ for the n8n and UniFi communities
