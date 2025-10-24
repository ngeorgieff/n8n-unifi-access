# Quick Reference Guide

## Installation

```bash
npm install n8n-nodes-unifi-access
# Then restart n8n
```

## Basic Setup

1. **Add Credentials**
   - Go to n8n Credentials
   - Add "UniFi Access API"
   - Enter: Host, Username, Password

2. **Add Node**
   - Search: "UniFi Access"
   - Drag to workflow

## Operations

### Create User (Single)

```
Resource: User
Operation: Create
Fields:
  - First Name: John
  - Last Name: Doe
  - Email: john@example.com
  - Unit Number: 101
  - Type: Owner
  - Phone: 555-1234
  - PIN Code: 1234
  - License Plates: ABC123,XYZ789
```

### Create Multiple Users

```
Resource: User
Operation: Create Multiple
Users: [
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "unitNumber": "101",
    "userType": "owner",
    "phoneNumber": "555-1234",
    "pinCode": "1234",
    "licensePlates": "ABC123,XYZ789"
  }
]
```

### Create Visitor

```
Resource: Visitor
Operation: Create
Fields:
  - First Name: Bob
  - Last Name: Courier
  - Purpose: Delivery
  - Email: bob@courier.com
Output: Includes auto-generated 6-digit PIN in "generated_pin"
```

## Common Workflows

### Google Forms → Create Users
1. Webhook (receive form data)
2. Function (transform to user format)
3. UniFi Access (Create Multiple Users)

### Form → Create Visitor → Email PIN
1. Webhook (receive form)
2. UniFi Access (Create Visitor)
3. Email Send (send PIN to visitor)

## Field Reference

### User Fields
| Field | Required | Type | Example |
|-------|----------|------|---------|
| First Name | Yes | String | "John" |
| Last Name | Yes | String | "Doe" |
| Email | Yes | String | "john@example.com" |
| Unit Number | No | String | "101" |
| Type | No | Owner/Renter | "owner" |
| Phone | No | String | "555-1234" |
| PIN Code | No | 4 digits | "1234" |
| License Plates | No | Comma-separated | "ABC123,XYZ789" |

### Visitor Fields
| Field | Required | Type | Example |
|-------|----------|------|---------|
| First Name | Yes | String | "Bob" |
| Last Name | Yes | String | "Courier" |
| Purpose | No | String | "Delivery" |
| Email | No | String | "bob@courier.com" |

## Troubleshooting

**Node not found**
- Restart n8n after installation

**Authentication failed**
- Check Host URL (include https://)
- Verify username/password
- Try "Ignore SSL Issues" for self-signed certs

**User already exists**
- Email must be unique
- Check if user exists in UniFi Access

## API Limits

- Session tokens expire after inactivity
- Batch operations process sequentially
- Rate limiting may apply (60 req/min recommended)

## Examples

See `/examples` directory for complete workflows:
- `google-forms-create-users.json`
- `google-forms-create-visitor.json`

Import these into n8n to get started!

## Documentation

- [Full Installation Guide](docs/INSTALLATION.md)
- [Detailed Usage Guide](docs/USAGE.md)
- [API Reference](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)

## Support

- GitHub Issues: https://github.com/ngeorgieff/n8n-unifi-access/issues
- n8n Community: https://community.n8n.io/

---

**Version:** 0.1.0  
**License:** MIT
