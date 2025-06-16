# Monorepo Project

This monorepo contains three packages:

- **apps**: SolidStart app with Tailwind CSS for the frontend.
- **packages**: Common utilities, interfaces, and shared logic.
- **services**: Hono app with Drizzle postgres, Typebox, Redis, and JWT for the backend API. Socket.io.

## Getting Started

- Use `pnpm install` at the root to install all dependencies.
- Each package has its own README for specific instructions.

## Structure

- `packages/packages`: Shared code
- `packages/apps`: Frontend (SolidStart + Tailwind)
- `packages/services`: Backend (Hono + Drizzle postgres + Typebox + Redis + JWT, Socket.io)

---

For more details, see the README in each package.
