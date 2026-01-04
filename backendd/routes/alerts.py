from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.auth_dependency import get_current_user
from app.models.alert import Alert
from app.schemas.alert import AlertCreate, AlertOut
from app.models.user import User
router=APIRouter(prefix="/api/alerts",tags=["Alerts"])



# ---------------- ADD ALERT ----------------
@router.post("/add", response_model=AlertOut)
def add_alert(
    data: AlertCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = Alert(
        user_id=current_user.id,
        stock_symbol=data.stock_symbol,
        target_price=data.target_price,
        above=data.above,
        active=True
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


# ---------------- GET USER ALERTS ----------------
@router.get("", response_model=list[AlertOut])
def get_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Alert).filter(
        Alert.user_id == current_user.id,
        Alert.active == True
    ).all()


# ---------------- DELETE ALERT ----------------
@router.delete("/{alert_id}")
def delete_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == current_user.id
    ).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    db.delete(alert)
    db.commit()

    return {"message": "Alert deleted"}