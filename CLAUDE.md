# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

**Agentic UI Generator Demo** — a full-stack demo application for dynamically generating dashboard UI components via a chat interface. React + Vite frontend, FastAPI + Python 3.12 backend managed by uv.

## Repository Layout

```
src/
  backend/                         # FastAPI backend (Python 3.12 + uv)
    pyproject.toml                  # uv-managed dependencies
    main.py                         # FastAPI app entry point
  frontend/                          # Vite + React + TypeScript + TailwindCSS
    package.json                    # pnpm-managed
    vite.config.ts                  # Vite config with @ alias + API proxy
    tsconfig.json                   # TypeScript with @/* paths
    tsconfig.node.json              # Node.js tsconfig
    tailwind.config.js              # TailwindCSS with oklch theme variables
    postcss.config.js               # PostCSS config
    index.html                      # Vite entry HTML
    src/
      main.tsx                      # React entry point
      App.tsx                       # Root app component
      index.css                     # TailwindCSS + CSS custom properties
      vite-env.d.ts                 # Vite type declarations
      api/
        client.ts                   # Axios API client
      components/
        AppHeader/                  # Top application header (branding, theme toggle)
        LayoutBar/                  # Utility toolbar (canvas actions, panel toggles)
        LeftPanel/                  # Left panel — component browser (blank stub)
        MainArea/                   # Center canvas area
        ChatPanel/                  # Right panel — agent chat interface
      pages/
        Dashboard/                  # Dashboard page — three-panel layout
      stores/                       # State management (if needed)
      types/                        # TypeScript type definitions
      utils/
        cn.ts                       # clsx + tailwind-merge utility
      styles/                       # Additional styles
```

## Commands

```bash
# Backend development
cd src/backend
uv sync
uv run uvicorn main:app --reload --port 8000

# Frontend development
cd src/frontend
pnpm install
pnpm dev

# Frontend production build
cd src/frontend && pnpm build
```

## Architecture

### Backend — FastAPI

**Flat structure:** Single `main.py` with FastAPI app, CORS middleware, and health/version endpoints. Managed by `uv` with `pyproject.toml`.

**API Endpoints:**
- `GET /` — Root health check
- `GET /api/health` — API health status
- `GET /api/version` — Version info

### Frontend — Vite + React + TypeScript + TailwindCSS

**Dashboard Layout:** Three-panel layout mirroring the Diagram Builder pattern:
- `AppHeader` — Top bar with branding and theme toggle
- `LayoutBar` — Utility toolbar with canvas actions and panel toggles
- `LeftPanel` — Component browser (blank stub)
- `MainArea` — Center canvas area
- `ChatPanel` — Agent chat interface (right panel)

**TypeScript Path Aliases:** `@/*` maps to `src/frontend/src/*` (configured in `tsconfig.json` and `vite.config.ts`).

**Dev Server:** Vite dev server on port 3000 with proxy — `/api/*` requests are proxied to FastAPI at `localhost:8000`.

**Styling:** TailwindCSS with oklch color space CSS custom properties for theming. Dark mode via `class` strategy. Same color system as pretty-diagram reference.

## Key Patterns

- **`@/` path alias** in both tsconfig.json and vite.config.ts
- **Proxy-based dev setup** — Vite proxies `/api/*` to FastAPI
- **oklch theme variables** — dark mode via CSS custom properties
- **Three-panel layout** — Left | Main | Right panels with toggleable visibility
- **pnpm** as the frontend package manager
- **uv** as the Python package manager