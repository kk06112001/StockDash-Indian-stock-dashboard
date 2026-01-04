from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base

class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    stock_symbol = Column(String, nullable=False)
    stock_name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
