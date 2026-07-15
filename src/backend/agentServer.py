"""Agentic UI Generator Demo - FastAPI Backend"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class ComponentRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User prompt for the agent")
    component: dict | None = Field(
        None,
        description=(
            "Optional existing component context (name, description, appJsx, indexCss) "
            "if the user is editing an existing component."
        ),
    )


class ComponentResponse(BaseModel):
    jsx: str

app = FastAPI(
    title="Agentic UI Generator Demo",
    version="0.1.0",
)

# CORS — allow frontend origin (Vite dev server / deployed frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ok"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}


@app.get("/api/version")
async def version():
    return {
        "name": "agentic-ui-generator-demo",
        "version": "0.1.0",
    }


@app.post("/api/generate")
async def generate_component(request: ComponentRequest) -> ComponentResponse:
    from utils.generator import generate_ui_component

    result = await generate_ui_component(
        request.message,
        existing_component=request.component,
    )
    return ComponentResponse(jsx=result["jsx"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("agentServer:app", host="0.0.0.0", port=8000, reload=True)