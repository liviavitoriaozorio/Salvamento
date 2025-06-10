document.addEventListener("DOMContentLoaded", function() {
    
    const nome = localStorage.getItem("nomeJogador");
    console.log("Nome recuperado:", nome);
    const list = document.getElementById('playersList');

    // ~ CONEXÃO WEBSOCKET ~
    // ~ Cria conexão com o WebSocket ~
    const ws = new WebSocket("ws://127.0.0.1:1880/ws/sala"); 
    // ~ (IF) conectar com sucesso ~
    ws.onopen = () => {
        console.log("✅ WebSocket conectado!");
        const payload = { acao: "entrar", nome: nome };  
        console.log("Enviando dados:", payload);
        ws.send(JSON.stringify(payload));
    };
    // ~ (IF) erro ~
    ws.onerror = (error) => {
        console.error("❌ Erro no WebSocket:", error);
    };
    // ~ (IF) fechado ~
    ws.onclose = () => {
        console.warn("⚠️ WebSocket foi fechado.");
    };
    // ~ (IF) receber do servidor ~
    ws.onmessage = (event) => {
        console.log("📨 Mensagem recebida:", event.data);
        const data = JSON.parse(event.data);
        // ~ Atualiza a lista ~
        updatePlayerList(data.players);
        // ~ redireciona pro jogo ~
        if (data.sinal) {
            window.location.replace("../html/jogo.html");
        }
    };

    // ~ avisa o servidor que está saindo ~
    window.addEventListener("beforeunload", function() {
        console.log("Saindo da sala...");
        ws.send(JSON.stringify({ acao: "sair", nome: nome }));
    });
    // ~ atualiza a lista de jogadores ~
    function updatePlayerList(players) {
        list.innerHTML = "";
        players.forEach(player => {
            const li = document.createElement("li");
            li.innerText = player;
            list.appendChild(li);
        });
    }

});
