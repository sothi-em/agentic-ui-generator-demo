# agentic-ui-generator-demo

Demo of using a chat interface to dynamically generate dashboard UI components.

## Tech Stack

- **Backend:** Python 3.12 + FastAPI (managed by uv)
- **Frontend:** React 19 + TypeScript + TailwindCSS (Vite, managed by pnpm)

## Getting Started

### Backend

```bash
cd src/backend
uv sync
uv run uvicorn agentServer:app --reload --port 8000
```

### Frontend

```bash
cd src/frontend
pnpm install
pnpm dev
```

The frontend dev server runs on port 3000 with API requests proxied to the backend at `localhost:8000`.