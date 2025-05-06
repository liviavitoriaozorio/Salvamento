document.addEventListener("DOMContentLoaded", function () {
    var botaoJogar = document.getElementById("jogarBnt");
    if (botaoJogar) {
        botaoJogar.addEventListener("click", function () {
            window.location.href = "html/login.html";
        });
    }
});

