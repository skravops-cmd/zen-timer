import uuid

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url='http://test')


@pytest.fixture
async def auth_header(client):
    suffix = uuid.uuid4().hex[:8]
    payload = {
        'email': f'test_{suffix}@example.com',
        'username': f'testuser_{suffix}',
        'password': 'testpass123',
    }
    res = await client.post('/api/v1/auth/register', json=payload)
    token = res.json()['access_token']
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
async def registered_user(client):
    suffix = uuid.uuid4().hex[:8]
    payload = {
        'email': f'reg_{suffix}@example.com',
        'username': f'reguser_{suffix}',
        'password': 'testpass123',
    }
    await client.post('/api/v1/auth/register', json=payload)
    return payload
