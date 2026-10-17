from __future__ import annotations

import os

from fastapi import FastAPI, HTTPException, status
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware

from .schemas import GenerateRequest, GenerateResponse, HealthResponse
from .service import (
    adapter_ready,
    generate_fixture,
    generate_with_model,
    read_result_file,
    settings,
)


app = FastAPI(
    title="Proyecto 3 · Text-to-SQL local",
    version="1.0.0",
    description="API local de demostración. El contrato evaluado permanece en solucion.py.",
)
origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health", response_model=HealthResponse, tags=["system"])
async def health() -> HealthResponse:
    current = settings()
    return HealthResponse(mode=current.mode, adapter_ready=adapter_ready())


@app.post("/api/generate", response_model=GenerateResponse, tags=["text-to-sql"])
async def generate(payload: GenerateRequest) -> GenerateResponse:
    current = settings()
    if current.mode == "fixture":
        return generate_fixture(payload.variante)
    try:
        return await run_in_threadpool(
            generate_with_model,
            payload.esquema,
            payload.pregunta,
            payload.variante,
        )
    except (FileNotFoundError, RuntimeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"El modelo local no está listo: {exc}",
        ) from exc


@app.get("/api/results/{name}", tags=["results"])
async def results(name: str) -> dict:
    try:
        return read_result_file(name)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Resultado no disponible") from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail="Ejecuta primero el pipeline de resultados") from exc
