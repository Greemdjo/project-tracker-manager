from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Создаем движок
engine = create_engine(
    settings.DATABASE_URL,
    echo=True, 
)

# Фабрика сессий
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Базовый класс для моделей
Base = declarative_base()

# 👇 ВОТ ЭТА ФУНКЦИЯ ДОЛЖНА БЫТЬ ОБЯЗАТЕЛЬНО
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
