from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.core.database import Base

class TaskDeveloper(Base):
    __tablename__ = "tasks_developers"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, 
                        ForeignKey("tasks.id", ondelete="CASCADE"),
                        nullable=False
                        )
    developer_id = Column(Integer, 
                            ForeignKey("developers.id", ondelete="CASCADE"),
                            nullable=False
                            )
    
    __table_args__ = (
        UniqueConstraint('task_id', 'developer_id', name='unique_task_developer'),
    )
    