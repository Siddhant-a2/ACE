# Contributing to ACE

Thank you for your interest in contributing to ACE! We welcome contributions of all kinds — bug reports, documentation improvements, tests, and code changes. This document explains how to contribute so your changes are easy to review and merge.

## Table of contents
- How to report issues
- How to propose changes (pull requests)
- Branching & commit conventions
- Code style and linters
- Running the project locally
- Tests
- Security
- Code of Conduct

## How to report issues
- Search existing issues first to avoid duplicates.
- When opening a new issue, include:
  - A clear title and description of the problem or feature request.
  - Steps to reproduce (for bugs).
  - Expected vs actual behavior.
  - Environment details (OS, Node version, browser, etc.) if relevant.
  - Screenshots or logs where helpful.

## How to propose changes (Pull Requests)
1. Fork the repository and create a branch from `main` with a descriptive name, e.g. `fix/upload-error` or `feat/event-filter`.
2. Make commits that are small and focused. Rebase or squash as appropriate before creating the PR.
3. Push your branch to your fork and open a pull request against the repository `main` branch.
4. In the PR description include:
   - What the change does and why.
   - Any relevant issue number (e.g., `closes #123`).
   - How to test the change locally.
5. Be responsive to review feedback; maintainers may request changes.

```bash

git checkout main
git pull origin main
git checkout -b feature/my-change
# make changes
git add .
git commit -m "feat: my change"
git push origin feature/my-change


```

## Branching & commit conventions
- Branches: use descriptive names like `fix/`, `feat/`, `chore/`.
- Commit messages: use clear, present-tense messages. Consider Conventional Commits style, e.g. `feat(auth): add JWT refresh endpoint`.

## Code style and linters
- Follow the existing code style in the project. The frontend uses React and the backend uses Node/Express.
- Run linters and formatters if available before submitting a PR (e.g., `npm run lint`, `npm run format`). If you add or change lint rules, discuss in the PR.

## Running the project locally
The repo contains `backend` and `frontend` folders. Typical steps to run locally:

```bash
# Backend
cd backend
npm install
# start the backend in dev mode (if available)
npm run dev

# Frontend
cd ../frontend
npm install
# start the frontend dev server (if available)
npm run dev
```

If any additional environment variables or setup (like a database or Cloudinary credentials) are required, document them in the relevant `README.md` and in your PR.

## Tests
- Add tests for any bug fixes or new features when possible.
- Run existing tests (if present) before submitting your PR:

```bash
# from project root or relevant package
npm test
```

If the project has no test runner yet, adding tests is welcomed — explain how to run them in your PR.

## Security
- Do not include secrets or credentials in commits.
- To report a security vulnerability, open a private issue or contact a maintainer directly (do not disclose the details publicly before it's fixed).

## Code of Conduct
- By participating you agree to follow the project's Code of Conduct. Treat others with respect and be constructive in reviews and discussions.

## License
- Ensure contributions are compatible with the project's license (see `LICENSE` in the repository).

## Need help?
If you're unsure about anything — filing an issue, the PR process, tests, or setup — open an issue or contact a maintainer and we'll help you get started.

---

Thanks again for contributing to ACE! We appreciate your time and effort.
