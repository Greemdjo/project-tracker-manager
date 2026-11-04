from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud  import daily_report as crud_report
from app.schemas.daily_report import DailyReportCreate, DailyReportUpdate, DailyReportResponse

router = APIRouter()


# 1. Создание отчета
@router.post(
    "/",
    response_model=DailyReportResponse,
    status_code=status.HTTP_201_CREATED,
    summary = "Создать отчет"
)
def create_report(report: DailyReportCreate, db:Session = Depends(get_db)):
    return crud_report.create_report(db, report)


# 2.Получить все отчеты
@router.get(
    "/",
    response_model=List[DailyReportResponse],
    summary = "Получить все отчеты"
)
def read_reports(skip: int=0, limit: int=100, db: Session = Depends(get_db)):
    return crud_report.get_reports(db, skip=skip, limit=limit)


# 3. Получить отчеты конкретого разраотчика
@router.get(
    "/by-developer/{developer_id}",
    response_model = List[DailyReportResponse],
    summary = "Получить отчеты разработчика"
)
def read_reports_by_developer(developer_id: int, db: Session = Depends(get_db)):
    return crud_report.get_reports_by_developer(db, developer_id)


# 4. Получить один отчет по ID
@router.get(
    "/{report_id}",
    response_model=DailyReportResponse,
    summary="Получить отчет по ID"
)
def read_report(report_id: int, db: Session = Depends(get_db)):
    db_report = crud_report.get_report(db, report_id)
    if db_report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report


# 5. Обновить отчет
@router.put(
    "/{report_id}",
    response_model=DailyReportResponse,
    summary="Обновить отчет(изменить часы)"
)
def update_report(report_id: int, report: DailyReportUpdate, db: Session = Depends(get_db)):
    db_report = crud_report.update_report(db, report_id, report)
    if db_report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report


# 6.Удалить отчет
@router.delete(
    "/{report_id}",
    response_model = DailyReportResponse,
    summary = "Удалить отчет"
)
def delete_report(report_id: int, db: Session = Depends(get_db)):
    db_report = crud_report.delete_report(db, report_id)
    if db_report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report