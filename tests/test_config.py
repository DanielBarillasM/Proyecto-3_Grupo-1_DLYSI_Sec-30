from pathlib import Path

from text2sql.config import load_config


def test_config_has_allowed_model() -> None:
    config = load_config()
    assert config.modelo_base == "Qwen/Qwen2.5-Coder-1.5B-Instruct"
    assert config.semilla == 2026
    assert config.adapter == (Path.cwd() / "adapter").resolve()
