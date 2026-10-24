# Contribuciones

Esta tabla representa la asignación actual. La columna de evidencia debe completarse únicamente con archivos, pull requests, commits o resultados reales.

| Tarea | Responsable principal | Revisor | Estado | Evidencia |
|---|---|---|---|---|
| Diseño y validación de esquemas de entrenamiento | Wilson Alejandro Calderón Argueta | Pablo Daniel Barillas Moreno | Implementado; revisión personal pendiente | `scripts/generate_data_assets.py`, `datos/esquemas/` |
| Conversión, traducción y ejecución de pares en MySQL | Wilson Alejandro Calderón Argueta | Pablo Daniel Barillas Moreno | Implementado; revisión personal pendiente | `scripts/validate_mysql.py`, `resultados/dataset_manifest.json` |
| Baseline y prompt común | Pablo Daniel Barillas Moreno | Wilson Alejandro Calderón Argueta | Implementado; medición pendiente | `text2sql/`, `solucion.py` |
| Entrenamiento QLoRA A y B | Pablo Daniel Barillas Moreno | Wilson Alejandro Calderón Argueta | Pendiente; se realizará en GPU local | - |
| Validación propia de 40 preguntas | Ambos | Ambos | SQL de referencia validado; predicciones pendientes | `datos/validacion/preguntas.jsonl`, `resultados/validacion_propia.csv` |
| Experimento de inferencia y análisis de errores | Ambos | Ambos | Pendiente | - |
| Aplicación React | Pablo Daniel Barillas Moreno | Wilson Alejandro Calderón Argueta | Implementada con asistencia de Codex; revisión personal pendiente | `web/`, build de producción |
| Informe y presentación | Ambos | Ambos | Borradores completos; métricas del modelo pendientes | `informe/main.tex`, `presentacion/index.html` |
| Compatibilidad final en Colab/T4 | Ambos | Ambos | Pendiente; sólo prueba del entorno docente | - |

## Evidencia aceptable

- Hash o enlace a un commit con cambios sustantivos.
- Pull request revisado por la otra persona.
- Ruta a notebook, script, dataset, adapter, tabla, figura o sección escrita.
- Registro de ejecución que permita reproducir el resultado.
- Log de entrenamiento con configuración, hardware, métricas y checksum.

La autoría debe actualizarse si el reparto real cambia; la evidencia prevalece sobre esta planificación. Los commits vacíos no sustituyen trabajo demostrable.
