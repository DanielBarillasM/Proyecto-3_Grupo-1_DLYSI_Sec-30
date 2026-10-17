# Fuentes y licencias de datos

El dataset incluido en este repositorio es sintético. OpenAI Codex generó las plantillas de preguntas y SQL sobre 12 esquemas propios del equipo; el código y los datos resultantes se distribuyen bajo la licencia MIT del repositorio.

No se redistribuyen Spider, BIRD ni datos personales. Cada registro conserva `fuente`, `generado_por`, `licencia`, estado de validación y motivo de descarte. Las consultas solo pasan de `candidatos.jsonl` a `aceptados.jsonl` después de ejecutarse en MySQL 8.4.10 con `ONLY_FULL_GROUP_BY`.

La hoja `revision_muestra.csv` contiene una muestra estratificada y determinista de 100 ejemplos. Los integrantes deben completar las columnas de revisor, decisión y observaciones antes de congelar el dataset; el repositorio no atribuye una revisión humana que todavía no ocurrió.
