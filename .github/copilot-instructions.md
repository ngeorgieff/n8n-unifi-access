# Copilot Instructions for n8n-unifi-access

## Project Overview
This project integrates Unifi Access with n8n, an open-source workflow automation tool. The codebase is currently minimal and may require further scaffolding for full functionality.

## Key Conventions
- **Directory Structure:**
  - All source code and configuration should be placed in clearly named directories (e.g., `src/`, `config/`).
  - Use `.github/` for GitHub-specific workflows and documentation.
- **Documentation:**
  - The main project overview is in `README.md`.
  - Update this file (`.github/copilot-instructions.md`) with any new conventions or architectural decisions.

## Development Workflows
- **Setup:**
  - Ensure all dependencies for n8n and Unifi Access integration are installed.
  - If using Docker, provide a `docker-compose.yml` for local development.
- **Testing:**
  - Add tests in a `tests/` directory. Use clear naming conventions for test files.
- **Builds:**
  - If a build step is required, document the commands in the `README.md` or a `Makefile`.
- **Documentation:**
  - README.md is auto-generated using LLM analysis via GitHub Actions on code changes.
  - For local testing: `./scripts/generate-readme.sh` (requires `OPENAI_API_KEY` env var).
  - Manual trigger via GitHub Actions: workflow_dispatch event.

## Patterns and Practices
- **Integration Points:**
  - Clearly separate Unifi Access API logic from n8n workflow logic.
  - Use environment variables for sensitive configuration (e.g., API keys).
- **Extensibility:**
  - Structure code to allow easy addition of new Unifi Access endpoints or n8n nodes.

## Examples
- Place new integrations in `src/` (e.g., `src/unifi.ts`).
- Add workflow examples in `examples/` if applicable.

## Next Steps
- As the project grows, update this file with:
  - Major architectural decisions
  - Custom scripts or workflows
  - Any non-standard conventions
- **Automated Documentation:**
  - Set `OPENAI_API_KEY` secret in GitHub repository settings for auto-README generation.
  - The workflow triggers on pushes to main branch when source files change.
  - Generated README.md will be committed automatically or create PR for feature branches.

---

*Edit this file to keep Copilot and other AI agents productive as the codebase evolves.*
