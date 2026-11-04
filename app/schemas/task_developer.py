from pydantic import BaseModel, ConfigDict

class TaskDeveloperCreate(BaseModel):
    task_id: int
    developer_id: int

class TaskDeveloperResponse(BaseModel):
    id: int
    task_id: int
    developer_id: int 

    model_config = ConfigDict(from_attributes=True)