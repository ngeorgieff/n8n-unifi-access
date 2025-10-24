```markdown
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

## Installation

To install the `n8n-nodes-unifi-access` package, run the following command:

```bash
npm install n8n-nodes-unifi-access
```

## Usage

To use the `n8n-nodes-unifi-access` package, you need to configure your UniFi Access API credentials in n8n. 

1. **Add Credentials**: Configure your UniFi Access API credentials in n8n
2. **Add Node**: Search for "UniFi Access" in the node panel
3. **Configure**: Select resource (User/Visitor) and operation
4. **Connect**: Link to your workflow triggers (webhooks, forms, etc.)

## API Documentation

The `n8n-nodes-unifi-access` package provides the following API endpoints:

- **User Resource**
  - Create User
  - Create Multiple Users
- **Visitor Resource**
  - Create Visitor

## Configuration Options

The `n8n-nodes-unifi-access` package provides the following configuration options:

- **Host**: Your UniFi Access controller URL (e.g., `https://unifi-access.example.com`)
- **Username**: Admin username with API access
- **Password**: Admin password
- **Ignore SSL Issues**: Enable for self-signed certificates (development only)

## Development Setup

To set up the development environment for `n8n-nodes-unifi-access`, follow these steps:

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

## Contributing Guidelines

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue describing the problem
2. **Suggest Features**: Share ideas for new operations or improvements
3. **Submit PRs**: Fork, create a feature branch, and submit a pull request
4. **Documentation**: Improve docs, add examples, write tutorials

## License Information

The `n8n-nodes-unifi-access` package is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
```
