# Adapter final

Este directorio es el único espacio pendiente para el modelo entrenado. Después de comparar `qlora_r16` y `qlora_r32` por exactitud de ejecución, ejecuta:

```bash
python scripts/select_adapter.py resultados/adapters/qlora_rXX
```

Debe contener como mínimo `adapter_config.json` y los pesos (`adapter_model.safetensors` o equivalente). Verifica que los archivos estén dentro del ZIP y no sean punteros de Git LFS. Luego establece `"usar_adapter": true` en `config.json` y ejecuta las pruebas finales.

No coloques aquí checkpoints intermedios ni ambos experimentos.
