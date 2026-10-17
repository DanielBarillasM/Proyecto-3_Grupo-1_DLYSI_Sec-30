from __future__ import annotations

from pathlib import Path

import nbformat
from nbformat.v4 import new_code_cell, new_markdown_cell


ROOT = Path(__file__).resolve().parents[1]


def save(name: str, title: str, cells: list) -> None:
    path = ROOT / "notebooks" / name
    notebook = nbformat.read(path, as_version=4)
    notebook["cells"] = [
        new_markdown_cell(f"# {title}\n\nProyecto 3 · Deep Learning y Sistemas Inteligentes · Sección 30"),
        *cells,
    ]
    notebook["metadata"]["kernelspec"] = {
        "display_name": "Python 3",
        "language": "python",
        "name": "python3",
    }
    nbformat.write(notebook, path)


def main() -> None:
    setup = """from pathlib import Path
import json
import subprocess
import sys

ROOT = Path.cwd()
if ROOT.name == "notebooks":
    ROOT = ROOT.parent
assert (ROOT / "config.json").exists(), "Ejecuta el notebook desde la raíz o notebooks/."
SEED = 2026"""
    save(
        "01_datos.ipynb",
        "Preparación y validación de datos",
        [
            new_markdown_cell(
                "## Objetivo y criterio de éxito\n\n"
                "Generar al menos 2,000 pares únicos sobre 12 esquemas propios, congelar 2 esquemas inéditos con 40 preguntas y aceptar únicamente SQL ejecutable en MySQL 8.4.10."
            ),
            new_code_cell(setup),
            new_markdown_cell("## 1. Generación determinista\n\nLa generación registra procedencia, licencia, dificultad, estado y hashes."),
            new_code_cell(
                "import subprocess\n"
                "import sys\n\n"
                "subprocess.run([sys.executable, str(ROOT / 'scripts' / 'generate_data_assets.py')], check=True)"
            ),
            new_markdown_cell(
                "## 2. Validación MySQL\n\n"
                "Antes de esta celda, inicia `docker compose up -d mysql`. El script exige versión 8.4.10 y `ONLY_FULL_GROUP_BY`."
            ),
            new_code_cell(
                "subprocess.run([sys.executable, str(ROOT / 'scripts' / 'validate_mysql.py')], check=True)"
            ),
            new_markdown_cell("## 3. Controles de fuga, volumen y dificultad"),
            new_code_cell(
                "manifest = json.loads((ROOT / 'resultados/dataset_manifest.json').read_text(encoding='utf-8'))\n"
                "assert manifest['training_accepted'] >= 2000\n"
                "assert manifest['training_schemas'] >= 10\n"
                "assert manifest['validation_examples'] == 40\n"
                "assert manifest['difficulty_validation'] == {'facil': 14, 'media': 14, 'dificil': 12}\n"
                "manifest"
            ),
            new_markdown_cell(
                "## Revisión final\n\n"
                "Completar `datos/revision_muestra.csv` con dos revisores humanos. No marcar el manifiesto como revisado antes de terminar las 100 filas."
            ),
        ],
    )
    save(
        "02_entrenamiento.ipynb",
        "Entrenamiento QLoRA controlado",
        [
            new_markdown_cell(
                "## Hipótesis registrada antes de entrenar\n\n"
                "Aumentar `r` de 16 a 32 puede mejorar consultas medias y difíciles al añadir capacidad para relaciones y composición SQL, a cambio de más parámetros y tiempo. La ganancia puede ser nula si el límite es la calidad de los datos."
            ),
            new_code_cell(setup),
            new_markdown_cell("## 1. Verificación de entorno T4"),
            new_code_cell(
                "import torch\n"
                "assert torch.cuda.is_available(), 'Activa GPU T4 en Colab.'\n"
                "print(torch.cuda.get_device_name(0))"
            ),
            new_markdown_cell("## 2. Confirmar que solo cambia el rango LoRA"),
            new_code_cell(
                "a = json.loads((ROOT / 'configuraciones/qlora_r16.json').read_text())\n"
                "b = json.loads((ROOT / 'configuraciones/qlora_r32.json').read_text())\n"
                "differences = {key: (a.get(key), b.get(key)) for key in sorted(a | b) if a.get(key) != b.get(key)}\n"
                "assert set(differences) <= {'nombre', 'r'}\n"
                "differences"
            ),
            new_markdown_cell(
                "## 3. Smoke test\n\n"
                "Ejecuta primero dos pasos por configuración. Si ambos terminan, quita `--smoke` para las corridas reales."
            ),
            new_code_cell(
                "RUN_TRAINING = False  # Cambiar a True únicamente en Colab T4.\n"
                "if RUN_TRAINING:\n"
                "    for name in ('qlora_r16', 'qlora_r32'):\n"
                "        subprocess.run([sys.executable, str(ROOT / 'scripts/train_qlora.py'), '--config', str(ROOT / f'configuraciones/{name}.json'), '--output', str(ROOT / f'resultados/adapters/{name}'), '--smoke'], check=True)\n"
                "else:\n"
                "    print('Espacio preparado. Activa RUN_TRAINING en T4.')"
            ),
            new_markdown_cell("## 4. Corridas completas"),
            new_code_cell(
                "RUN_FULL_TRAINING = False\n"
                "if RUN_FULL_TRAINING:\n"
                "    for name in ('qlora_r16', 'qlora_r32'):\n"
                "        subprocess.run([sys.executable, str(ROOT / 'scripts/train_qlora.py'), '--config', str(ROOT / f'configuraciones/{name}.json'), '--output', str(ROOT / f'resultados/adapters/{name}')], check=True)"
            ),
            new_markdown_cell(
                "## Artefactos esperados\n\nCada directorio contiene adapter, tokenizer, `run_metrics.json` y `log_history.json`. No selecciones por loss: la decisión final se toma por EX ponderada en el notebook 03."
            ),
        ],
    )
    save(
        "03_evaluacion.ipynb",
        "Evaluación por ejecución y análisis de errores",
        [
            new_markdown_cell(
                "## Objetivo\n\nComparar baseline, QLoRA r=16, QLoRA r=32 y el experimento de reparación sobre los mismos 2 esquemas inéditos y 40 ejemplos."
            ),
            new_code_cell(setup),
            new_markdown_cell("## 1. Ejecutar las corridas"),
            new_code_cell(
                "RUN_EVALUATION = False  # Activar cuando los adapters existan.\n"
                "commands = [\n"
                "    'python scripts/run_validation.py --name baseline',\n"
                "    'python scripts/run_validation.py --name qlora_r16 --adapter resultados/adapters/qlora_r16',\n"
                "    'python scripts/run_validation.py --name qlora_r32 --adapter resultados/adapters/qlora_r32',\n"
                "]\n"
                "if RUN_EVALUATION:\n"
                "    import shlex, subprocess, sys\n"
                "    for command in commands:\n"
                "        parts = shlex.split(command)[1:]\n"
                "        subprocess.run([sys.executable, str(ROOT / 'scripts/run_validation.py'), *parts], check=True)\n"
                "commands"
            ),
            new_markdown_cell("## 2. Comparar EX y elegir adapter"),
            new_code_cell(
                "runs = {}\n"
                "for path in (ROOT / 'resultados/corridas').glob('*.json') if (ROOT / 'resultados/corridas').exists() else []:\n"
                "    runs[path.stem] = json.loads(path.read_text(encoding='utf-8'))\n"
                "runs"
            ),
            new_markdown_cell(
                "## 3. Experimento de inferencia\n\nDespués de elegir el ganador, ejecútalo otra vez con `--repair`. Esa bandera habilita una única reparación si MySQL devuelve error."
            ),
            new_code_cell(
                "# Ejemplo:\n"
                "# !python scripts/run_validation.py --name ganador_directo --adapter resultados/adapters/qlora_rXX\n"
                "# !python scripts/run_validation.py --name ganador_repair --adapter resultados/adapters/qlora_rXX --repair"
            ),
            new_markdown_cell(
                "## 4. Selección y análisis\n\n"
                "Selecciona la mayor EX ponderada, copia con `scripts/select_adapter.py`, completa categorías de error y actualiza `resultados/resumen.json`. Conserva también resultados negativos."
            ),
        ],
    )


if __name__ == "__main__":
    main()
