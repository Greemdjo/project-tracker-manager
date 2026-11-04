from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class DeveloperCreate(BaseModel):
    username: str = Field(..., max_length=255, description="Уникальное имя пользователя (логин)")
    stek: List[str] = Field(default=[], description = "Список технологий/навыков")
    CompetenceLVL: str = Field(default="", max_length=255, description = "Уровень компетенции(например: Junior, Middle, Senior)")

class DeveloperUpdate(BaseModel):
    username: Optional[str]  = Field(None, max_length=255)
    stek: Optional[List[str]] = None
    CompetenceLVL: Optional[str] = Field(None, max_length=255)

class DeveloperResponse(BaseModel):
    id: int
    username: str
    stek: List[str]
    CompetenceLVL: str

    model_config = ConfigDict(from_attributes=True)
