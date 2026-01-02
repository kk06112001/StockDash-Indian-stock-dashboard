const ALERT_API = "http://127.0.0.1:8000/api/alerts";
let activeAlerts = [];

async function loadAlerts() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(ALERT_API, {
        headers: { "Authorization": "Bearer " + token }
    });

    activeAlerts = await res.json();

    const container = document.getElementById("alertsList");
    if (!container) return;

    container.innerHTML = "";

    activeAlerts.forEach(alert => {
        const div = document.createElement("div");
        div.className = "alert-item";
        div.innerHTML = `
            <span>${alert.stock_symbol} ${alert.above ? "↑" : "↓"} ₹${alert.target_price}</span>
            <button onclick="deleteAlert(${alert.id})">✖</button>
        `;
        container.appendChild(div);
    });
    const noMsg = document.getElementById("noAlertsMsg");
    if (noMsg) {
        noMsg.classList.toggle("hidden", activeAlerts.length > 0);
}

}

/* ================= CHECK ALERTS ================= */
function checkAlerts(currentPrice) {
    if (!currentSymbol || activeAlerts.length === 0) return;

    activeAlerts.forEach(alert => {
        if (alert.stock_symbol !== currentSymbol) return;

        if (alert.above && currentPrice >= alert.target_price) {
            triggerAlert(alert);
        }

        if (!alert.above && currentPrice <= alert.target_price) {
            triggerAlert(alert);
        }
    });
}

async function triggerAlert(alert) {
    alert(
        `${alert.above ? "🚀" : "⚠️"} ${alert.stock_symbol} reached ₹${alert.target_price}`
    );

    // Remove alert after trigger
    const token = localStorage.getItem("token");
    await fetch(`${ALERT_API}/${alert.id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    loadAlerts();
}
async function addPriceAlert() {
    if (!currentSymbol) {
        alert("Search a stock first");
        return;
    }

    const price = document.getElementById("alertPrice").value;
    const type = document.getElementById("alertType").value;
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Login required");
        return;
    }

    if (!price || price <= 0) {
        alert("Enter a valid price");
        return;
    }

    await fetch("http://127.0.0.1:8000/api/alerts/add", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            stock_symbol: currentSymbol,
            target_price: parseFloat(price),
            above: type === "above"
        })
    });

    document.getElementById("alertPrice").value = "";
    loadAlerts();
}
async function deleteAlert(alertId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Login required");
        return;
    }

    await fetch(`http://127.0.0.1:8000/api/alerts/${alertId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadAlerts();
}

document.addEventListener("DOMContentLoaded", loadAlerts);
