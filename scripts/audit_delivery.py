from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def main() -> None:
    manifest = json.loads((ROOT / "resultados/dataset_manifest.json").read_text(encoding="utf-8"))
    config = json.loads((ROOT / "config.json").read_text(encoding="utf-8"))
    required = [
        "solucion.py",
        "config.json",
        "requirements.txt",
        "adapter/README.md",
        "datos/revision_muestra.csv",
        "informe/main.tex",
        "output/pdf/informe.pdf",
        "presentacion/index.html",
        "presentacion.pdf",
        "resultados/validacion_propia.csv",
        "BITACORA.md",
        "CONTRIBUCIONES.md",
        "historial_git.txt",
    ]
    missing = [path for path in required if not (ROOT / path).exists()]
    adapter_ready = (ROOT / "adapter/adapter_config.json").exists()
    checks = {
        "required_files_present": not missing,
        "training_pairs_at_least_2000": manifest["training_accepted"] >= 2000,
        "mysql_validation_complete": manifest["mysql_validation_complete"],
        "validation_has_40_examples": manifest["validation_examples"] == 40,
        "human_review_complete": manifest["human_review_complete"],
        "adapter_ready": adapter_ready,
        "adapter_enabled_consistently": (not config["usar_adapter"]) or adapter_ready,
    }
    print(json.dumps({"checks": checks, "missing": missing}, indent=2, ensure_ascii=False))
    if not all(value for key, value in checks.items() if key not in {"human_review_complete", "adapter_ready", "adapter_enabled_consistently"}):
        raise SystemExit(1)

if __name__ == "__main__":
    main()
