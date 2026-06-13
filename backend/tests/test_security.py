import pytest

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


class TestPassword:
    def test_hash_password_not_plaintext(self):
        hashed = hash_password('testpass123')
        assert hashed != 'testpass123'
        assert hashed.startswith('$2b$')

    def test_verify_password_correct(self):
        hashed = hash_password('testpass123')
        assert verify_password('testpass123', hashed) is True

    def test_verify_password_wrong(self):
        hashed = hash_password('testpass123')
        assert verify_password('wrongpass', hashed) is False


class TestTokens:
    def test_create_access_token_returns_string(self):
        token = create_access_token({'sub': 'user-1'})
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_refresh_token_returns_string(self):
        token = create_refresh_token({'sub': 'user-1'})
        assert isinstance(token, str)
        assert len(token) > 0

    def test_decode_token_valid(self):
        data = {'sub': 'user-1', 'username': 'test'}
        token = create_access_token(data)
        decoded = decode_token(token)
        assert decoded['sub'] == 'user-1'
        assert decoded['username'] == 'test'
        assert decoded['type'] == 'access'

    def test_decode_token_invalid_raises_valueerror(self):
        with pytest.raises(ValueError, match='Invalid or expired token'):
            decode_token('not-a-valid-token')
