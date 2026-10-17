from __future__ import annotations

import argparse
import csv
import json
import os
import time
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evalúa baseline o adapter por ejecución en 40 preguntas.")
    parser.add_argument("--name", required=True, help="Nombre de corrida: baseline, qlora_r16, qlora_r32, etc.")
    parser.add_argument("--adapter", type=Path, help="Ruta del adapter; omitir para baseline.")
    parser.add_argument("--repair", action="store_true", help="Activa una reparación guiada por MySQL.")
    return parser.parse_args()


def main() -> None:
    import mysql.connector

    from scripts.validate_mysql import setup_schema
    from text2sql.config import ProjectConfig, load_config
    from text2sql.evaluation import ScoredExample, categorize_error, execution_match, weighted_execution_accuracy
    from text2sql.inference import generate_sql
    from text2sql.runtime import TextToSQLRuntime

    args = parse_args()
    base = load_config()
    runtime = TextToSQLRuntime(
        ProjectConfig(
            modelo_base=base.modelo_base,
            adapter=(ROOT / args.adapter).resolve() if args.adapter else base.adapter,
            usar_adapter=args.adapter is not None,
            semilla=base.semilla,
        )
    )
    rows = [json.loads(line) for line in (ROOT / "datos" / "validacion" / "preguntas.jsonl").read_text(encoding="utf-8").splitlines() if line]
    connection = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "127.0.0.1"),
        port=int(os.getenv("MYSQL_PORT", "3307")),
        user=os.getenv("MYSQL_ADMIN_USER", "root"),
        password=os.getenv("MYSQL_ROOT_PASSWORD", "proyecto3_root"),
        autocommit=True,
    )
    for schema_id in {row["schema_id"] for row in rows}:
        setup_schema(connection, schema_id, "validation")

    output_rows: list[dict[str, Any]] = []
    scores: list[ScoredExample] = []
    latencies: list[float] = []
    try:
        for row in rows:
            cursor = connection.cursor()
            cursor.execute(f"USE `{row['schema_id']}`")

            def execute(sql: str) -> dict[str, Any]:
                try:
                    cursor.execute(sql)
                    columns = [item[0] for item in cursor.description or []]
                    return {"ok": True, "columnas": columns, "filas": [list(item) for item in cursor.fetchall()], "error": None}
                except Exception as exc:
                    return {"ok": False, "columnas": [], "filas": [], "error": str(exc)}

            reference = execute(row["sql"])
            started = time.perf_counter()
            predicted_sql = generate_sql(runtime, row["esquema"], row["pregunta"], execute if args.repair else None)
            latency = (time.perf_counter() - started) * 1000
            predicted = execute(predicted_sql)
            matched = execution_match(reference, predicted, order_matters=bool(row["orden_importa"]))
            scores.append(ScoredExample(row["dificultad"], matched))
            latencies.append(latency)
            output_rows.append(
                {
                    "id": row["id"],
                    "schema_id": row["schema_id"],
                    "dificultad": row["dificultad"],
                    "pregunta": row["pregunta"],
                    "sql_referencia": row["sql"],
                    "sql_predicho": predicted_sql,
                    "ejecutable": bool(predicted.get("ok")),
                    "correcto": matched,
                    "categoria_error": categorize_error(predicted_sql, predicted, matched),
                    "latencia_ms": round(latency, 2),
                }
            )
            cursor.close()
    finally:
        connection.close()

    output_dir = ROOT / "resultados" / "corridas"
    output_dir.mkdir(parents=True, exist_ok=True)
    csv_path = output_dir / f"{args.name}.csv"
    with csv_path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(output_rows[0]))
        writer.writeheader()
        writer.writerows(output_rows)
    sorted_latencies = sorted(latencies)
    summary = {
        "name": args.name,
        "adapter": str(args.adapter) if args.adapter else None,
        "repair": args.repair,
        "examples": len(output_rows),
        "weighted_ex": weighted_execution_accuracy(scores),
        "executable_rate": sum(row["ejecutable"] for row in output_rows) / len(output_rows),
        "latency_p50_ms": sorted_latencies[len(sorted_latencies) // 2],
        "latency_p95_ms": sorted_latencies[min(len(sorted_latencies) - 1, round(len(sorted_latencies) * 0.95) - 1)],
    }
    (output_dir / f"{args.name}.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
