# Monorepo Project

This monorepo contains three packages:

- **apps**: SolidStart app with Tailwind CSS for the frontend.
- **shared**: Common utilities, interfaces, and shared logic.
- **api**: Hono, SocketIo and ... .
- **config**: Base project config for each part like eslint or tailwind config

## Getting Started

- first create .env whit .template.env
- Use `pnpm install` at the root to install all dependencies.
- generate and migrate orm schema with `pnpm run generate` and `pnpm run migrate`.
- build project with `pnpm run build`.
- start with `pnpm run start` or dev with `pnpm run dev`
