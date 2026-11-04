import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL",
        "postgresql://postgres@localhost:5432/tracker_db")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "change_this_in_production")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

settings = Settings()
  