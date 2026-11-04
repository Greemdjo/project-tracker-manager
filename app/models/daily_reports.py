from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key = True, index = True)
    project_id = Column(Integer, 
                            ForeignKey("projects.id", ondelete="CASCADE"),
                            nullable=False
                            )
    task_id = Column(Integer,
                        ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False
                        )
    developer_id = Column(Integer, 
                            ForeignKey("developers.id", ondelete="CASCADE"),
                            nullable=False
                            )
    cntHour = Column(Integer, nullable=False)
    reportDate = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)