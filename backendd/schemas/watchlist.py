from pydantic import BaseModel

class WatchlistCreate(BaseModel):
    stock_symbol: str
    stock_name: str

class WatchlistOut(BaseModel):
    id: int
    stock_symbol: str
    stock_name: str

    class Config:
        from_attributes = True
