// ~~ VARIAVEL ~~
// ~ variavel som ~
let somAcerto = new Audio('../som/acerto.mp3');
let somErro = new Audio('../som/erro.mp3');
// ~ variavel api bandeiras ~
let pais;
let bandeira;
let pais_br;
// ~ variavel time / pontuação / nome ~
var nome = localStorage.getItem("nomeJogador");
let timerElemento = document.getElementById("timer");
let tempoRestante = 90; 
let tempoDecorrido = 0; 
let pontuacao = 0;
let intervaloTimer;
// ~ variavel html ~
let img = document.getElementsByClassName('bandeira');
let frm = document.querySelector('.resposta'); 
let pontuacaoElemento = document.getElementById('pontuacao');
let nome_pais = document.getElementById('nome_pais'); 
let botao = document.querySelector('.bnt'); 
// ~ varievel rodadas ~
let rodadaAtual = 0;
// ~ variavel modal ~
const btnFechar = document.querySelector('.bnnt');
const modal = document.getElementById('modal');
const cancelar = document.getElementById('cancelar');
const confirmar = document.getElementById('confirmar');


// ~~ TIMER ~~ 
document.addEventListener("DOMContentLoaded", () => {
    iniciarTimer();
});
function iniciarTimer() {
    intervaloTimer = setInterval(() => {
        tempoRestante--; 
        tempoDecorrido++;
        timerElemento.innerText = `Timer: ${tempoRestante}s`;

        if (tempoRestante <= 0) {
            pararTimer();
            if (nome) {
                enviarDadosParaServidor(nome, pontuacao, tempoDecorrido);
            }
            window.location.href = "ranking.html"; 
        }
    }, 1000);
}
function pararTimer() {
    clearInterval(intervaloTimer);
}


// ~~ API ~~ 
fetch('https://restcountries.com/v2/all?fields=name,flags,translations')
    .then(response => response.json())
    .then(data => {
        api = data;
        sortPais(); 
    });
function sortPais() {    
    // ~ sorteia o pais ~
    const paisAleatorio = api[Math.floor(Math.random() * api.length)];

    // ~ pega as informações e salva em variaveis ~
    pais = paisAleatorio.name;
    bandeira = paisAleatorio.flags.png;
    pais_br = paisAleatorio.translations.pt;

    // ~ mostra no html ~ 
    img[0].src = bandeira;
    nome_pais.innerText = pais_br;
}


// ~~~ FORM ~~
botao.addEventListener("click", () => {
    let resposta_pais = frm.value.trim();
    const etapas = document.querySelectorAll(".etapa");

    // ~ rodadas p/ continuar ~
    if (rodadaAtual < 10) {
        // ~ analisar respostas ~
        if (resposta_pais.toLowerCase() === pais_br.toLowerCase()) {
            pontuacao += 10;
            etapas[rodadaAtual].classList.add("acertou");
            somAcerto.play();
        } else {
            pontuacao -= 10;
            etapas[rodadaAtual].classList.add("errou");
            somErro.play();
        }

        // ~ atualizar html ~
        pontuacaoElemento.innerText = `Pontos: ${pontuacao}`;
        frm.value = "";
        rodadaAtual++;

        // ~ novo pais ~
        sortPais();
    }
    // ~ finalizar as rodadas ~
    else {
        pararTimer(); 
        if (nome) {
            enviarDadosParaServidor(nome, pontuacao, tempoDecorrido);
        }
        window.location.href = "ranking.html";
    }
});


// ~~ SERVIDOR  ~~
function enviarDadosParaServidor(nome, pontos, tempo) {
    const url = `http://127.0.0.1:1880/recebedados?jogador=${encodeURIComponent(nome)}&pontos=${pontos}&tempo=${tempo}`;
    fetch(url)
        .then(response => {
            //~ verificação ~
            if (response.ok) {
                console.log("Dados enviados com sucesso!");
            } else {
                console.error("Erro ao enviar dados para o servidor.");
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
        });
}


// ~~ ENVIAR COM "Enter" ~~
frm.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        botao.click(); 
    }
});


// ~~ MODAL ~~
btnFechar.addEventListener('click', () => {
    modal.style.display = 'flex';
});
cancelar.addEventListener('click', () => {
    modal.style.display = 'none';
});
confirmar.addEventListener('click', () => {
    window.location.href = '../index.html'; 
});
