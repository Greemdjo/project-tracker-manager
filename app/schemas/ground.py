from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.ground import GroundType, GroundStatus

class GroundCreate(BaseModel):
    project_id: int = Field(..., description="Id проекта, к которому относится основание")
    title: str = Field(..., max_length=255, description="Название основания")
    ground_type: GroundType = Field(default=GroundType.creation, description="Тип основания")
    ground_status: GroundStatus = Field(default=GroundStatus.new, description="Статус основания")

class GroundUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    ground_type: Optional[GroundType] = None
    ground_status: Optional[GroundStatus] = None

class GroundResponse(BaseModel):
    id: int
    project_id: int
    title: str 
    ground_type: GroundType
    ground_status: GroundStatus
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)