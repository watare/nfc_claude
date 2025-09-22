# Repository Guidelines

## Project Structure & Module Organization
- Backend: `backend/` (TypeScript, Express)
  - Source: `backend/src/**` (controllers, routes, services, middleware, validators, types)
  - Tests: `backend/tests/**` (Jest + ts-jest)
  - Prisma: `backend/prisma/**` (schema, migrations, seed)
  - Build output: `backend/dist/`
- Frontend: `frontend/` (React + Vite + TS)
  - Source: `frontend/src/**` (components, hooks, services, types)
  - Static: `frontend/public/`
  - Build output: `frontend/dist/`
- Infra & docs: `docker*/`, `Makefile`, `docs/`, `README.md`, `CLAUDE.md`

## Build, Test, and Development Commands
- Install: `make install` (or `npm run setup`) — installs backend and frontend deps.
- Dev (both): `make dev` — runs backend (`:5000`) and frontend (`:3000`).
- Dev (single): `make dev-backend` / `make dev-frontend`.
- Build: `npm run build` or `make build` (Docker images). Frontend artifacts in `frontend/dist/`.
- Tests: `npm run test` (backend Jest). Coverage: `cd backend && npm run test:coverage`.
- Lint/Types: `npm run lint` and `npm run typecheck` (or `make check`).
- Docker: `make up`, `make down`, `make logs`.

## Coding Style & Naming Conventions
- TypeScript across repo; 2-space indentation; no `any` in backend (enforced).
- ESLint: backend (`backend/.eslintrc.js`), frontend (`frontend/eslint.config.js`). Fix with `npm run lint:fix` (backend).
- Filenames: services/routes/middleware use camelCase (e.g., `equipmentService.ts`); React components PascalCase (e.g., `App.tsx`); hooks start with `use*`.

## Testing Guidelines
- Framework: Jest (Node, ts-jest) in `backend/tests`.
- Naming: `*.test.ts` or `*.spec.ts`. Place near code or under `backend/tests`.
- Coverage: generated to `backend/coverage/`; aim to keep critical paths (auth, services) covered.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (e.g., `feat: add NFC parser`, `fix(auth): token refresh`).
- Before PR: run `make check` (typecheck, lint, tests).
- PRs: include purpose, linked issues, test steps, and UI screenshots when relevant.

## Security & Configuration Tips
- Copy `.env.example` to `.env` and adjust; for DB changes run `npm run db:migrate` or `make migrate`.
- Do not commit secrets, dumps, or local `.env` files.
- Prisma: use `npm run db:studio` for quick data inspection.
