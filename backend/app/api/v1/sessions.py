from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import User
from app.schemas.session import SessionCreate, SessionResponse, SessionListResponse
from app.services.session_service import create_session, list_sessions

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("", response_model=SessionResponse, status_code=201)
async def create_session_endpoint(
    data: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    session = await create_session(current_user.id, data, db)
    return SessionResponse(
        id=str(session.id),
        mode=session.mode,
        duration_seconds=session.duration_seconds,
        completed_at=session.completed_at.isoformat(),
        date=session.date.isoformat(),
    )


@router.get("", response_model=SessionListResponse)
async def list_sessions_endpoint(
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    sessions, total = await list_sessions(current_user.id, db, offset, limit)
    return SessionListResponse(
        sessions=[
            SessionResponse(
                id=str(s.id),
                mode=s.mode,
                duration_seconds=s.duration_seconds,
                completed_at=s.completed_at.isoformat(),
                date=s.date.isoformat(),
            )
            for s in sessions
        ],
        total=total,
        offset=offset,
        limit=limit,
    )
