import yfinance as yf


def get_stock_info(symbol: str):
    """
    Fetch current stock info
    """
    stock = yf.Ticker(symbol)

    info = stock.info

    return {
        "symbol": symbol,
        "name": info.get("shortName"),
        "price": info.get("currentPrice"),
        "day_high": info.get("dayHigh"),
        "day_low": info.get("dayLow"),
        "market_cap": info.get("marketCap"),
        "currency": info.get("currency"),
    }


def get_stock_history(symbol: str, period="1mo", interval="1d"):
    """
    Fetch historical price data
    """
    stock = yf.Ticker(symbol)
    hist = stock.history(period=period, interval=interval)

    history = []
    for index, row in hist.iterrows():
        history.append({
            "date": index.strftime("%Y-%m-%d"),
            "open": round(row["Open"], 2),
            "high": round(row["High"], 2),
            "low": round(row["Low"], 2),
            "close": round(row["Close"], 2),
        })

    return history
