from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    stock_symbol = Column(String, index=True)
    target_price = Column(Float)
    above = Column(Boolean)  
    active = Column(Boolean, default=True)

    user = relationship("User", backref="alerts")
