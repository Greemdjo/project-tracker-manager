from sqlalchemy.orm import Session
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

def get_task(db: Session, task_id: int):
    """Получить задачу по ID"""
    return db.query(Task).filter(Task.id == task_id).first()

def  get_tasks(db: Session, skip: int=0, limit: int=100):
    """"Получить список всех задач в пагинации"""
    return db.query(Task).offset(skip).limit(limit).all()

def get_tasks_by_ground(db: Session, ground_id: int):
    """Получаем все задачи относящиеся к данному основанию"""
    return db.query(Task).filter(Task.ground_id == ground_id).all()

def create_task(db: Session, task: TaskCreate):
    """Создать новую задачу"""
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task: TaskUpdate):
    """Обновить задачу"""
    db_task = get_task(db, task_id)
    if not db_task:
        return None
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task,  key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    """Удалить задачу"""
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task