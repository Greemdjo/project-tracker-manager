from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud import developer as crud_developer
from app.schemas.developer import DeveloperCreate, DeveloperUpdate, DeveloperResponse

router = APIRouter()

# 1. Создание разработчика
@router.post(
    "/",
    response_model=DeveloperResponse,
    status_code = status.HTTP_201_CREATED,
    summary = "Добавить нового разработчика"
)
def create_developer(developer: DeveloperCreate, db: Session = Depends(get_db)):
    # Проверяем на уникальность логина(username)
    db_dev = crud_developer.get_developer_by_username(db, developer.username)
    if db_dev:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Developer with this username already exists"
        )
    return crud_developer.create_developer(db, developer)

# 2. Получение списка всех разработчиков
@router.get(
    "/",
    response_model=List[DeveloperResponse],
    summary = "Получить список всех разработчиков"
)

def read_developers(
    skip: int=0,
    limit: int=100,
    db: Session=Depends(get_db)
):
    return crud_developer.get_developers(db, skip=skip, limit=limit)


# 3. Получение разработчика по ID
@router.get(
    "/{developer_id}",
    response_model = DeveloperResponse,
    summary = "Получить разработика по ID"
)
def read_developer(developer_id: int, db: Session = Depends(get_db) ):
    db_developer = crud_developer.get_developer(db, developer_id)
    if db_developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return db_developer


# 4. Обновление данных разработчиков
@router.put(
    "/{developer_id}",
    response_model = DeveloperResponse,
    summary =  "Обновить данные разработчика"
)
def update_developer(
    developer_id: int,
    developer: DeveloperUpdate,
    db: Session = Depends(get_db)
):
    db_developer =  crud_developer.update_developer(db,  developer_id, developer)
    if db_developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return  db_developer


# 5. Удаление разработчика
@router.delete(
    "/{developer_id}",
    response_model = DeveloperResponse,
    summary = "Удалить разработчика"
)
def delete_developer(developer_id: int, db: Session=Depends(get_db)):
    db_developer = crud_developer.delete_developer(db, developer_id)
    if  db_developer is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return db_developer