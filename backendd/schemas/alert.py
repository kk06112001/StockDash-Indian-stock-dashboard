from pydantic import BaseModel
class AlertCreate(BaseModel):
    stock_symbol: str
    target_price: float
    above: bool
class AlertOut(BaseModel):
    id: int
    stock_symbol: str
    target_price: float
    above: bool
    active: bool

    class Config:
        from_attribute=True