from sqlalchemy import Column, Integer, String, ARRAY
from app.core.database import Base

class Developer(Base):
    __tablename__ = "developers"

    id = Column(Integer, primary_key = True, index = True)
    username = Column(String(255), unique=True, nullable=False)
    stek = Column(ARRAY(String), default=[], nullable=False)
    CompetenceLVL = Column(String(255), default="", nullable=False)