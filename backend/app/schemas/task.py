from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    estimated_pomodoros: int = Field(default=1, ge=1)


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    completed: bool | None = None
    estimated_pomodoros: int | None = Field(default=None, ge=1)
    completed_pomodoros: int | None = Field(default=None, ge=0)
    position: int | None = None


class TaskResponse(BaseModel):
    id: str
    title: str
    completed: bool
    estimated_pomodoros: int
    completed_pomodoros: int
    position: int
    created_at: str
