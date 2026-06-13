import uuid

REGISTER_URL = '/api/v1/auth/register'
LOGIN_URL = '/api/v1/auth/login'
REFRESH_URL = '/api/v1/auth/refresh'
ME_URL = '/api/v1/auth/me'


class TestRegister:
    async def test_success(self, client):
        suffix = uuid.uuid4().hex[:8]
        payload = {
            'email': f'new_{suffix}@example.com',
            'username': f'newuser_{suffix}',
            'password': 'testpass123',
        }
        res = await client.post(REGISTER_URL, json=payload)
        assert res.status_code == 201
        data = res.json()
        assert 'access_token' in data
        assert 'refresh_token' in data
        assert data['token_type'] == 'bearer'

    async def test_duplicate_email(self, client):
        suffix = uuid.uuid4().hex[:8]
        email = f'dup_{suffix}@example.com'
        payload = {
            'email': email,
            'username': f'user_{suffix}',
            'password': 'testpass123',
        }
        await client.post(REGISTER_URL, json=payload)

        payload2 = {
            'email': email,
            'username': f'user2_{suffix}',
            'password': 'testpass123',
        }
        res = await client.post(REGISTER_URL, json=payload2)
        assert res.status_code == 400
        assert 'already registered' in res.json()['detail'].lower()

    async def test_duplicate_username(self, client):
        suffix = uuid.uuid4().hex[:8]
        username = f'dupuser_{suffix}'
        payload = {
            'email': f'a_{suffix}@example.com',
            'username': username,
            'password': 'testpass123',
        }
        await client.post(REGISTER_URL, json=payload)

        payload2 = {
            'email': f'b_{suffix}@example.com',
            'username': username,
            'password': 'testpass123',
        }
        res = await client.post(REGISTER_URL, json=payload2)
        assert res.status_code == 400
        assert 'already taken' in res.json()['detail'].lower()


class TestLogin:
    async def test_success(self, client, registered_user):
        res = await client.post(
            LOGIN_URL,
            json={
                'username': registered_user['username'],
                'password': registered_user['password'],
            },
        )
        assert res.status_code == 200
        data = res.json()
        assert 'access_token' in data
        assert 'refresh_token' in data

    async def test_invalid_credentials(self, client):
        res = await client.post(
            LOGIN_URL,
            json={'username': 'nonexistent', 'password': 'wrongpass'},
        )
        assert res.status_code == 401
        assert 'invalid' in res.json()['detail'].lower()


class TestRefresh:
    async def test_success(self, client):
        suffix = uuid.uuid4().hex[:8]
        payload = {
            'email': f'ref_{suffix}@example.com',
            'username': f'refuser_{suffix}',
            'password': 'testpass123',
        }
        reg = await client.post(REGISTER_URL, json=payload)
        refresh_token = reg.json()['refresh_token']

        res = await client.post(REFRESH_URL, json={'refresh_token': refresh_token})
        assert res.status_code == 200
        data = res.json()
        assert 'access_token' in data
        assert 'refresh_token' in data

    async def test_with_access_token_fails(self, client):
        suffix = uuid.uuid4().hex[:8]
        payload = {
            'email': f'badref_{suffix}@example.com',
            'username': f'badref_{suffix}',
            'password': 'testpass123',
        }
        reg = await client.post(REGISTER_URL, json=payload)
        access_token = reg.json()['access_token']

        res = await client.post(REFRESH_URL, json={'refresh_token': access_token})
        assert res.status_code == 401
        assert 'invalid token type' in res.json()['detail'].lower()

    async def test_invalid_token(self, client):
        res = await client.post(
            REFRESH_URL, json={'refresh_token': 'not-a-valid-token'}
        )
        assert res.status_code == 401


class TestGetMe:
    async def test_success(self, client, auth_header):
        res = await client.get(ME_URL, headers=auth_header)
        assert res.status_code == 200
        data = res.json()
        assert 'id' in data
        assert 'email' in data
        assert 'username' in data

    async def test_unauthenticated(self, client):
        res = await client.get(ME_URL)
        assert res.status_code == 401

    async def test_invalid_token(self, client):
        res = await client.get(
            ME_URL, headers={'Authorization': 'Bearer invalid-token'}
        )
        assert res.status_code == 401
