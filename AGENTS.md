# AGENTS.md

## Cursor Cloud specific instructions

### Services overview

| Service | Directory | Port | Start command |
|---------|-----------|------|---------------|
| Backend (FastAPI) | `backend/` | 8000 | `uv run uvicorn src.main:app --reload --port 8000` |
| Frontend (Vite/React) | `frontend-vite/` | 3000 | `npm run dev` |

The backend uses SQLite (`sqlite+aiosqlite:///./genesis.db`) in dev — no external database needed.

### Environment setup

Both services need `.env` files. Copy from `.env.example` in each directory:
- **Backend** (`backend/.env`): Requires `DATABASE_URL`, `ADMIN_KEY`, and `AGENT_API_KEY` (min 32 chars). See `backend/.env.example`.
- **Frontend** (`frontend-vite/.env`): Requires `VITE_API_URL` (default `http://localhost:8000`). See `frontend-vite/.env.example`.

### Lint and test

- **Lint**: `cd backend && uv run ruff check .` (213 pre-existing lint issues as of initial commit)
- **Type check frontend**: `cd frontend-vite && npx tsc --noEmit` (pre-existing TS errors from framer-motion type conflicts and missing Vite env types)
- **Tests**: `cd backend && uv run python -m pytest tests/ -v` (3 pre-existing test failures due to httpx 0.28+ removing `AsyncClient(app=...)` parameter — conftest needs `ASGITransport`)

### Known issues

- Backend tests use `AsyncClient(app=app)` in `conftest.py` which is incompatible with httpx >= 0.28. Fix requires updating to `httpx.ASGITransport`.
- Campaign creation via API errors on SQLite due to UUID `.hex` attribute usage on string — a pre-existing SQLite/UUID compatibility issue.
- Frontend has TypeScript errors from framer-motion type conflicts with React's `onDrag` and `transition` props, and from `import.meta.env` references without Vite env type declarations.

### Dependencies

- **Backend**: Python 3.12+, `uv` package manager. Install with `uv sync --dev`.
- **Frontend**: Node.js 20+, npm. Install with `npm install`.
- `uv` must be on `PATH` — installed to `$HOME/.local/bin`.

### API authentication

- Admin endpoints require `X-Admin-Key` header matching `ADMIN_KEY` env var.
- Agent endpoints require `X-Agent-Key` header matching `AGENT_API_KEY` env var (min 32 chars).
