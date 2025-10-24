# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-10-24

### Added
- Initial release of n8n UniFi Access integration
- User resource with create operations
  - Create single user with full details
  - Create multiple users from JSON array
  - Support for first name, last name, email
  - Support for unit number, phone number
  - Owner/Renter designation
  - Custom 4-digit PIN codes
  - Multiple license plates (comma-separated)
- Visitor resource with create operation
  - Create visitors with auto-generated 6-digit PIN
  - Support for first name, last name, purpose
  - Optional email field
- UniFi Access API credentials
  - Host, username, password authentication
  - SSL certificate validation option
- API helper functions
  - Session-based authentication
  - Automatic token management
  - Error handling and reporting
- Documentation
  - Comprehensive README with features and examples
  - Installation guide for multiple methods
  - Usage guide with workflow examples
  - API reference documentation
- Example workflows
  - Google Forms to create users
  - Google Forms to create visitor with email notification
- Development tools
  - TypeScript configuration
  - ESLint and Prettier setup
  - Build and watch scripts
- MIT License

### Known Limitations
- Authentication uses session tokens (may need refresh for long-running workflows)
- Limited to user and visitor creation (no read, update, or delete operations yet)
- API endpoints based on community documentation (may need adjustments for different UniFi Access versions)

### Future Enhancements
Planned for future releases:
- Get user details operation
- Update user information
- Delete/deactivate users
- List users with filtering
- Manage access schedules
- Control door locks
- Query access logs
- Webhook support for real-time events

[0.1.0]: https://github.com/ngeorgieff/n8n-unifi-access/releases/tag/v0.1.0
