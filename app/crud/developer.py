from sqlalchemy.orm import Session
from app.models.developer import Developer
from app.schemas.developer import DeveloperCreate, DeveloperUpdate

def get_developer(db: Session, developer_id: int):
    """Получить рарабочика по ID"""
    return db.query(Developer).filter(Developer.id == developer_id).first()

def get_developer_by_username(db: Session, username: str):
    """Получить разработчка по логину(username)"""
    return db.query(Developer).filter(Developer.username == username).first()

def get_developers(db: Session, skip: int=0, limit: int=100):
    """Получить список всех разработчиков с пагинацией"""
    return db.query(Developer).offset(skip).limit(limit).all()

def create_developer(db: Session, developer: DeveloperCreate):
    """Создать нового разработчика"""
    db_developer = Developer(**developer.model_dump() )
    db.add(db_developer)
    db.commit()
    db.refresh(db_developer)
    return db_developer

def update_developer(db: Session,  developer_id: int, developer: DeveloperUpdate):
    """Обновить данные разработчика"""
    db_developer  = get_developer(db,  developer_id)
    if not db_developer:
        return None
    for key, value  in developer.model_dump(exclude_unset=True).items():
        setattr(db_developer, key, value)
    db.commit()
    db.refresh(db_developer)
    return db_developer

