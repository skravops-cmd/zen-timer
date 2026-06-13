STATS_URL = '/api/v1/stats'
SESSIONS_URL = '/api/v1/sessions'


class TestGetStats:
    async def test_empty(self, client, auth_header):
        res = await client.get(STATS_URL, headers=auth_header)
        assert res.status_code == 200
        data = res.json()
        assert data['total_focus_seconds'] == 0
        assert data['total_sessions'] == 0
        assert data['current_streak'] == 0
        assert data['average_session_seconds'] == 0
        assert len(data['daily_stats']) == 30  # last 30 days filled with zeros
        assert all(d['total_seconds'] == 0 for d in data['daily_stats'])
        assert data['mode_breakdown'] == []
        assert data['monthly_heatmap'] == []

    async def test_with_sessions(self, client, auth_header):
        for _ in range(3):
            await client.post(
                SESSIONS_URL,
                headers=auth_header,
                json={'mode': 'focus', 'duration_seconds': 1500},
            )
        await client.post(
            SESSIONS_URL,
            headers=auth_header,
            json={'mode': 'short_break', 'duration_seconds': 300},
        )

        res = await client.get(STATS_URL, headers=auth_header)
        assert res.status_code == 200
        data = res.json()
        assert data['total_focus_seconds'] >= 4500
        assert data['total_sessions'] >= 4
        assert data['average_session_seconds'] > 0
        assert len(data['daily_stats']) > 0
        assert len(data['mode_breakdown']) >= 2
        assert data['current_streak'] >= 1
        assert len(data['monthly_heatmap']) > 0
