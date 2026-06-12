from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Task
from app.schemas.task import TaskCreate, TaskUpdate


async def create_task(user_id, data: TaskCreate, db: AsyncSession) -> Task:
    max_pos_q = select(func.coalesce(func.max(Task.position), -1)).where(Task.user_id == user_id)
    result = await db.execute(max_pos_q)
    max_pos = result.scalar()

    task = Task(
        user_id=user_id,
        title=data.title,
        estimated_pomodoros=data.estimated_pomodoros,
        position=max_pos + 1,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def list_tasks(user_id, db: AsyncSession) -> list[Task]:
    q = (
        select(Task)
        .where(Task.user_id == user_id)
        .order_by(Task.position)
    )
    result = await db.execute(q)
    return list(result.scalars().all())


async def update_task(user_id, task_id, data: TaskUpdate, db: AsyncSession) -> Task:
    q = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await db.execute(q)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    await db.commit()
    await db.refresh(task)
    return task


async def delete_task(user_id, task_id, db: AsyncSession):
    q = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await db.execute(q)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    await db.delete(task)
    await db.commit()
