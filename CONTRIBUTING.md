# Contributing to n8n-nodes-unifi-access

Thank you for your interest in contributing to the UniFi Access n8n integration! 

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- n8n version and node version
- UniFi Access controller version
- Any error messages or logs

### Suggesting Features

Feature suggestions are welcome! Please:

- Use a clear and descriptive title
- Provide detailed description of the proposed feature
- Explain why this feature would be useful
- Include examples of how it would work

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the coding standards below
3. **Test your changes** thoroughly
4. **Update documentation** if you've changed functionality
5. **Run linting**: `npm run lint`
6. **Build the project**: `npm run build`
7. **Submit a pull request** with a clear description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/n8n-unifi-access.git
cd n8n-unifi-access

# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run dev

# Run linting
npm run lint

# Format code
npm run format
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use proper typing (avoid `any` when possible)
- Add JSDoc comments for public functions

### Naming Conventions

- **Files**: Use PascalCase for node files (e.g., `UnifiAccess.node.ts`)
- **Variables**: Use camelCase (e.g., `firstName`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`)
- **Types/Interfaces**: Use PascalCase with `I` prefix for interfaces (e.g., `IUserData`)

### Code Organization

- Keep node logic in `nodes/` directory
- Keep credentials in `credentials/` directory
- Add helper functions to `GenericFunctions.ts`
- Place examples in `examples/` directory
- Update documentation in `docs/` directory

### Adding New Operations

When adding a new operation to the UniFi Access node:

1. **Add to node description** in `UnifiAccess.node.ts`:
   ```typescript
   {
     name: 'Get User',
     value: 'get',
     description: 'Get user details',
     action: 'Get a user',
   }
   ```

2. **Add parameter fields** for the operation
3. **Implement in execute function**:
   ```typescript
   if (resource === 'user') {
     if (operation === 'get') {
       // Implementation here
     }
   }
   ```

4. **Add API request** to `GenericFunctions.ts` if needed
5. **Update documentation** in `docs/USAGE.md`
6. **Add example workflow** if applicable

### Testing

While we don't have automated tests yet, please:

- Test your changes with a real UniFi Access controller
- Test error conditions (invalid credentials, network errors, etc.)
- Test edge cases (empty strings, special characters, etc.)
- Document test results in your pull request

### Documentation

Update documentation for any user-facing changes:

- **README.md**: For new features or significant changes
- **docs/USAGE.md**: For new operations or usage patterns
- **docs/INSTALLATION.md**: For installation or configuration changes
- **Code comments**: For complex logic or non-obvious implementations

### Commit Messages

Use clear and descriptive commit messages:

```
Add user update operation

- Implement PUT endpoint for user updates
- Add validation for user ID parameter
- Update documentation with examples
```

Format:
- First line: Brief summary (50 chars or less)
- Blank line
- Detailed description with bullet points

## Adding New Resources

To add a completely new resource (e.g., "Access Group"):

1. Add to resource options in node description
2. Create operation options for the resource
3. Add parameter fields for each operation
4. Implement operations in execute function
5. Add API helper functions if needed
6. Create example workflows
7. Update documentation

Example structure:
```typescript
// In node properties
{
  displayName: 'Resource',
  name: 'resource',
  type: 'options',
  options: [
    { name: 'User', value: 'user' },
    { name: 'Visitor', value: 'visitor' },
    { name: 'Access Group', value: 'accessGroup' }, // New resource
  ],
}
```

## Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others when you can
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md) (if applicable)

## Questions?

- Open an issue for questions about contributing
- Check existing issues and discussions
- Refer to [n8n's community node documentation](https://docs.n8n.io/integrations/creating-nodes/)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make UniFi Access integration better for everyone! 🎉
