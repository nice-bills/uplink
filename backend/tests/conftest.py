
import pytest
from httpx import AsyncClient
from src.main import app
from asgi_lifespan import LifespanManager

@pytest.fixture
async def client():
    async with LifespanManager(app):
        async with AsyncClient(app=app, base_url="http://test") as c:
            yield c
