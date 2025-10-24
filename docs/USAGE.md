# Usage Guide

## Overview

The UniFi Access node allows you to interact with the Ubiquiti UniFi Access API to manage users and visitors for access control systems.

## Available Resources

### User Resource

Manage permanent users in UniFi Access.

#### Create User

Create a single user with detailed information.

**Fields:**
- **First Name** (required): User's first name
- **Last Name** (required): User's last name
- **Email** (required): User's email address
- **Unit Number** (optional): Apartment or unit number
- **Type**: Select "Owner" or "Renter"
- **Phone Number** (optional): Contact phone number
- **PIN Code** (optional): 4-digit access PIN
- **License Plates** (optional): Comma-separated list of license plates

**Example:**
```
First Name: John
Last Name: Doe
Email: john.doe@example.com
Unit Number: 101
Type: Owner
Phone Number: 555-1234
PIN Code: 1234
License Plates: ABC123, XYZ789
```

#### Create Multiple Users

Create multiple users in a single operation using JSON input.

**Fields:**
- **Users** (required): JSON array of user objects

**JSON Format:**
```json
[
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "unitNumber": "101",
    "userType": "owner",
    "phoneNumber": "555-1234",
    "pinCode": "1234",
    "licensePlates": "ABC123,XYZ789"
  },
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "unitNumber": "102",
    "userType": "renter",
    "phoneNumber": "555-5678",
    "pinCode": "5678",
    "licensePlates": "DEF456"
  }
]
```

### Visitor Resource

Manage temporary visitors in UniFi Access.

#### Create Visitor

Create a visitor with an automatically generated 6-digit PIN code.

**Fields:**
- **First Name** (required): Visitor's first name
- **Last Name** (required): Visitor's last name
- **Purpose** (optional): Reason for visit (default: "Delivery")
- **Email** (optional): Visitor's email address

**Output:**
The node returns the created visitor information along with the `generated_pin` field containing the 6-digit access code.

**Example:**
```
First Name: Bob
Last Name: Courier
Purpose: Delivery
Email: bob@courier.com

Output includes:
{
  "id": "visitor123",
  "first_name": "Bob",
  "last_name": "Courier",
  "generated_pin": "847291",
  ...
}
```

## Common Workflows

### 1. Google Forms to UniFi Access Users

**Use Case:** Onboard new residents from a Google Form submission.

**Workflow:**
1. **Google Forms Trigger** → Captures form submissions
2. **Function Node** → Transforms form data to required format
3. **UniFi Access Node** (Create User) → Creates the user

**Example Function Transformation:**
```javascript
return {
  firstName: $input.item.json.firstName,
  lastName: $input.item.json.lastName,
  email: $input.item.json.email,
  unitNumber: $input.item.json.unit,
  userType: $input.item.json.ownerOrRenter.toLowerCase(),
  phoneNumber: $input.item.json.phone,
  pinCode: $input.item.json.preferredPin,
  licensePlates: $input.item.json.licensePlates
};
```

### 2. Bulk User Import from Spreadsheet

**Use Case:** Import multiple users from a CSV/Excel file.

**Workflow:**
1. **Spreadsheet File Trigger** → Reads the spreadsheet
2. **Function Node** → Converts to JSON array format
3. **UniFi Access Node** (Create Multiple Users) → Bulk creates users

**Example Function for Multiple Users:**
```javascript
const users = $input.all().map(item => ({
  firstName: item.json.FirstName,
  lastName: item.json.LastName,
  email: item.json.Email,
  unitNumber: item.json.Unit,
  userType: item.json.Type.toLowerCase(),
  phoneNumber: item.json.Phone,
  pinCode: item.json.PIN,
  licensePlates: item.json.LicensePlates
}));

return { users: JSON.stringify(users) };
```

### 3. Delivery Visitor Creation

**Use Case:** Automatically create visitor access for deliveries.

**Workflow:**
1. **Webhook** → Receives delivery notification
2. **UniFi Access Node** (Create Visitor) → Creates visitor with auto PIN
3. **Email/SMS Node** → Sends PIN to courier/recipient

**Example Email Message:**
```
Hello {{ $json.first_name }},

A delivery visitor pass has been created.
Access Code: {{ $json.generated_pin }}

Valid for today only.
```

### 4. Automated Offboarding

**Use Case:** Remove user access when they move out.

**Workflow:**
1. **Google Forms/Webhook** → Receives move-out notification
2. **UniFi Access Node** (Get User) → Retrieves user details
3. **UniFi Access Node** (Update User) → Deactivates user
4. **Email Node** → Sends confirmation

## Best Practices

### Security
- Store UniFi Access credentials securely in n8n credentials manager
- Use SSL/TLS connections to UniFi Access controller
- Implement webhook authentication for external triggers
- Rotate API credentials periodically

### Error Handling
- Enable "Continue On Fail" for bulk operations
- Add error notification nodes for critical workflows
- Log failed operations for manual review

### Data Validation
- Validate email formats before creating users
- Ensure PIN codes are 4 digits for users, auto-generated for visitors
- Sanitize license plate inputs (remove spaces, uppercase)

### Performance
- Use "Create Multiple Users" for batch operations
- Implement rate limiting for webhook endpoints
- Consider queueing large batch imports

## API Reference

### User Endpoints

**Create User**
- **Method**: POST
- **Endpoint**: `/api/v1/developer/users`
- **Required Fields**: first_name, last_name, email

**Create Multiple Users**
- **Method**: Multiple POST requests to `/api/v1/developer/users`
- **Batching**: Processes each user sequentially

### Visitor Endpoints

**Create Visitor**
- **Method**: POST
- **Endpoint**: `/api/v1/developer/visitors`
- **Required Fields**: first_name, last_name
- **Auto-Generated**: 6-digit PIN code

## Troubleshooting

### Common Issues

**Error: "Authentication failed"**
- Solution: Verify credentials are correct and user has admin access

**Error: "User already exists"**
- Solution: Check if email is already registered; use update operation instead

**Visitor PIN not working**
- Solution: Verify visitor is active and within valid time period

**License plates not saving**
- Solution: Ensure format is comma-separated, no special characters

### Debug Tips

1. Enable workflow execution logs in n8n
2. Use "Execute Node" to test individual operations
3. Check UniFi Access controller logs for API errors
4. Verify network connectivity between n8n and controller

## Examples

See the `/examples` directory for complete workflow JSON files:
- `google-forms-create-users.json` - Create users from Google Forms
- `google-forms-create-visitor.json` - Create visitor with email notification

Import these into n8n to get started quickly!

## Extending the Node

The UniFi Access node is designed to be extensible. Future operations could include:
- Get user details
- Update user information
- Delete/deactivate users
- List all users
- Manage access schedules
- Control door locks
- View access logs

Contributions are welcome! See the main README for contribution guidelines.
