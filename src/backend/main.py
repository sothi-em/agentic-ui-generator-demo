"""Agentic UI Generator Demo - FastAPI Backend"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)