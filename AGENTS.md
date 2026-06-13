# Zen Timer — Developer Notes

## Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Run locally (needs PostgreSQL on localhost:5432)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs at http://localhost:8000/docs.

Create tables:
```bash
python -m app.migrate
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173 with Vite proxying /api to localhost:8000.

## Docker Compose (full stack)

```bash
docker compose up --build
```

- Frontend: http://localhost:80
- API: http://localhost:8000
- API docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432

## Key Design

- Guest mode: timer in localStorage, no API calls
- Auth mode: timer sessions synced to server on completion
- API uses JWT Bearer tokens (30min access, 7d refresh)
- Tables auto-created on startup via SQLAlchemy metadata
- No external chart library — stats use CSS/SVG bar charts
