# Contribuciones

Esta tabla empieza como asignación de responsabilidad. La columna de evidencia se completará únicamente con archivos, pull requests o commits reales.

| Tarea | Responsable principal | Revisor | Estado | Evidencia |
|---|---|---|---|---|
| Diseño y validación de esquemas de entrenamiento | Wilson Alejandro Calderón Argueta | Pablo Daniel Barillas Moreno | Implementado; revisión personal pendiente | `scripts/generate_data_assets.py`, `datos/esquemas/` |
| Conversión, traducción y ejecución de pares en MySQL | Wilson Alejandro Calderón Argueta | Pablo Daniel Barillas Moreno | Implementado; revisión personal pendiente | `scripts/validate_mysql.py`, `resultados/dataset_manifest.json` |
| Baseline y prompt común | Pablo Daniel Barillas Moreno | Wilson Alejandro Calderón Argueta | Implementado; medición pendiente | `text2sql/`, `solucion.py` |
| Entrenamiento QLoRA A y B | Pablo Daniel Barillas Moreno | Wilson Alejandro Calderón Argueta | Pendiente | - |
| Validación propia de 40 preguntas | Ambos | Ambos | SQL de referencia validado; predicciones pendientes | `datos/validacion/preguntas.jsonl`, `resultados/validacion_propia.csv` |
| Experimento de inferencia y análisis de errores | Ambos | Ambos | Pendiente | - |
| Aplicación React | Pablo Daniel Barillas Moreno | Wilson Alejandro Calderón Argueta | Implementada con asistencia de Codex; revisión personal pendiente | `web/`, build de producción |
| Informe y presentación | Ambos | Ambos | Borradores completos; métricas del modelo pendientes | `informe/main.tex`, `presentacion/index.html` |
| Auditoría final en Colab T4 | Ambos | Ambos | Pendiente | - |

## Evidencia aceptable

- Hash o enlace a commit propio.
- Pull request con revisión de la otra persona.
- Ruta a notebook, script, dataset, adapter, tabla, figura o sección escrita.
- Registro de ejecución que permita reproducir el resultado.

La autoría se actualizará si el reparto real cambia; la evidencia prevalece sobre esta planificación.
