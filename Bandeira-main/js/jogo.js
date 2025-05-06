// Supondo que o seu código já tenha as variáveis que você mostrou
let pais;
let bandeira;
let pais_br;

let timerElemento = document.getElementById("timer");
let tempo = 0;
let intervaloTimer;

let img = document.getElementsByClassName('bandeira');
let frm = document.querySelector('.resposta'); 
let pontuacaoElemento = document.getElementById('pontuacao');
let nome_pais = document.getElementById('nome_pais'); 
let botao = document.querySelector('.bnt'); 

let pontuacao = 0;

document.addEventListener("DOMContentLoaded", () => {
    iniciarTimer();
});

function iniciarTimer() {
    intervaloTimer = setInterval(() => {
        tempo++;
        timerElemento.innerText = `Timer: ${tempo}`;
    }, 1000); // Atualiza a cada 1 segundo
}

function pararTimer() {
    clearInterval(intervaloTimer);
}

fetch('https://restcountries.com/v2/all')
    .then(response => response.json())
    .then(data => {
    api = data;
    sortPais(); 
});

function sortPais() {    
    const paisAleatorio = api[Math.floor(Math.random() * api.length)];

    pais = paisAleatorio.name;
    bandeira = paisAleatorio.flags.png;
    pais_br = paisAleatorio.translations.pt;

    img[0].src = bandeira;
    nome_pais.innerText = pais_br;
}

botao.addEventListener("click", () => {
    let resposta_pais = frm.value.trim();
    const etapas = document.querySelectorAll(".etapa");

    if (rodadaAtual < 10) {
        if (resposta_pais.toLowerCase() === pais_br.toLowerCase()) {
            pontuacao += 10;
            etapas[rodadaAtual].classList.add("acertou");
        } else {
            pontuacao -= 5;
            etapas[rodadaAtual].classList.add("errou");
        }

        pontuacaoElemento.innerText = `Pontos: ${pontuacao}`;
        frm.value = "";
        rodadaAtual++;

        if (rodadaAtual < 10) {
            sortPais();
        } else {
            pararTimer(); 
            alert(`Fim de jogo! Seu tempo foi de ${tempo} segundos e sua pontuação foi ${pontuacao}`);
            window.location.href = "ranking.html";
        }
    }
});

let rodadaAtual = 0;

function atualizarBarraProgresso() {
    const etapas = document.querySelectorAll(".etapa");

    etapas.forEach((etapa, index) => {
        if (index < rodadaAtual) {
            etapa.classList.add("ativa");
        } else {
            etapa.classList.remove("ativa");
        }
    });
}

// Captura o evento de pressionar tecla (para enviar a resposta com "Enter")
frm.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        botao.click(); 
    }
});

const btnFechar = document.querySelector('.bnnt');
const modal = document.getElementById('modal');
const cancelar = document.getElementById('cancelar');
const confirmar = document.getElementById('confirmar');
btnFechar.addEventListener('click', () => {
    modal.style.display = 'flex';
});
cancelar.addEventListener('click', () => {
    modal.style.display = 'none';
});
confirmar.addEventListener('click', () => {
    window.location.href = '../index.html'; 
});
