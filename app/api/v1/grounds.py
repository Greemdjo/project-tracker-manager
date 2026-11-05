from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud import ground as crud_ground
from app.schemas.ground import GroundCreate, GroundUpdate, GroundResponse

router = APIRouter()

# 1. Создание основания
@router.post(
    "/",
    response_model=GroundResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новое основание"
)
def create_ground(ground: GroundCreate, db: Session = Depends(get_db)):
    # ✅ Проверяем, нет ли уже основания у этого проекта (связь 1:1)
    existing_ground = crud_ground.get_ground_by_project(db, ground.project_id)
    if existing_ground:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="У этого проекта уже есть основание (связь 1:1)"
        )
        
    return crud_ground.create_ground(db, ground)
# 2. Получение списка всех оснований
@router.get(
    "/",
    response_model=List[GroundResponse],
    summary="Получить список всех оснований"
)
def read_grounds(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return crud_ground.get_grounds(db, skip=skip, limit=limit)

# 3. Получение одного основания
@router.get(
    "/{ground_id}",
    response_model = GroundResponse,
    summary = "Получить основание по ID"
)
def read_ground(ground_id: int, db: Session = Depends(get_db)):
    db_ground = crud_ground.db_ground(db, ground_id)
    if db_ground is None:
        raise HTTPException(status_code=404, detail="Ground not found")
    return db_ground

# 4. Получение основания по ID проекта(1:1)
@router.get(
    "/by-project/{project_id}",
    response_model = GroundResponse,
    summary = "Получить основание по ID проекта"
)
def read_ground_by_project(project_id: int, db: Session = Depends(get_db)):
    db_ground = crud_ground.get_ground_by_project(db, project_id)
    if db_ground is None:
        raise HTTPException(status_code=404, detail="Ground for this not found")
    return db_ground

# 5. Обновление основания
@router.put(
    "/{ground_id}",
    response_model = GroundResponse,
    summary = "Обновить состояние"
)
def update_ground(
    ground_id: int,
    ground: GroundUpdate,
    db: Session = Depends(get_db)
):
    db_ground = crud_ground.update_ground(db, ground_id, ground)
    if db_ground is None:
        raise HTTPException(status_code=404, detail="Ground  not found")
    return db_ground

# 6.Удаление Основания
@router.delete(
    "/{ground_id}",
    response_model = GroundResponse,
    summary = "Удалить основание"
)
def delete_ground(ground_id: int, db: Session = Depends(get_db)):
    db_ground = crud_ground.delete_ground(db, ground_id)
    if db_ground is None:
        raise HTTPException(status_code=404, detail="Ground not found")
    return db_ground