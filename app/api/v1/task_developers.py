from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud import task_developer as crud_td
from app.schemas.task_developer import TaskDeveloperCreate, TaskDeveloperResponse

router = APIRouter()


@router.post(
    "/",
    response_model = TaskDeveloperResponse,
    status_code=status.HTTP_201_CREATED,
    summary = "Назначить разработчика на задачу"
)
def assign_developer_to_task(td: TaskDeveloperCreate, db: Session=Depends(get_db)):
    return crud_td.create_task_developer(db, td)


@router.get(
    "/",
    response_model=List[TaskDeveloperResponse],
    summary="Получить все назначения на задачи"
)
def read_task_developers(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    return crud_td.get_task_developers(db, skip=skip, limit=limit)


@router.delete(
    "/{td_id}",
    response_model=TaskDeveloperResponse,
    summary="Снять разработчика с  задачи"
)
def remove_developer_from_task(td_id: int, db: Session=Depends(get_db)):
    db_td = crud_td.delete_task_developer(db, td_id)
    if db_td is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return db_td
