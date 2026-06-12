from pydantic import BaseModel


class DailyStats(BaseModel):
    date: str
    total_seconds: int
    session_count: int


class ModeBreakdown(BaseModel):
    mode: str
    total_seconds: int
    session_count: int


class MonthlyHeatmapDay(BaseModel):
    date: str
    total_seconds: int
    session_count: int


class StatsResponse(BaseModel):
    total_focus_seconds: int
    total_sessions: int
    current_streak: int
    average_session_seconds: int
    daily_stats: list[DailyStats]
    mode_breakdown: list[ModeBreakdown]
    monthly_heatmap: list[MonthlyHeatmapDay]
