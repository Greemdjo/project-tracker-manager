from pydantic import BaseModel, ConfigDict

class ProjectDeveloperCreate(BaseModel):
    project_id: int
    developer_id: int

class ProjectDeveloperResponse(BaseModel):
    id: int
    project_id: int
    developer_id: int

    model_config = ConfigDict(from_attributes=True)

    