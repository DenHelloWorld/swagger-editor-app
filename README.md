# swagger-editor-app

Swagger/OpenAPI UI with REST client capabilities.

## Tech Stack

Next.js (App Router), React, TypeScript, shadcn/ui, Redux Toolkit, Zustand, Vitest.

## Demo

[https://swagger-editor-app-tyys.onrender.com/](https://swagger-editor-app-tyys.onrender.com/)

Deployed on Render, auto-deployed on every push to `develop`.

PR previews are manual: add the label `render-preview` (or `[render preview]` in the PR title) to spin up a temporary preview instance for that pull request.

## Getting Started

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_FIREBASE_* values from Firebase Console
npm run dev
```
