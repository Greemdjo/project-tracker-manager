from sqlalchemy.orm import Session
from app.models.project_developer import ProjectDeveloper
from app.schemas.project_developer import ProjectDeveloperCreate

def get_project_developer(db: Session, pd_id: int):
    return db.query(ProjectDeveloper).filter(ProjectDeveloper.id == pd_id).first()

def get_project_developers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ProjectDeveloper).offset(skip).limit(limit).all()

def create_project_developer(db: Session, pd: ProjectDeveloperCreate):
    db_pd = ProjectDeveloper(**pd.model_dump() )
    db.add(db_pd)
    db.commit()
    db.refresh(db_pd)
    return db_pd

def delete_project_developer(db: Session, pd_id: int):
    db_pd = get_project_developer(db, pd_id)
    if db_pd:
        db.delete(db_pd)
        db.commit()
    return db_pd