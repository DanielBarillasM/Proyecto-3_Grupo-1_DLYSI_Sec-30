from __future__ import annotations

import os
import threading
import time
from dataclasses import dataclass
from dataclasses import replace
from pathlib import Path
from typing import Any, Literal

from text2sql.config import load_config
from text2sql.inference import generate_sql
from text2sql.runtime import TextToSQLRuntime

from .schemas import ExecutionPreview, GenerateResponse


ROOT = Path(__file__).resolve().parents[1]
_runtimes: dict[str, TextToSQLRuntime] = {}
_runtime_lock = threading.Lock()


FIXTURE_SQL = """SELECT c.city,
       COUNT(o.order_id) AS total_orders,
       ROUND(SUM(o.total), 2) AS revenue
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.customer_id
WHERE o.status = 'completed'
  AND o.order_date >= '2024-01-01'
  AND o.order_date < '2025-01-01'
GROUP BY c.city
ORDER BY revenue DESC
LIMIT 1;"""


@dataclass(frozen=True, slots=True)
class ServiceSettings:
    mode: Literal["fixture", "model"]


def settings() -> ServiceSettings:
    requested = os.getenv("TEXT_TO_SQL_MODE", "fixture").strip().lower()
    return ServiceSettings(mode="model" if requested == "model" else "fixture")


def adapter_ready() -> bool:
    return (ROOT / "adapter" / "adapter_config.json").exists()


def generate_fixture(variant: Literal["base", "qlora"]) -> GenerateResponse:
    return GenerateResponse(
        sql=FIXTURE_SQL,
        mode="fixture",
        variante=variant,
        latency_ms=0,
        execution=ExecutionPreview(
            ok=True,
            columnas=["city", "total_orders", "revenue"],
            filas=[["Guatemala", 184, "42890.50"]],
        ),
        trace=[
            "Fixture local seleccionado",
            "Consulta marcada explícitamente como demostración",
            "Sin llamada a modelo ni servicio externo",
        ],
    )


def generate_with_model(esquema: str, pregunta: str, variant: Literal["base", "qlora"]) -> GenerateResponse:
    if variant == "qlora" and not adapter_ready():
        raise FileNotFoundError("No hay un adapter seleccionado en adapter/")
    with _runtime_lock:
        runtime = _runtimes.get(variant)
        if runtime is None:
            runtime = TextToSQLRuntime(replace(load_config(), usar_adapter=variant == "qlora"))
            _runtimes[variant] = runtime
    started = time.perf_counter()
    sql = generate_sql(runtime, esquema, pregunta)
    elapsed_ms = round((time.perf_counter() - started) * 1000)
    return GenerateResponse(
        sql=sql,
        mode="model",
        variante=variant,
        latency_ms=elapsed_ms,
        execution=None,
        trace=["Modelo local cargado", "Generación determinista", "Guardia SQL aplicada"],
    )


def read_result_file(name: str) -> dict[str, Any]:
    import json

    allowed = {"summary": "resumen.json", "dataset": "dataset_manifest.json"}
    filename = allowed.get(name)
    if filename is None:
        raise KeyError(name)
    path = ROOT / "resultados" / filename
    return json.loads(path.read_text(encoding="utf-8"))
