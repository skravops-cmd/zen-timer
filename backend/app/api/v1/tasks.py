from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models import User
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import create_task, delete_task, list_tasks, update_task

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task_endpoint(
    data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task = await create_task(current_user.id, data, db)
    return TaskResponse(
        id=str(task.id),
        title=task.title,
        completed=task.completed,
        estimated_pomodoros=task.estimated_pomodoros,
        completed_pomodoros=task.completed_pomodoros,
        position=task.position,
        created_at=task.created_at.isoformat(),
    )


@router.get("", response_model=list[TaskResponse])
async def list_tasks_endpoint(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    tasks = await list_tasks(current_user.id, db)
    return [
        TaskResponse(
            id=str(t.id),
            title=t.title,
            completed=t.completed,
            estimated_pomodoros=t.estimated_pomodoros,
            completed_pomodoros=t.completed_pomodoros,
            position=t.position,
            created_at=t.created_at.isoformat(),
        )
        for t in tasks
    ]


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task_endpoint(
    task_id: str,
    data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task = await update_task(current_user.id, task_id, data, db)
    return TaskResponse(
        id=str(task.id),
        title=task.title,
        completed=task.completed,
        estimated_pomodoros=task.estimated_pomodoros,
        completed_pomodoros=task.completed_pomodoros,
        position=task.position,
        created_at=task.created_at.isoformat(),
    )


@router.delete("/{task_id}", status_code=204)
async def delete_task_endpoint(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await delete_task(current_user.id, task_id, db)
