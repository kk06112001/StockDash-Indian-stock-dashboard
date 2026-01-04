import requests
from app.core.config import NEWS_API_KEY

NEWS_URL = "https://newsapi.org/v2/everything"

def fetch_stock_news(query: str):
    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 5,
        "apiKey": NEWS_API_KEY
    }

    res = requests.get(NEWS_URL, params=params, timeout=10)

    if res.status_code != 200:
        return []

    data = res.json()
    articles = data.get("articles", [])

    return [
        {
            "title": a["title"],
            "url": a["url"],
            "source": a["source"]["name"],
            "published_at": a["publishedAt"]
        }
        for a in articles
    ]
