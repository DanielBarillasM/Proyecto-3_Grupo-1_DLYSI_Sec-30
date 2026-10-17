import pytest
from httpx import ASGITransport, AsyncClient

from backend.main import app


@pytest.fixture
async def client() -> AsyncClient:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as http:
        yield http


@pytest.mark.asyncio
async def test_health(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["mode"] == "fixture"


@pytest.mark.asyncio
async def test_fixture_generation_is_honest_and_bounded(client: AsyncClient) -> None:
    response = await client.post(
        "/api/generate",
        json={
            "esquema": "CREATE TABLE customers (customer_id INT PRIMARY KEY);",
            "pregunta": "¿Qué ciudad generó más ingresos?",
            "variante": "base",
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == "fixture"
    assert payload["sql"].startswith("SELECT")
    assert len(payload["execution"]["filas"]) <= 10


@pytest.mark.asyncio
async def test_model_mode_reports_missing_adapter(client: AsyncClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("TEXT_TO_SQL_MODE", "model")
    response = await client.post(
        "/api/generate",
        json={
            "esquema": "CREATE TABLE clientes (id INT PRIMARY KEY);",
            "pregunta": "¿Cuántos clientes existen?",
            "variante": "qlora",
        },
    )
    assert response.status_code == 503
    assert "adapter" in response.json()["detail"].lower()
