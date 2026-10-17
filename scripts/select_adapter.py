from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    parser = argparse.ArgumentParser(description="Copia el adapter ganador al directorio oficial adapter/.")
    parser.add_argument("source", type=Path, help="Directorio de la corrida ganadora.")
    args = parser.parse_args()
    source = (ROOT / args.source).resolve()
    target = (ROOT / "adapter").resolve()
    if not (source / "adapter_config.json").exists():
        raise FileNotFoundError(f"No existe adapter_config.json en {source}")
    if target.exists():
        for item in target.iterdir():
            if item.name != "README.md":
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()
    for item in source.iterdir():
        destination = target / item.name
        shutil.copytree(item, destination) if item.is_dir() else shutil.copy2(item, destination)
    manifest = {"selected_from": str(source.relative_to(ROOT)), "selection_basis": "weighted_execution_accuracy"}
    (target / "selection.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Adapter copiado a {target}")


if __name__ == "__main__":
    main()
