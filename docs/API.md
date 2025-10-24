# UniFi Access API Reference

This document provides details about the UniFi Access API endpoints used by this n8n node.

## Authentication

The UniFi Access API uses session-based authentication.

### Login Endpoint

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "your-password"
}
```

**Response:**
- Returns authentication token in headers (`x-csrf-token`) or response body
- Token must be included in subsequent API requests

## User Management

### Create User

**POST** `/api/v1/developer/users`

Creates a new user in the UniFi Access system.

**Headers:**
```
Content-Type: application/json
x-csrf-token: {auth-token}
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "full_name": "John Doe",
  "status": "active",
  "user_group_id": null,
  "access_code": "1234",
  "metadata": {
    "unit_number": "101",
    "user_type": "owner",
    "phone_number": "555-1234",
    "license_plates": ["ABC123", "XYZ789"]
  }
}
```

**Field Descriptions:**
- `first_name` (required): User's first name
- `last_name` (required): User's last name  
- `email` (required): User's email address (must be unique)
- `full_name` (required): Full name (typically first + last)
- `status`: User status - "active", "inactive", "pending"
- `user_group_id`: ID of user group (null for default)
- `access_code`: 4-digit PIN code for door access
- `metadata`: Custom fields for additional information

**Response:**
```json
{
  "id": "user_id_123",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "status": "active",
  "created_at": "2024-10-24T12:00:00Z",
  "updated_at": "2024-10-24T12:00:00Z"
}
```

**Status Codes:**
- `200 OK`: User created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication failed
- `409 Conflict`: User with email already exists

## Visitor Management

### Create Visitor

**POST** `/api/v1/developer/visitors`

Creates a temporary visitor pass.

**Headers:**
```
Content-Type: application/json
x-csrf-token: {auth-token}
```

**Request Body:**
```json
{
  "first_name": "Bob",
  "last_name": "Courier",
  "full_name": "Bob Courier",
  "purpose": "Delivery",
  "email": "bob@courier.com",
  "access_code": "847291",
  "status": "active"
}
```

**Field Descriptions:**
- `first_name` (required): Visitor's first name
- `last_name` (required): Visitor's last name
- `full_name` (required): Full name
- `purpose`: Purpose of visit (e.g., "Delivery", "Guest", "Contractor")
- `email`: Visitor's email (optional)
- `access_code`: 6-digit PIN code (auto-generated if not provided)
- `status`: Visitor status - typically "active"

**Response:**
```json
{
  "id": "visitor_id_456",
  "first_name": "Bob",
  "last_name": "Courier",
  "access_code": "847291",
  "purpose": "Delivery",
  "status": "active",
  "created_at": "2024-10-24T12:00:00Z",
  "expires_at": "2024-10-24T23:59:59Z"
}
```

**Status Codes:**
- `200 OK`: Visitor created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication failed

## Future Endpoints

The following endpoints are planned for future implementation:

### Get User
**GET** `/api/v1/developer/users/{id}`

### Update User  
**PUT** `/api/v1/developer/users/{id}`

### Delete User
**DELETE** `/api/v1/developer/users/{id}`

### List Users
**GET** `/api/v1/developer/users?limit=50&offset=0`

### Get Access Logs
**GET** `/api/v1/developer/access-logs?user_id={id}&start_date={date}`

### Manage Door Locks
**POST** `/api/v1/developer/doors/{id}/unlock`

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

**Common Error Codes:**
- `AUTH_FAILED`: Authentication failed
- `INVALID_REQUEST`: Request validation failed
- `NOT_FOUND`: Resource not found
- `ALREADY_EXISTS`: Resource already exists (e.g., duplicate email)
- `RATE_LIMIT`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting

The UniFi Access API may implement rate limiting. Best practices:

- Don't exceed 60 requests per minute
- Implement exponential backoff for retries
- Use batch operations when available
- Cache frequently accessed data

## Data Types

### User Status
- `active`: User has active access
- `inactive`: User access is temporarily disabled
- `pending`: User is pending approval
- `deleted`: User has been removed (soft delete)

### User Types (Custom Metadata)
- `owner`: Property owner
- `renter`: Tenant/renter
- `staff`: Staff member
- `contractor`: Temporary contractor
- `guest`: Guest user

### Access Code Format
- **User PIN**: 4 digits (e.g., "1234")
- **Visitor PIN**: 6 digits (e.g., "123456")
- Must be numeric only
- No leading zeros for the entire PIN

## Best Practices

### Security
1. **Never log or expose API credentials**
2. **Use HTTPS for all API requests**
3. **Rotate access codes periodically**
4. **Implement proper error handling**
5. **Validate input data before sending**

### Performance
1. **Use batch operations for multiple users**
2. **Implement caching where appropriate**
3. **Handle rate limits gracefully**
4. **Use pagination for large result sets**

### Data Management
1. **Validate email addresses**
2. **Sanitize license plate inputs**
3. **Normalize phone numbers**
4. **Use consistent date formats (ISO 8601)**

## Notes

- API endpoints may vary based on UniFi Access controller version
- This documentation is based on community reverse-engineering and may not be complete
- Always test API calls in a development environment first
- Refer to official Ubiquiti documentation when available

## References

- [UniFi API Getting Started](https://help.ui.com/hc/en-us/articles/30076656117655-Getting-Started-with-the-Official-UniFi-API)
- [Community API Documentation](https://github.com/hjdhjd/unifi-access/blob/main/docs/access-api.md)
- [UniFi Access Help Center](https://help.ui.com/hc/en-us/categories/6583256751383-Access)

---

*Last Updated: October 24, 2024*
