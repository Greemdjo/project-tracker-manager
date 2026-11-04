from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database  import get_db
from app.crud import project_developer as crud_pd
from app.schemas.project_developer  import ProjectDeveloperCreate, ProjectDeveloperResponse

router = APIRouter()

# 1. 
@router.post(
    "/",
    response_model = ProjectDeveloperResponse,
    status_code = status.HTTP_201_CREATED,
    summary="Добавить разработчиков в проект"
)
def assign_developer_to_project(pd:  ProjectDeveloperCreate, db: Session = Depends(get_db)):
    return crud_pd.create_project_developer(db, pd)

# 2.
@router.get(
    "/",
    response_model = List[ProjectDeveloperResponse],
    summary = "Получить все связи"
)
def read_project_developers(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    return crud_pd.get_project_developers(db, skip=skip, limit=limit)

@router.delete(
    "/{pd_id}",
    response_model = ProjectDeveloperResponse,
    summary = "Удалить связь"
)
def remove_developer_from_project(pd_id: int, db: Session = Depends(get_db)):
    db_pd = crud_pd.delete_project_developer(db, pd_id)
    if db_pd is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return db_pd