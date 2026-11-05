from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.task import TaskStatus

class TaskCreate(BaseModel):
	title: str = Field(..., max_length=255, description="Название задачи")
	ground_id: int = Field(..., description="ID основания, к которому относится задача")
	parent_id: Optional[int]=Field(None, description="ID родительской задачи, если есть")
	status: TaskStatus=Field(default=TaskStatus.new, description="Статус задачи")
	description: Optional[str] = Field(None, max_length=255, description="Описание задачи")
	planned_effort: int = Field(default=0, description="Плановая трудоёмкость в часах")
	actual_effort: int = Field(default=0, description="Фактическая трудоёмкость в часах")

class TaskUpdate(BaseModel):
	title: Optional[str] = Field(None, max_length=255)
	ground_id: Optional[int] = None
	parent_id: Optional[int] = None
	status: Optional[TaskStatus] = None
	description: Optional[str] = None
	planned_effort: Optional[int] = None
	actual_effort: Optional[int] = None

class TaskResponse(BaseModel):
	id: int
	title: str
	ground_id: int
	parent_id: Optional[int]
	status: TaskStatus
	description: Optional[str]
	planned_effort: int
	actual_effort: int
	created_at: Optional[datetime]
	updated_at:  Optional[datetime]
	model_config = ConfigDict(from_attributes=True)