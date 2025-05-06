  // Função para buscar os dados do servidor
  async function fetchRankingData() {
    try {
      const response = await fetch('http://127.0.0.1:1880/retornadados');
      if (response.ok) {
        const data = await response.json();
        displayRanking(data);
      } else {
        console.error('Erro ao buscar dados:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

  // Função para exibir os dados na página
  function displayRanking(data) {
    const rankingList = document.querySelector('.ranking-list');
    rankingList.innerHTML = ''; // Limpa a lista existente

    data.forEach((item, index) => {
      const rankingItem = document.createElement('div');
      rankingItem.classList.add('ranking-item');

      rankingItem.innerHTML = `
        <div class="circle">${index + 1}</div>
        <span><b>${item.nome}</b></span>
        <span><b>${item.pontos} acertos</b></span>
        <span>${item.erros} erros</span>
        <span>${item.tempo} Seg</span>
      `;

      rankingList.appendChild(rankingItem);
    });
  }


fetchRankingData ();