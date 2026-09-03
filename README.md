# Todo App

A task manager built with Next.js, React, TypeScript and Redux Toolkit. Create, edit, complete, search, filter and sort tasks without an account.

[Open the app](https://todo-app-smoky-ten-76.vercel.app/todos)

## What works

- Tasks persist in the current browser after reload.
- Versioned JSON export and import let you move a backup between devices. Import preserves existing versions of matching tasks.
- Invalid or oversized backups are rejected before changing the task list.
- Storage failures display a warning; malformed saved data is left untouched.
- Search, status filters, sorting, bulk completion, editing and light/dark themes.
- Keyboard focus indicators, labeled controls and reduced-motion styles.

## Technical decisions

Redux Toolkit manages task state and list controls. A client-side persistence boundary restores saved tasks before rendering the workspace, avoiding an initial empty-state overwrite. It writes only when task data changes. Zod validates both imported and stored data; backups are limited to 1,000 tasks and 2 MB. Imports merge by task ID rather than silently replacing current work.

The app has no backend or account service. Data is local to one browser and origin, is not encrypted, and is not synchronized between tabs or devices. Export backups before clearing browser data. Historical authentication helper tests cover prototype code only; `/login` and `/signup` redirect to the workspace and never collect credentials.

## Development

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run lint
npm run typecheck
npm test -- --runInBand
npm run build
```

The test suite covers reducers, components, backup validation, reload persistence, malformed storage and quota failures. GitHub Actions runs lint, TypeScript, Jest and a production build on pull requests and pushes to main.

## Deployment

Use Vercel's Next.js preset. No database, secrets or environment variables are required. Browser data belongs to the deployment's origin; moving to another URL requires exporting and importing a backup.
