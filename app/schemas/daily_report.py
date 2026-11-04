from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

class DailyReportCreate(BaseModel):
    project_id: int = Field(..., description = "ID проекта")
    task_id: int = Field(..., description = "ID задачи")
    developer_id: int = Field(..., description="ID разработчика")
    cntHour: int = Field(default=0, description="Потрачено часов")

class DailyReportUpdate(BaseModel):
    cntHour: Optional[int] = Field(None, description="Обновить количество часов")

class DailyReportResponse(BaseModel):
    id: int
    project_id: int
    task_id: int
    developer_id: int
    cntHour: int
    reportDate: datetime

    model_config = ConfigDict(from_attributes=True)