from sqlalchemy.orm import Session
from app.models.ground import Ground
from app.schemas.ground import GroundCreate, GroundUpdate

# Получаем любое одно основание по ID
def get_ground(db: Session, ground_id: int):
    return db.query(Ground).filter(Ground.id == ground_id).first()

# Получаем основание конкретного проекта по project_id
def get_ground_by_project(db: Session, project_id: int):
    return db.query(Ground).filter(Ground.project_id == project_id).first()

# Получаем список иснований с пагинацией
def get_grounds(db: Session, skip: int=0, limit: int=100):
    return db.query(Ground).offset(skip).limit(limit).all()

# Создаем новое основание
def create_ground(db: Session, ground: GroundCreate):
    # Распаковываем данные
    db_ground = Ground(**ground.model_dump())
    db.add(db_ground)
    db.commit()
    db.refresh(db_ground)
    return db_ground

# Обновить основание
def update_ground(db: Session, ground_id: int, ground: GroundUpdate):
    db_ground = get_ground(db, ground_id)
    if not db_ground:
        return None
    for key, value in ground.model_dump(exclude_unset=True).items():
        setattr(db_ground, key, value)
    db.commit()
    db.refresh(db_ground)
    return db_ground

# Удалить основание
def delete_ground(db: Session, ground_id: int):
    db_ground = get_ground(db, ground_id)
    if db_ground:
        db.delete(db_ground)
        db.commit()
    return db_ground