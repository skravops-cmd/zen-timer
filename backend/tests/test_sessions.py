SESSIONS_URL = '/api/v1/sessions'


class TestCreateSession:
    async def test_success(self, client, auth_header):
        res = await client.post(
            SESSIONS_URL,
            headers=auth_header,
            json={'mode': 'focus', 'duration_seconds': 1500},
        )
        assert res.status_code == 201
        data = res.json()
        assert data['mode'] == 'focus'
        assert data['duration_seconds'] == 1500
        assert 'id' in data

    async def test_unauthenticated(self, client):
        res = await client.post(
            SESSIONS_URL,
            json={'mode': 'focus', 'duration_seconds': 1500},
        )
        assert res.status_code == 401


class TestListSessions:
    async def test_empty(self, client, auth_header):
        res = await client.get(SESSIONS_URL, headers=auth_header)
        assert res.status_code == 200
        data = res.json()
        assert data['sessions'] == []
        assert data['total'] == 0

    async def test_pagination(self, client, auth_header):
        for i in range(3):
            await client.post(
                SESSIONS_URL,
                headers=auth_header,
                json={
                    'mode': 'focus' if i % 2 == 0 else 'short_break',
                    'duration_seconds': 1500 - i * 100,
                },
            )

        res = await client.get(
            f'{SESSIONS_URL}?offset=0&limit=2', headers=auth_header
        )
        assert res.status_code == 200
        data = res.json()
        assert len(data['sessions']) == 2
        assert data['total'] == 3
        assert data['offset'] == 0
        assert data['limit'] == 2
