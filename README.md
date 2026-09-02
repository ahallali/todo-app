# Todo App

A public frontend demo built with Next.js, React, Redux and TypeScript.

Create, edit, complete, delete, search, filter and sort tasks. Light and dark themes are available. Tasks exist only in Redux memory and reset on reload. There is no account service or persistent task storage. The public `/login` and `/signup` routes redirect to `/todos`, so visitors are never asked for credentials. Reset demo clears tasks without clearing unrelated browser storage.

## Local development

Use Node.js 22 or later. Clone `https://github.com/ahallali/todo-app.git`, then run `npm ci` and `npm run dev`.

## Verification

Run `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, and `npm run build`. `npm start` serves the production build. The historical auth unit tests cover prototype helpers only; they do not represent a working authentication service. Component snapshots are reviewed as generated fixtures, not a pre-existing regression baseline.

## Deployment

Import this repository into Vercel using the Next.js preset. No secrets, external API, database, or environment variables are required. Do not add real credential collection until an authentication backend exists. Next.js 15.5.25 and compatible transitive security updates replace the original 14.0.4 lockfile.
