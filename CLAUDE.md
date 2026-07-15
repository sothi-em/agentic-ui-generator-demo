# CLAUDE.md

## Project

**Agentic UI Generator Demo** — full-stack app for dynamically generating React dashboard components from natural-language prompts. React 19 + Vite frontend, FastAPI backend powered by Claude Agent SDK.

## Architecture

### Backend — FastAPI + Claude Agent SDK (`src/backend/`)

Flat layout. Python 3.12, managed by **uv** via `pyproject.toml`.

| File | Role |
|---|---|
| `agentServer.py` | FastAPI app — CORS middleware, health/version endpoints, `POST /api/generate`; uvicorn entry point |
| `utils/generator.py` | Claude Agent SDK workflow — async `generate_ui_component()` using `query()` with structured JSON output |

`POST /api/generate` accepts a `ComponentRequest` (message + optional existing component context) and returns `{"jsx": "..."}`. The generator uses a JSON-schema-constrained Claude Agent SDK call with all tools disabled for safety.

```bash
# Start backend
cd src/backend && uv sync && uv run uvicorn agentServer:app --reload --port 8000
```

### Frontend — Vite + React 19 + TypeScript + TailwindCSS (`src/frontend/`)

```
src/frontend/
  package.json                          # pnpm; React 19, Sandpack, axios, lucide-react, tailwind-merge
  vite.config.ts                        # @ alias, proxy /api → localhost:8000
  tsconfig.json                         # @/* → src/
  tailwind.config.js                   # oklch CSS custom properties, darkMode: "class"
  postcss.config.js
  index.html
  src/
    main.tsx                            # ReactDOM entry, StrictMode
    App.tsx                             # Root — renders DashboardPage
    index.css                           # Tailwind + oklch theme variables (light/dark)
    vite-env.d.ts                       # Vite type declarations
    api/client.ts                       # Axios instance (baseURL: "/api")
    components/
      AppHeader/                        # Top bar — branding, theme toggle (dark/light)
      LayoutBar/                        # Toolbar — Save, Open, Delete, panel toggles
      LeftPanel/                        # Component list — add/select components with revision badges
      ComponentEditor/                  # Right panel — name/description fields, interaction history, chat input → POST /api/generate
      BottomPanel/                      # JSON file viewer — load/display JSON data for Sandpack preview
    pages/Dashboard/                    # Main layout — Header + LayoutBar + [LeftPanel | Sandpack-preview | ComponentEditor] + BottomPanel
    stores/componentStore.tsx           # React context store — components CRUD, selection, history, loaded JSON files
    types/component.ts                 # UiComponent + ComponentHistoryEntry interfaces
    utils/cn.ts                        # clsx + tailwind-merge helper
```

```bash
# Start frontend
cd src/frontend && pnpm install && pnpm dev
```

### Data Flow

1. User types a prompt in **ComponentEditor** (right panel)
2. Frontend `POST /api/generate` → FastAPI proxies to Claude Agent SDK
3. Agent returns JSX → frontend updates the selected component's `appJsx` in the store
4. **Sandpack** live-renders the JSX in the center area, with optional JSON data from **BottomPanel**
5. Each interaction is recorded as a history entry on the component

### Key Patterns

- **`@/` path alias** in `tsconfig.json` and `vite.config.ts`
- **Vite proxy** — `/api/*` routes to FastAPI at `localhost:8000`
- **oklch dark mode** — CSS custom properties, `class` strategy
- **Component store** — React context + `useCallback`-memoized actions; no external state library
- **pnpm** (frontend) / **uv** (backend) as package managers
- **Sandpack** — Codesandbox's in-browser React playground for live component preview