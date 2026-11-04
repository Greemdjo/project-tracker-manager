from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy import func
import enum

from app.core.database import Base

class GroundType(enum.Enum):
    creation = "creation"
    development = "development"

class GroundStatus(enum.Enum):
    new = "new"
    grade = "grade"
    active = "active"
    completed = "completed"

class Ground(Base):
    __tablename__ = "grounds"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer,
                            ForeignKey("projects.id", ondelete="CASCADE"),
                            unique=True, nullable=False
                            )
    title = Column(String(255), nullable=False)
    ground_type = Column(Enum(GroundType), default = GroundType.creation, nullable = False)
    ground_status = Column(Enum(GroundStatus), default = GroundStatus.new,  nullable = False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    