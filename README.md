# Agentic UI Generator Demo

## Overview

A proof-of-concept full-stack application that lets users generate interactive dashboard components from natural-language prompts. Users describe the data visualization they want — including table features such as conditional sorting and filtering — and the backend generates the corresponding React component, rendered live in an in-browser sandbox.

Designed as a workflow demo for user-generated dashboard elements and persistent data visualization. Built for rapid development and showcase rather than production hardening.

[Generating Simple Table](https://github.com/user-attachments/assets/9e364b11-1f77-4cc0-9c62-8e02c4dea6d4)

[Adding Sort Functionality](https://github.com/user-attachments/assets/b21961e3-9740-476c-8d9e-81297fd685e9)

## Architecture

- **Frontend** — React 19 dashboard with a chat-based editor, live preview sandbox, and JSON data viewer.
- **Backend** — FastAPI service that proxies user prompts to a Claude Agent SDK harness, constraining output to structured JSX via JSON schema.
- **Preview** — Sandpack provides in-browser rendering of the generated `App.jsx` without server-side compilation.

## Tech Stack

### Frontend

| Category | Libraries |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite](https://vite.dev/) 7 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) 5.8 |
| **Styling** | [TailwindCSS](https://tailwindcss.com/) 3, [tailwind-merge](https://github.com/dcastil/tailwind-merge), [clsx](https://github.com/lukeed/clsx), [tw-animate-css](https://github.com/jasonmayes/tw-animate-css) |
| **In-Browser Preview** | [@codesandbox/sandpack-react](https://sandpack.codesandbox.com/) |
| **HTTP Client** | [axios](https://axios-http.com/) |
| **Icons** | [lucide-react](https://lucide.dev/) |
| **Package Manager** | [pnpm](https://pnpm.io/) |

### Backend

| Category | Libraries |
|---|---|
| **Framework** | [FastAPI](https://fastapi.tiangolo.com/) |
| **ASGI Server** | [uvicorn](https://www.uvicorn.org/) |
| **Validation** | [Pydantic](https://docs.pydantic.dev/) 2 |
| **AI Orchestration** | [Claude Agent SDK](https://docs.anthropic.com/en/docs/agents/overview) |
| **Package Manager** | [uv](https://docs.astral.sh/uv/) |
| **Linter** | [ruff](https://docs.astral.sh/ruff/) |
| **Testing** | [pytest](https://pytest.org/) + pytest-asyncio |

## Getting Started

### Prerequisites

- **Python** 3.12+
- **Node.js** 18+ with **pnpm**
- **uv** (Python package manager — [install guide](https://docs.astral.sh/uv/getting-started/installation/))
- Anthropic API key or local model endpoint configured for the Claude Agent SDK

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

The frontend dev server runs on port 3000 with `/api` requests proxied to FastAPI at `localhost:8000`.

## How It Works

1. A user types a natural-language prompt in the **Component Editor** (right panel).
2. The frontend sends the prompt as `POST /api/generate` to the FastAPI backend.
3. The backend runs the prompt through a Claude Agent SDK call constrained by a JSON-schema output format. All tools are disabled for safety.
4. The generated JSX is returned to the frontend and injected into a **Sandpack** sandbox, which compiles and renders it live.
5. Optional JSON data can be loaded via the **Bottom Panel** for the generated component to consume.
6. Each interaction is recorded as a history entry on the component.

## Disclaimer

> **This project is a proof of concept.** It was primarily authored using Claude Code with locally hosted vLLM models, and data were synthetically generated through simple prompts. Security considerations, input sanitization, and production-grade hardening have been intentionally overlooked in the interest of rapid development and demonstration.
>
> **Sandpack** is used as an in-browser sandbox for its convenience, but it is not a fully secure isolation solution generated code runs in the user's browser context. **The Claude Agent SDK** provides powerful orchestration capabilities that are overkill for straightforward UI generation tasks; it is used here to demonstrate the workflow, not as a production recommendation.
>
> Do not deploy this application to production without thorough security review, input validation, and a proper sandboxing strategy.
