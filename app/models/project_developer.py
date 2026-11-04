from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.core.database import Base

class ProjectDeveloper(Base):
    __tablename__ = "projects_developers"

    id = Column(Integer, primary_key = True, index = True)
    project_id = Column(Integer,
                            ForeignKey("projects.id", ondelete="CASCADE"),
                            nullable=False)
    developer_id = Column(Integer,
                            ForeignKey("developers.id", ondelete="CASCADE"),
                            nullable=False)

    __table_args__ = (
        UniqueConstraint('project_id', 'developer_id', name='unique_project_developer'),
    )