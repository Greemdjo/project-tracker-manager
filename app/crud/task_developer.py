from sqlalchemy.orm import Session
from app.models.task_developer import TaskDeveloper
from app.schemas.task_developer import TaskDeveloperCreate

def get_task_developer(db: Session, td_id:  int):
    return db.query(TaskDeveloper).filter(TaskDeveloper.id == td_id).first()

def get_task_developers(db: Session, skip: int=0, limit: int = 100):
    return db.query(TaskDeveloper).offset(skip).limit(limit).all()

def create_task_developer(db: Session, td: TaskDeveloperCreate):
    db_td = TaskDeveloper(**td.model_dump())
    db.add(db_td)
    db.commit()
    db.refresh(db_td)
    return db_td

def delete_task_developer(db: Session, td_id: int):
    db_td = get_task_developer(db, td_id)
    if db_td:
        db.delete(db_td)
        db.commit()
    return db_td
