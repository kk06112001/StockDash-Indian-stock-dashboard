let stockChart = null;
let currentSymbol = null;
let currentPeriod = "1mo";
const stockCache={};
const API_BASE = "http://127.0.0.1:8000/api/stocks";
let searchTimeout = null;

function debounceSearch() {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        searchStock();
    }, 1500); // 1500ms delay
}

function showLoading() {
    document.getElementById("loadingOverlay")?.classList.remove("hidden");
}

function hideLoading() {
    document.getElementById("loadingOverlay")?.classList.add("hidden");
}

async function searchStock(period = currentPeriod, fromWatchlist = false) {
    const input = document.getElementById("searchInput");

    if (!fromWatchlist) {
        let symbol = input.value.trim().toUpperCase();

        if (!symbol) {
            alert("Enter a stock symbol (e.g. RELIANCE)");
            return;
        }

        if (!symbol.endsWith(".NS")) symbol += ".NS";
        currentSymbol = symbol;
    }

    currentPeriod = period;

    localStorage.setItem("lastStockSymbol", currentSymbol);
    localStorage.setItem("lastPeriod", currentPeriod);

    const cacheKey = `${currentSymbol}_${currentPeriod}`;

    if (stockCache[cacheKey]) {
        updateUI(
            stockCache[cacheKey].info,
            stockCache[cacheKey].history
        );
        updateActiveButton(currentPeriod);
        return;
    }

    showLoading();

    try {
        const infoRes = await fetch(`${API_BASE}/search?symbol=${currentSymbol}`);
        if (!infoRes.ok) throw new Error("Info fetch failed");
        const info = await infoRes.json();

        const historyRes = await fetch(
            `${API_BASE}/history?symbol=${currentSymbol}&period=${currentPeriod}`
        );
        if (!historyRes.ok) throw new Error("History fetch failed");
        const history = await historyRes.json();

        stockCache[cacheKey] = { info, history };

        updateUI(info, history);
        updateActiveButton(currentPeriod);
        saveSearchHistory(currentSymbol);
        


    } catch (err) {
        console.error(err);
        alert("Unable to fetch stock data");
    } finally {
        hideLoading();
    }
}


function changePeriod(period) {
    if (!currentSymbol) return;
    searchStock(period, true);
}

function updateActiveButton(period) {
    document.querySelectorAll(".time-filters button").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("onclick")?.includes(period)) {
            btn.classList.add("active");
        }
    });
}

function updateUI(info, history) {
    document.getElementById("companyName").innerText =
        `${info.name} (${info.symbol})`;

    document.getElementById("priceInfo").innerText =
        `₹ ${info.price} | Day High: ₹${info.day_high} | Day Low: ₹${info.day_low}`;

    renderChart(history);
    checkAlerts(info.price);
    loadAlerts();
    if (typeof updateWatchlistButton === "function") {
        updateWatchlistButton();
    }

    document.getElementById("alertsSection").hidden = false;
}


function renderChart(data) {
    if (!data || data.length === 0) {
        alert("No historical data available");
        return;
    }

    const ctx = document.getElementById("stockChart").getContext("2d");

    const stepMap = {
        "3mo": 2,
        "6mo": 4,
        "1y": 6,
        "3y": 12,
        "5y": 24,
        "10y": 48,
        "max": 60
    };
    const step = stepMap[currentPeriod] || 1;

    const filtered = data.filter((_, i) => i % step === 0);

    const labels = filtered.map(d => d.date);
    const prices = filtered.map(d => d.close);

    if (stockChart) stockChart.destroy();

    stockChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Closing Price (₹)",
                data: prices,
                borderColor: "#2ea043",
                backgroundColor: "rgba(46,160,67,0.12)",
                pointRadius: 0,
                borderWidth: 2,
                tension: 0,
                fill: true
            }]
        },
        options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    animation: {
        duration: 600,
        easing: "easeOutQuart"
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "#161b22",
            titleColor: "#e6edf3",
            bodyColor: "#e6edf3",
            borderColor: "#30363d",
            borderWidth: 1
        }
    },
    scales: {
        x: {
            ticks: { color: "#8b949e" },
            grid: { color: "rgba(255,255,255,0.04)" }
        },
        y: {
            ticks: {
                color: "#8b949e",
                callback: v => `₹${v}`
            },
            grid: { color: "rgba(255,255,255,0.04)" }
        }
    }
}

    });
}

document.addEventListener("DOMContentLoaded", () => {
    const savedSymbol = localStorage.getItem("lastStockSymbol");
    const savedPeriod = localStorage.getItem("lastPeriod") || "1mo";

    if (savedSymbol) {
        currentSymbol = savedSymbol;

        const input = document.getElementById("searchInput");
        
        if (input) input.value = savedSymbol.replace(".NS", "");

        searchStock(savedPeriod, true);
    }
});
const searchInput = document.getElementById("searchInput");
const searchHistoryBox = document.getElementById("searchHistory");

searchInput.addEventListener("focus", () => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");

    if (history.length === 0) return;

    searchHistoryBox.innerHTML = "";
    history.forEach(stock => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerText = stock;
        div.addEventListener("click", () => {
            searchInput.value = stock;
            searchStock();
            searchHistoryBox.classList.add("hidden");
        });
        searchHistoryBox.appendChild(div);
    });

    searchHistoryBox.classList.remove("hidden");
});

document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !searchHistoryBox.contains(e.target)) {
        searchHistoryBox.classList.add("hidden");
    }
});
