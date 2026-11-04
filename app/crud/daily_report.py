from sqlalchemy.orm import Session
from app.models.daily_reports import DailyReport
from app.schemas.daily_report import DailyReportCreate, DailyReportUpdate, DailyReportResponse

def get_report(db: Session, report_id: int):
    """Получить один отчет по ID."""
    return db.query(DailyReport).filter(DailyReport.id == report_id).first()

def get_reports(db: Session, skip: int = 0, limit: int = 100):
    """Получить список всех отчетов."""
    return db.query(DailyReport).offset(skip).limit(limit).all()

def  get_reports_by_developer(db: Session, developer_id: int):
    """Получить все отчеты конкретного разработчика."""
    return db.query(DailyReport).filter(DailyReport.developer_id == developer_id).all()

def create_report(db: Session, report: DailyReportCreate):
    """Создать новый отчет."""
    db_report = DailyReport(**report.model_dump() )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def update_report(db: Session, report_id: int, report: DailyReportUpdate):
    """Обновить отчет (обычно меняют только часы)."""
    db_report = get_report(db, report_id)
    if not db_report:
        return None
    for key, value in report.model_dump(exclude_unset=True).items():
        setattr(db_report, key, value)
    db.commit()
    db.refresh(db_report)
    return db_report

def delete_report(db: Session, report_id: int):
    """Удалить отчет."""
    db_report = get_report(db, report_id)
    if db_report:
        db.delete(db_report)
        db.commit()
    return db_report