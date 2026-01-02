const SYMBOLS = [
    { symbol: "RELIANCE.NS", name: "Reliance Industries" },
    { symbol: "TCS.NS", name: "Tata Consultancy Services" },
    { symbol: "INFY.NS", name: "Infosys" },
    { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
    { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
    { symbol: "WIPRO.NS", name: "Wipro" },
    { symbol: "LT.NS", name: "Larsen & Toubro" },
    { symbol: "SBIN.NS", name: "State Bank of India" }
];

/* ================= AUTOCOMPLETE ================= */
const input = document.getElementById("searchInput");
const suggestionBox = document.getElementById("suggestions");

input.addEventListener("input", () => {
    const query = input.value.trim().toUpperCase();

    if (query.length < 2) {
        suggestionBox.classList.add("hidden");
        return;
    }

    const matches = SYMBOLS.filter(s =>
        s.symbol.includes(query) || s.name.toUpperCase().includes(query)
    ).slice(0, 6);

    if (matches.length === 0) {
        suggestionBox.classList.add("hidden");
        return;
    }

    suggestionBox.innerHTML = "";
    matches.forEach(stock => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.innerText = `${stock.name} (${stock.symbol})`;

        div.onclick = () => {
            input.value = stock.symbol.replace(".NS", "");
            suggestionBox.classList.add("hidden");

            currentSymbol = stock.symbol;
            searchStock(currentPeriod, true);
            saveSearchHistory(stock.symbol);
        };

        suggestionBox.appendChild(div);
    });

    suggestionBox.classList.remove("hidden");
});

function saveSearchHistory(symbol) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    history = history.filter(s => s !== symbol);
    history.unshift(symbol);
    history = history.slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    renderSearchHistory();
}

function renderSearchHistory() {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const container = document.getElementById("searchHistory");

    if (history.length === 0) {
        container.classList.add("hidden");
        return;
    }

    container.innerHTML = "<h4>Recent</h4>";

    history.forEach(symbol => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerText = symbol.replace(".NS", "");
        div.onclick = () => {
            input.value = symbol.replace(".NS", "");
            currentSymbol = symbol;
            searchStock(currentPeriod, true);
        };
        container.appendChild(div);
    });

    container.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", renderSearchHistory);
