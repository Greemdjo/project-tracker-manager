from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date
from typing import Optional
from app.models.project import ProjectStatus

class ProjectCreate(BaseModel):
    nameProject: str = Field(..., max_length=255, description="Название проекта")
    status: ProjectStatus = Field(default=ProjectStatus.planning, description="Статус проекта")
    deadline: Optional[date] = None
    date_start: Optional[datetime] = None
    date_end: Optional[datetime] = None

class ProjectUpdate(BaseModel):
    nameProject: Optional[str] = Field(None, max_length=255)
    status: Optional[ProjectStatus] = None
    deadline: Optional[date] = None
    date_start: Optional[datetime] = None
    date_end: Optional[datetime] = None

# МОделька описания класса
class ProjectResponse(BaseModel):
    id: int
    nameProject: str
    status: ProjectStatus
    deadline: Optional[date]
    date_start: Optional[datetime]
    date_end: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
    