# Scion Web Frontend - Agent Instructions

This document provides instructions for AI agents working on the Scion Web Frontend.

## Design Documents

Before making changes, review the relevant design documentation:

- **[Web Frontend Design](../.design/hosted/web-frontend-design.md)** - Architecture, technology stack, component patterns
- **[Frontend Milestones](../.design/hosted/frontend-milestones.md)** - Implementation phases and test criteria

## Development Workflow

### Starting the Development Server

```bash
cd web
npm install    # First time only, or after package.json changes

# Option 1: Build and run (recommended for SSR testing)
npm run build:server && npm start

# Option 2: Development mode (may have tsx/ESM compatibility issues)
npm run dev
```

### Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with tsx (hot reload) |
| `npm run build` | Build both server and client for production |
| `npm run build:server` | Build server-side TypeScript |
| `npm run build:client` | Build client-side with Vite |
| `npm start` | Run the production build |
| `npm run lint` | Check for linting errors |
| `npm run lint:fix` | Auto-fix linting errors |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

### Verifying Changes

After making changes, verify:

1. **Type checking passes:** `npm run typecheck`
2. **Linting passes:** `npm run lint`
3. **Server builds:** `npm run build:server`
4. **Server starts:** `npm start`
5. **Health endpoint works:** `curl localhost:8080/healthz`
6. **SSR works:** `curl localhost:8080/` (should return full HTML with Lit components)

## Project Structure

```
web/
├── src/
│   ├── server/           # Koa server code
│   │   ├── index.ts      # Entry point
│   │   ├── app.ts        # Koa app configuration
│   │   ├── config.ts     # Environment config
│   │   ├── middleware/   # Koa middleware
│   │   ├── routes/       # Route handlers
│   │   │   ├── health.ts # Health check endpoints
│   │   │   └── pages.ts  # SSR page routes
│   │   └── ssr/          # Server-side rendering
│   │       ├── renderer.ts  # Lit SSR renderer
│   │       └── templates.ts # HTML shell templates
│   ├── client/           # Browser-side code
│   │   └── main.ts       # Client entry point (hydration)
│   ├── components/       # Lit web components
│   │   ├── app-shell.ts  # Main application shell
│   │   └── pages/        # Page components
│   │       ├── home.ts   # Dashboard page
│   │       └── not-found.ts # 404 page
│   └── shared/           # Shared types between server/client
│       └── types.ts      # Type definitions
├── public/               # Static assets
│   └── assets/           # CSS, JS, images
├── dist/                 # Build output (gitignored)
│   └── server/           # Compiled server code
└── package.json
```

## Technology Stack

- **Server:** Koa 2.x with TypeScript
- **Components:** Lit 3.x with decorators
- **UI Library:** Web Awesome / Shoelace (Milestone 3)
- **Build:** Vite for client, tsc for server
- **SSR:** @lit-labs/ssr with declarative shadow DOM
- **Routing:** @vaadin/router (client-side)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Server port |
| `HOST` | `0.0.0.0` | Server hostname |
| `NODE_ENV` | `development` | Environment mode |
| `HUB_API_URL` | `http://localhost:9810` | Hub API endpoint |

## Milestone Progress

Track implementation progress in the [frontend milestones](../.design/hosted/frontend-milestones.md) document.

Current status:
- ✅ **M1: Koa Server Foundation** - Complete
- ✅ **M2: Lit SSR Integration** - Complete
- ⬜ M3: Web Awesome Component Library
- ⬜ M4: Authentication Flow
- ⬜ M5: Hub API Proxy
- ⬜ M6: Grove & Agent Pages
- ⬜ M7: SSE + NATS Real-Time Updates
- ⬜ M8: Terminal Component
- ⬜ M9: Agent Creation Workflow
- ⬜ M10: Production Hardening
- ⬜ M11: Cloud Run Deployment

## Key Patterns

### Adding a New Page

1. Create component in `src/components/pages/`
2. Register in `src/server/ssr/renderer.ts` (import and add to `getPageTemplate`)
3. Import in `src/client/main.ts` for client-side hydration
4. Add route pattern to `isKnownRoute()` in `src/server/routes/pages.ts`

### Adding a New Route

1. Create route file in `src/server/routes/`
2. Export from `src/server/routes/index.ts`
3. Mount in `src/server/app.ts`

### Adding Middleware

1. Create middleware in `src/server/middleware/`
2. Export from `src/server/middleware/index.ts`
3. Add to middleware stack in `src/server/app.ts` (order matters!)

### Creating Lit Components

Components use standard Lit patterns with TypeScript decorators:

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-component')
export class MyComponent extends LitElement {
  @property({ type: String })
  accessor myProp = 'default';

  static override styles = css`
    :host { display: block; }
  `;

  override render() {
    return html`<div>${this.myProp}</div>`;
  }
}
```

### Error Handling

Use `HttpError` from `middleware/error-handler.ts` for known errors:

```typescript
import { HttpError } from '../middleware/error-handler.js';

throw new HttpError(404, 'Resource not found', 'NOT_FOUND');
```

## SSR Considerations

- All components must be imported on the server for SSR to work
- Use declarative shadow DOM (`<template shadowroot="open">`)
- Initial data is serialized in `<script id="__SCION_DATA__">` tag
- Client hydrates components and sets up routing on load
