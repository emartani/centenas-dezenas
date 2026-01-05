let exercicioAtual = 1;
let pontuacao = 0;
let totalExercicios = 10;

const somAcerto = new Audio("../assets/acerto.mp3");
const somErro = new Audio("../assets/erro.mp3");

window.onload = () => {
  carregarExercicio(exercicioAtual);
};

// Função para embaralhar array (Fisher-Yates)
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function carregarExercicio(numero) {
  try {
    const response = await fetch(`data/exercicio${numero}.json`);
    if (!response.ok) throw new Error("Arquivo não encontrado");
    const dados = await response.json();
    const container = document.getElementById("exercicio-container");

    // embaralha as opções antes de mostrar
    const opcoesAleatorias = embaralhar([...dados.opcoes]);

    container.innerHTML = `
      <p><strong>Qual a decomposição do número ${dados.numero}?</strong></p>
      <div class="opcoes">
        ${opcoesAleatorias.map(opcao => `
          <button class="opcao" onclick="verificarResposta('${opcao}', '${dados.correta}')">
            ${opcao}
          </button>
        `).join("")}
      </div>
      <p id="resultado"></p>
      <p id="pontuacao">Pontuação: ${pontuacao} / ${totalExercicios}</p>
    `;
  } catch (error) {
    console.error("Erro ao carregar exercício:", error);
    document.getElementById("exercicio-container").innerHTML = `<p>Erro ao carregar exercício ${numero}.</p>`;
  }
}

function verificarResposta(escolha, correta) {
  const resultado = document.getElementById("resultado");

  if (escolha === correta) {
    resultado.textContent = "🎉 Muito bem! Você acertou!";
    resultado.style.color = "green";
    pontuacao++;
    somAcerto.play();
  } else {
    resultado.textContent = "❌ Ops, tente novamente!";
    resultado.style.color = "red";
    somErro.play();
  }

  document.getElementById("pontuacao").textContent = `Pontuação: ${pontuacao} / ${totalExercicios}`;
}

document.getElementById("proximo").addEventListener("click", () => {
  if (exercicioAtual < totalExercicios) {
    exercicioAtual++;
    carregarExercicio(exercicioAtual);
  } else {
    // Mostra mensagem de fim de fase
    document.getElementById("exercicio-container").innerHTML = `
      <h2>🎉 Parabéns, você concluiu a Fase 2!</h2>
      <p>Sua pontuação final foi: ${pontuacao} / ${totalExercicios}</p>
      <a href="../index.html" class="botao-fase">⬅️ Voltar ao Menu</a>
    `;
    document.getElementById("proximo").style.display = "none"; // esconde botão
  }
});

