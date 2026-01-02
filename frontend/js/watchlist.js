let userWatchlist = []; 

async function loadWatchlist() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://127.0.0.1:8000/api/watchlist", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();
    userWatchlist = data.map(item => item.stock_symbol);

    const container = document.getElementById("watchlist");
    container.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "watch-item";
        div.innerHTML = `
            <span class="watch-stock" style="cursor:pointer;">
                ${item.stock_symbol}
            </span>
            <button onclick="removeFromWatchlist('${item.stock_symbol}')">✖</button>
        `;

        container.appendChild(div);

        // ---------------- CLICK WATCHLIST STOCK ----------------
        div.querySelector(".watch-stock").addEventListener("click", () => {
            currentSymbol = item.stock_symbol;

            // Update search input UI
            document.getElementById("searchInput").value =
                item.stock_symbol.replace(".NS", "");

            // Persist state
            localStorage.setItem("lastStockSymbol", currentSymbol);
            localStorage.setItem("lastPeriod", currentPeriod);

            // Load chart
            searchStock(currentPeriod);
        });
    });
    const emptyMsg = document.getElementById("noWatchlistMsg");
    if (emptyMsg) {
        emptyMsg.classList.toggle("hidden", userWatchlist.length > 0);
}


    updateWatchlistButton();
}

async function toggleWatchlist() {
    if (!currentSymbol) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    if (userWatchlist.includes(currentSymbol)) {
        // Remove
        await fetch(`http://127.0.0.1:8000/api/watchlist/${currentSymbol}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
    } else {
        // Add
        await fetch("http://127.0.0.1:8000/api/watchlist/add", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                stock_symbol: currentSymbol,
                stock_name: document.getElementById("companyName").innerText
            })
        });
    }

    loadWatchlist();
}

async function removeFromWatchlist(symbol) {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`http://127.0.0.1:8000/api/watchlist/${symbol}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    // If removed stock is currently open → clear state
    if (currentSymbol === symbol) {
        currentSymbol = null;
        localStorage.removeItem("lastStockSymbol");
    }

    loadWatchlist();
}

function updateWatchlistButton() {
    const btn = document.getElementById("addWatchlistBtn");
    if (!currentSymbol) return;

    btn.innerText = userWatchlist.includes(currentSymbol)
        ? "❌ Remove from Watchlist"
        : "❤️ Add to Watchlist";

    btn.hidden = false;
}
document.addEventListener("DOMContentLoaded", () => {
    loadWatchlist();     
});