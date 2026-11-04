from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Enum
from sqlalchemy import func
import enum

from app.core.database import Base

class TaskStatus(enum.Enum):
    new = "new"
    active = "active"
    completed = "completed"
    frozen = "frozen"
    cancelled = "cancelled"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    ground_id = Column(Integer,
                        ForeignKey("grounds.id", ondelete="CASCADE"),
                        nullable=False 
                        )    
    parent_id = Column(Integer,
                        ForeignKey("tasks.id", ondelete="CASCADE"),
                        nullable=True
                        )
    status = Column(Enum(TaskStatus), default=TaskStatus.new, nullable=False)
    description = Column(String(255), nullable=True)
    planned_effort = Column(Integer, default = 0, nullable=False)
    actual_effort = Column(Integer, default = 0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default = func.now())
    updated_at = Column(DateTime(timezone=True), onupdate = func.now())
