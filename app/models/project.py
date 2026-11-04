from sqlalchemy import Column, Integer, String, DateTime, Enum
import enum
from app.core.database import Base

class ProjectStatus(enum.Enum):
    planning = "planning"
    active = "active"
    completed = "completed"
    frozen = "frozen"
    cancelled = "cancelled"

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    nameProject = Column(String(255), nullable=False, unique=True, index=True)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.planning, nullable=False)
    deadline = Column(DateTime(timezone=True), nullable=True)
    date_start = Column(DateTime(timezone=True), nullable=True)
    date_end = Column(DateTime(timezone=True), nullable=True)