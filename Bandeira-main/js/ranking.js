const container = document.getElementById("ranking");
// Conecta ao WebSocket do Node-RED
const ws = new WebSocket("ws://127.0.0.1:1880/ws/ranking");

document.addEventListener("DOMContentLoaded", function () {
    // ~~ (IF) CONEXÃO ABERTA ~~
    ws.onopen = function () {
        // ~ envia uma mensagem para solicitar os dados ~
        ws.send("solicitar_dados_ranking");
    };

    // ~~ (IF) RECEBE DADOS ~~
    ws.onmessage = function (event) {
        // ~ variaveis ~
        const dados = event.data;
        const jogadores = dados.match(/\d+°\s+[^:]+:\s+-?\d+\s+pontos\s+em\s+\d+seg/g);
        const listaJogadores = jogadores.map(jogador => {
            const match = jogador.match(/(\d+)°\s+([^:]+):\s+(-?\d+)\s+pontos\s+em\s+(\d+)seg/);
            if (!match) return null;
            const [, pos, nome, pontos, tempo] = match;
            return { pos: Number(pos), nome, pontos: Number(pontos), tempo: Number(tempo) };
        }).filter(Boolean);

        // ~ constrói o podio e a lista ~
        const podioHTML = `
            <div class="podio">
                ${[2, 1, 3].map(pos => {
                    const jogador = listaJogadores.find(j => j.pos === pos);
                    const classes = ["segundo", "primeiro", "terceiro"];
                    return jogador
                        ? `<div class="coluna ${classes[[2, 1, 3].indexOf(pos)]}">
                            <div class="posicao">${pos}°</div>
                            <div class="nome">${jogador.nome}</div>
                        </div>` : '';
                }).join('')}
            </div>
        `;
        const listaHTML = listaJogadores.map(jogador => `
            <div class="linha-ranking">
                <div class="bolinha">${jogador.pos}</div>
                <div class="info-nome">${jogador.nome}</div>
                <div class="info">${jogador.pontos} pontos</div>
                <div class="info">${jogador.tempo}</div>
            </div>
        `).join('');
        container.innerHTML = podioHTML + listaHTML;


        // ~ se não tiver jogador ~
        if (!jogadores) {
            container.innerHTML = "<p>Nenhum dado encontrado.</p>";
            return;
        }
    };

    // ~~ (IF) DER ERRADO ~~
    ws.onerror = function (error) {
        container.innerHTML = "<p>Erro na conexão WebSocket.</p>";
        console.error("WebSocket error:", error);
    };
    ws.onclose = function () {
        console.warn("WebSocket desconectado.");
    };
});
