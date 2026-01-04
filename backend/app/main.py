from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import stocks,auth, watchlist,alerts
from app.db.database import Base, engine
app = FastAPI(title="Indian Stocks Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)
@app.get("/")
def health_check():
    return {"status": "API is running"}

app.include_router(stocks.router, prefix="/api/stocks", tags=["Stocks"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(watchlist.router)
app.include_router(alerts.router)
