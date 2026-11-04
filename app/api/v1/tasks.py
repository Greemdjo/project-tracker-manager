from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import  List

from app.core.database import get_db
from app.crud import task as crud_task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter()


# 1. Создание задачи
@router.post(
    "/",
    response_model = TaskResponse,
    status_code = status.HTTP_201_CREATED,
    summary = "Создать задачу"
)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    return crud_task.create_task(db, task)


# 2. Получение списка всех задач
@router.get(
    "/",
    response_model = List[TaskResponse],
    summary = "Получить список всех задач"
)
def read_tasks(
    skip: int = 0,
    limit: int=100,
    db: Session = Depends(get_db)
):
    return crud_task.get_tasks(db, skip=skip, limit=limit)


# 3.Получение одной задачи по ID
@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Получить задачу по ID"
)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud_task.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code = 404, detail="Task not found")
    return db_task

# 4. Получение всех задач по ID основания
@router.get(
    "/by-ground/{ground_id}",
    response_model = List[TaskResponse],
    summary = "Получить все задачи по ID основания"
)
def read_tasks_by_ground(ground_id: int, db: Session = Depends(get_db)):
    return crud_task.get_tasks_by_ground(db, ground_id)


# 5. Обновление задачи
@router.put(
    "/{task_id}",
    response_model = TaskResponse,
    summary = "Обновить задачу"
)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session  =  Depends(get_db)
):
    db_task = crud_task.update_task(db, task_id, task)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


# 6. Удаление задачи
@router.delete(
    "/{task_id}",
    response_model = TaskResponse,
    summary = "Удалить задачу"
)
def delete_task(task_id:int, db: Session = Depends(get_db)):    
    db_task = crud_task.delete_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task
