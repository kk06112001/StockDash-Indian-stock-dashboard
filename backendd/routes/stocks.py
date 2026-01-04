from fastapi import APIRouter, Query
from app.services.stock_service import get_stock_info, get_stock_history

router = APIRouter()

# --- Top Indian stocks (still static list) ---
@router.get("/top")
def get_top_indian_stocks():
    return [
        {"symbol": "RELIANCE.NS", "name": "Reliance Industries"},
        {"symbol": "TCS.NS", "name": "Tata Consultancy Services"},
        {"symbol": "HDFCBANK.NS", "name": "HDFC Bank"},
        {"symbol": "INFY.NS", "name": "Infosys"},
        {"symbol": "ICICIBANK.NS", "name": "ICICI Bank"},
        {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever"},
    ]


@router.get("/search")
def search_stock(symbol: str = Query(..., examples="RELIANCE.NS")):
    return get_stock_info(symbol)


@router.get("/history")
def stock_history(
    symbol: str = Query(..., examples="RELIANCE.NS"),
    period: str = "1mo",
):
    return get_stock_history(symbol, period=period)
