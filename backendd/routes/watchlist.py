from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.watchlist import Watchlist
from app.schemas.watchlist import WatchlistCreate, WatchlistOut
from app.core.auth_dependency import get_current_user,get_db
from app.models.user import User

router = APIRouter(prefix="/api/watchlist", tags=["Watchlist"])


@router.post("/add", response_model=WatchlistOut)
def add_to_watchlist(
    data: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = Watchlist(
        stock_symbol=data.stock_symbol,
        stock_name=data.stock_name,
        user_id=current_user.id
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("", response_model=list[WatchlistOut])
def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id
    ).all()
@router.delete("/{stock_symbol}")
def remove_from_watchlist(
    stock_symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.stock_symbol == stock_symbol
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Stock not found")
    db.delete(item)
    db.commit()

    return {"message": "Removed from watchlist"}
