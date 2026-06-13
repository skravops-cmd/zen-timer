from datetime import date, timedelta, datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import TimerSession
from app.schemas.session import SessionCreate
from app.schemas.stats import StatsResponse, DailyStats, ModeBreakdown, MonthlyHeatmapDay


async def create_session(user_id, data: SessionCreate, db: AsyncSession) -> TimerSession:
    session = TimerSession(
        user_id=user_id,
        mode=data.mode,
        duration_seconds=data.duration_seconds,
        completed_at=data.completed_at or datetime.now(timezone.utc),
        date=(data.completed_at or datetime.now(timezone.utc)).date(),
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def list_sessions(user_id, db: AsyncSession, offset: int = 0, limit: int = 20) -> tuple[list[TimerSession], int]:
    count_q = select(func.count(TimerSession.id)).where(TimerSession.user_id == user_id)
    total_result = await db.execute(count_q)
    total = total_result.scalar()

    q = (
        select(TimerSession)
        .where(TimerSession.user_id == user_id)
        .order_by(TimerSession.completed_at.desc())
        .offset(offset)
        .limit(limit)
    )
    result = await db.execute(q)
    sessions = list(result.scalars().all())
    return sessions, total


async def get_stats(user_id, db: AsyncSession) -> StatsResponse:
    today = date.today()
    thirty_days_ago = today - timedelta(days=29)

    focus_q = select(
        func.coalesce(func.sum(TimerSession.duration_seconds), 0)
    ).where(
        TimerSession.user_id == user_id,
        TimerSession.mode == "focus",
    )
    focus_result = await db.execute(focus_q)
    total_focus_seconds = focus_result.scalar()

    total_q = select(func.count(TimerSession.id)).where(TimerSession.user_id == user_id)
    total_result = await db.execute(total_q)
    total_sessions = total_result.scalar()

    avg_q = select(
        func.coalesce(func.avg(TimerSession.duration_seconds), 0)
    ).where(
        TimerSession.user_id == user_id,
        TimerSession.mode == "focus",
    )
    avg_result = await db.execute(avg_q)
    avg_seconds = int(avg_result.scalar())

    daily_q = select(
        TimerSession.date,
        func.coalesce(func.sum(TimerSession.duration_seconds), 0).label("total_seconds"),
        func.count(TimerSession.id).label("session_count"),
    ).where(
        TimerSession.user_id == user_id,
        TimerSession.date >= thirty_days_ago,
    ).group_by(TimerSession.date).order_by(TimerSession.date)
    daily_result = await db.execute(daily_q)
    daily_rows = daily_result.all()

    daily_map = {}
    for row in daily_rows:
        d = row[0]
        daily_map[d.isoformat()] = DailyStats(
            date=d.isoformat(),
            total_seconds=row[1],
            session_count=row[2],
        )

    daily_stats = []
    for i in range(30):
        d = thirty_days_ago + timedelta(days=i)
        ds = daily_map.get(d.isoformat(), DailyStats(date=d.isoformat(), total_seconds=0, session_count=0))
        daily_stats.append(ds)

    mode_q = select(
        TimerSession.mode,
        func.coalesce(func.sum(TimerSession.duration_seconds), 0).label("total_seconds"),
        func.count(TimerSession.id).label("session_count"),
    ).where(
        TimerSession.user_id == user_id,
    ).group_by(TimerSession.mode)
    mode_result = await db.execute(mode_q)
    mode_rows = mode_result.all()
    mode_breakdown = [
        ModeBreakdown(mode=row[0], total_seconds=row[1], session_count=row[2])
        for row in mode_rows
    ]

    streak = await _calculate_streak(user_id, db, today)

    first_of_month = today.replace(day=1)
    heatmap_q = select(
        TimerSession.date,
        func.coalesce(func.sum(TimerSession.duration_seconds), 0).label("total_seconds"),
        func.count(TimerSession.id).label("session_count"),
    ).where(
        TimerSession.user_id == user_id,
        TimerSession.date >= first_of_month,
    ).group_by(TimerSession.date).order_by(TimerSession.date)
    heatmap_result = await db.execute(heatmap_q)
    heatmap_rows = heatmap_result.all()
    monthly_heatmap = [
        MonthlyHeatmapDay(date=row[0].isoformat(), total_seconds=row[1], session_count=row[2])
        for row in heatmap_rows
    ]

    return StatsResponse(
        total_focus_seconds=total_focus_seconds,
        total_sessions=total_sessions,
        current_streak=streak,
        average_session_seconds=avg_seconds,
        daily_stats=daily_stats,
        mode_breakdown=mode_breakdown,
        monthly_heatmap=monthly_heatmap,
    )


async def _calculate_streak(user_id, db: AsyncSession, today: date) -> int:
    q = select(
        TimerSession.date,
    ).where(
        TimerSession.user_id == user_id,
    ).distinct().order_by(TimerSession.date.desc())
    result = await db.execute(q)
    dates = [row[0] for row in result.all()]

    if not dates:
        return 0

    streak = 0
    check_date = today

    for d in dates:
        if d == check_date:
            streak += 1
            check_date -= timedelta(days=1)
        elif d < check_date:
            break

    return streak
