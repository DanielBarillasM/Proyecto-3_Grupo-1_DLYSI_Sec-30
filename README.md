<div align="center">

# Texto a SQL con QLoRA

**Proyecto 3 · Deep Learning y Sistemas Inteligentes · Sección 30**

[![Python](https://img.shields.io/badge/Python-3.11%2B-146c64?style=flat-square)](requirements.txt)
[![MySQL](https://img.shields.io/badge/MySQL-8.4.10-b34d2d?style=flat-square)](docker-compose.yml)
[![Tests](https://img.shields.io/badge/tests-18%20passing-2f776d?style=flat-square)](tests)
[![Estado](https://img.shields.io/badge/estado-listo%20para%20entrenar-d39b2a?style=flat-square)](#estado-verificable)

**Wilson Alejandro Calderón Argueta · 22018**<br>
**Pablo Daniel Barillas Moreno · 22193**

Universidad del Valle de Guatemala · 2026

</div>

## Resultado actual

Este repositorio implementa el sistema completo de Text-to-SQL solicitado: preparación y auditoría de datos, validación real en MySQL 8.4.10, contrato de inferencia, seguridad de salida, baseline configurable, dos corridas QLoRA comparables, evaluación por ejecución, API FastAPI, interfaz React, informe LaTeX y presentación HTML. Solo falta ejecutar las corridas que necesitan GPU T4, elegir el adapter ganador y copiarlo a `adapter/`.

No se publican métricas ficticias. Los campos que dependen del entrenamiento permanecen en `null` o marcados como **Pendiente**.

## Estado verificable

| Componente | Estado | Evidencia |
|---|---|---|
| Dataset de entrenamiento | 2,592 pares aceptados, 12 esquemas | `datos/entrenamiento/aceptados.jsonl` |
| Validación propia | 40 casos, 2 esquemas inéditos | `datos/validacion/preguntas.jsonl` |
| Ejecución SQL | 2,632/2,632 referencias válidas, 0 descartes | `resultados/dataset_manifest.json` |
| Motor | MySQL 8.4.10 + `ONLY_FULL_GROUP_BY` | manifiesto versionado |
| Contrato y API | Implementados | `solucion.py`, `backend/` |
| Pruebas locales | 18 aprobadas | `tests/` |
| Web | 4 rutas, build de producción válido | `web/` |
| Entrenamiento QLoRA | Preparado; requiere T4 | `scripts/train_qlora.py` |
| Adapter final | Pendiente de las corridas | `adapter/` |
| Revisión humana de 100 filas | Pendiente del equipo | `datos/revision_muestra.csv` |

## Arquitectura

```text
datos + DDL/semillas ──> validación MySQL ──> dataset aceptado
                                                  │
                                ┌─────────────────┴─────────────────┐
                                v                                   v
                         QLoRA r=16                           QLoRA r=32
                                └────────> evaluación EX <──────────┘
                                               │
                                               v
                                     adapter/ + solucion.py
                                               │
                           ┌───────────────────┴───────────────────┐
                           v                                       v
                    evaluación oculta                        API + React
```

La ruta oficial no depende de la interfaz: el docente importa únicamente `generar_sql` desde `solucion.py`.

## Instalación local ligera

```powershell
uv venv --python 3.13
uv pip install --python .venv\Scripts\python.exe fastapi pydantic mysql-connector-python sqlglot pytest pytest-asyncio httpx nbformat pypdf uvicorn
docker compose up -d mysql
.\.venv\Scripts\python.exe scripts\validate_mysql.py
.\.venv\Scripts\python.exe -m pytest -q
```

Para instalar el runtime completo del modelo en Colab/T4:

```bash
pip install -r requirements-dev.txt
```

## Los tres notebooks

1. `notebooks/01_datos.ipynb`: regenera los datos, valida en MySQL y verifica volumen, dificultad y separación.
2. `notebooks/02_entrenamiento.ipynb`: documenta la hipótesis, verifica T4 y reserva el único paso pendiente: dos entrenamientos.
3. `notebooks/03_evaluacion.ipynb`: ejecuta baseline/adapters, compara EX ponderada y prueba una reparación.

## Entrenamiento pendiente en T4

Ejecuta primero smoke tests:

```bash
python scripts/train_qlora.py --config configuraciones/qlora_r16.json --output resultados/adapters/qlora_r16 --smoke
python scripts/train_qlora.py --config configuraciones/qlora_r32.json --output resultados/adapters/qlora_r32 --smoke
```

Luego quita `--smoke` para las corridas reales. Ambas configuraciones conservan modelo, datos, semilla, alpha, dropout y épocas; solo cambia `r` (16 frente a 32).

## Evaluación y selección

```bash
python scripts/run_validation.py --name baseline
python scripts/run_validation.py --name qlora_r16 --adapter resultados/adapters/qlora_r16
python scripts/run_validation.py --name qlora_r32 --adapter resultados/adapters/qlora_r32
python scripts/run_validation.py --name ganador_repair --adapter resultados/adapters/qlora_rXX --repair
python scripts/select_adapter.py resultados/adapters/qlora_rXX
```

Después de seleccionar, cambia `usar_adapter` a `true` en `config.json`, actualiza `resultados/resumen.json`, el informe y la presentación. El evaluador permite como máximo una generación y una reparación; queda por debajo del límite de tres llamadas a `ejecutar`.

## API y aplicación React

```powershell
.\.venv\Scripts\uvicorn.exe backend.main:app --reload
cd web
Copy-Item .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

Sin `NEXT_PUBLIC_API_URL`, la interfaz usa un fixture local claramente etiquetado. Con la API y `TEXT_TO_SQL_MODE=model`, usa el runtime local. Consulta [web/README.md](web/README.md).

## Estructura relevante

```text
adapter/          destino del adapter ganador
backend/          API FastAPI opcional
configuraciones/  QLoRA r=16 y r=32
datos/            esquemas, semillas, dataset, descartes y revisión
informe/          fuente LaTeX
notebooks/        flujo reproducible en tres etapas
presentacion/     presentación HTML imprimible
resultados/       manifiesto, CSV y salidas de corridas
scripts/          generación, validación, entrenamiento y auditoría
tests/            contrato, seguridad, evaluación, API y datos
text2sql/         runtime, prompt, seguridad y métricas
web/              Next.js 16 + React 19
```

## Auditoría de entrega

```powershell
.\.venv\Scripts\python.exe scripts\audit_delivery.py
```

La auditoría trata el adapter y la revisión humana como pendientes explícitos. Antes de entregar también deben completarse `BITACORA.md`, `CONTRIBUCIONES.md` y `historial_git.txt` con evidencia auténtica de ambos integrantes.

## Documentos

- [Plan de ejecución](docs/PLAN_PROYECTO.md)
- [Handoff de interfaz](docs/HANDOFF_V0.md)
- [Enunciado original](docs/enunciado/Proyecto_3_Texto_a_SQL.pdf)
- [Fuentes y licencias de datos](datos/FUENTES_Y_LICENCIAS.md)
- [Informe LaTeX](informe/main.tex) y [PDF compilado](output/pdf/informe.pdf)
- [Presentación HTML](presentacion/index.html)
- [Presentación PDF](presentacion.pdf)

## IA, licencias y honestidad académica

OpenAI Codex ayudó a estructurar, implementar y verificar artefactos; la interfaz inicial provino de v0 y fue revisada y reemplazada donde contenía datos simulados confusos. No se usa ninguna API externa durante la generación evaluada. El código propio se publica bajo MIT; las fuentes sintéticas y dependencias están identificadas. Los integrantes deben revisar el código, completar el control humano y poder explicar todas las decisiones.
