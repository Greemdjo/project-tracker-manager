from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud import project as crud_project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter()

# 1. Создание проекта
@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новый проект"
)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    '''
    Создает новый проект.
        - **project_id**: ID - существующего проекта
        - **name_project**: Название проекта
        - **status**: статус проекта
        - **deadline**:
        - **date_start**: статус проекта
        - **date_end**: статус проекта
        
    '''
    return crud_project.create_project(db, project)

# 2. Получение списка всех проектов
@router.get(
    "/",
    response_model=List[ProjectResponse],
    summary="Получить список всех проектов"
)
def read_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud_project.get_projects(db, skip=skip, limit=limit)

# 3. Получение одного проекта
@router.get(
    "/{project_id}",
    response_model = ProjectResponse,
    summary = "Получить проект по ID"
)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud_project.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

# 4. Обновление проекта
@router.put(
    "/{project_id}",
    response_model = ProjectResponse,
    summary = "Обновить состояние проекта"
)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db)
):
    db_project = crud_project.update_project(db, project_id, project)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

# 5.Удаление проекта
@router.delete(
    "/{project_id}",
    response_model = ProjectResponse,
    summary = "Удалить проект"
)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud_project.delete_project(db, project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project