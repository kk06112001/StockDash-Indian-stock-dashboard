function loginUser() {
    fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
    .then(r => r.json())
    .then(data => {
        if (!data.access_token) {
            alert("Login failed");
            return;
        }
        localStorage.setItem("token", data.access_token);
        window.location.href = "index.html";
    });
}

function signupUser() {
    fetch("http://127.0.0.1:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    }).then(() => {
        window.location.href = "login.html";
    });
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
