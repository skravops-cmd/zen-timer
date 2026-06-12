from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import User
from app.schemas.stats import StatsResponse
from app.services.session_service import get_stats

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("", response_model=StatsResponse)
async def get_stats_endpoint(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_stats(current_user.id, db)
