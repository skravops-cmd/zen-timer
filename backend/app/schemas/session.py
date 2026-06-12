from datetime import datetime
from pydantic import BaseModel, Field


class SessionCreate(BaseModel):
    mode: str = Field(..., pattern="^(focus|short_break|long_break)$")
    duration_seconds: int = Field(..., gt=0)
    completed_at: datetime | None = None


class SessionResponse(BaseModel):
    id: str
    mode: str
    duration_seconds: int
    completed_at: str
    date: str


class SessionListResponse(BaseModel):
    sessions: list[SessionResponse]
    total: int
    offset: int
    limit: int
