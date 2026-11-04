from fastapi import FastAPI
from app.api.v1.grounds import router as grounds_router
from app.api.v1.projects import router as projects_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.developers import router  as developers_router
from app.api.v1.project_developers import router as project_developers_router
from app.api.v1.task_developers import router as task_developers_router
from app.api.v1.daily_reports import router as daily_reports_router
from fastapi.middleware.cors import CORSMiddleware

# 1. Создаем экземпляр приложения FastAPI
app = FastAPI(title="Project Tracker API")

# Подключаем роутеры
app.include_router(
	grounds_router,
	prefix="/api/v1/grounds",
	tags=["grounds"]
)
app.include_router(
	projects_router,
	prefix="/api/v1/projects",
	tags=["projects"]
)
app.include_router(
  tasks_router,
  prefix="/api/v1/tasks",
  tags=["tasks"]
)
app.include_router(
  developers_router,
  prefix="/api/v1/developers",
  tags=["developers"]
)
app.include_router(
  project_developers_router,
  prefix="/api/v1/project_developers",
  tags=["project_developers"]
)
app.include_router(
  task_developers_router,
  prefix="/api/v1/task_developers",
  tags=["task_developers"]
)
app.include_router(
  daily_reports_router,
  prefix="/api/v1/daily_reports",
  tags=["daily_reports"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # ✅ Указываем точный адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Текстовый эндпоинт для проверки
@app.get("/")
def root():
  return{"message": "API is working!"}
