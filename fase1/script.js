let exercicioAtual = 1;
let pontuacao = 0;
let totalExercicios = 10;

const somAcerto = new Audio("assets/acerto.mp3");
const somErro = new Audio("assets/erro.mp3");

// Inicia direto no primeiro exercício
window.onload = () => {
  carregarExercicio(exercicioAtual);
};

// Função converterParaExtenso corrigida
function converterParaExtenso(n) {
  const unidades = ["ZERO","UM","DOIS","TRÊS","QUATRO","CINCO","SEIS","SETE","OITO","NOVE"];
  const dezenas = ["","DEZ","VINTE","TRINTA","QUARENTA","CINQUENTA","SESSENTA","SETENTA","OITENTA","NOVENTA"];
  const especiais = {
    11:"ONZE",12:"DOZE",13:"TREZE",14:"QUATORZE",15:"QUINZE",
    16:"DEZESSEIS",17:"DEZESSETE",18:"DEZOITO",19:"DEZENOVE"
  };
  const centenas = ["","CENTO","DUZENTOS","TREZENTOS","QUATROCENTOS","QUINHENTOS","SEISCENTOS","SETECENTOS","OITOCENTOS","NOVECENTOS"];

  n = parseInt(n);
  if (n === 0) return "ZERO";
  if (n < 10) return unidades[n];
  if (n > 10 && n < 20) return especiais[n];

  let c = Math.floor(n/100);
  let d = Math.floor((n%100)/10);
  let u = n%10;

  let partes = [];

  if (c > 0) {
    if (c === 1 && d === 0 && u === 0) {
      partes.push("CEM");
    } else {
      partes.push(centenas[c]);
    }
  }

  if (d > 0) {
    if (d === 1 && u > 0) {
      partes.push(especiais[d*10+u]);
      u = 0;
    } else {
      partes.push(dezenas[d]);
    }
  }

  if (u > 0) {
    partes.push(unidades[u]);
  }

  return partes.filter(p => p !== "").join(" E ");
}

// Gera opções aleatórias com embaralhamento Fisher-Yates
function gerarOpcoes(numeroCorreto) {
  const corretaExtenso = converterParaExtenso(numeroCorreto);
  const opcoes = [corretaExtenso];

  while (opcoes.length < 3) {
    const aleatorio = Math.floor(Math.random() * 900) + 1;
    const extenso = converterParaExtenso(aleatorio);
    if (extenso !== corretaExtenso && !opcoes.includes(extenso)) {
      opcoes.push(extenso);
    }
  }

  for (let i = opcoes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opcoes[i], opcoes[j]] = [opcoes[j], opcoes[i]];
  }

  return opcoes;
}

async function carregarExercicio(numero) {
  try {
    const response = await fetch(`data/exercicio${numero}.json`);
    if (!response.ok) throw new Error("Arquivo não encontrado");
    const dados = await response.json();
    const container = document.getElementById("exercicio-container");

    const opcoesAleatorias = gerarOpcoes(dados.numero);

    container.innerHTML = `
      <p><strong>Monte o número:</strong></p>
      <div class="grafico">
        ${dados.blocos.centena > 0 ? `
          <div class="linha-barra">
            <div class="label">Centenas</div>
            <div class="bar">
              ${Array.from({ length: dados.blocos.centena }, () => `<div class="divisao"></div>`).join("")}
            </div>
            <span class="quantidade">${dados.blocos.centena}</span>
          </div>` : ""}
        ${dados.blocos.dezena > 0 ? `
          <div class="linha-barra">
            <div class="label">Dezenas</div>
            <div class="bar">
              ${Array.from({ length: dados.blocos.dezena }, () => `<div class="divisao"></div>`).join("")}
            </div>
            <span class="quantidade">${dados.blocos.dezena}</span>
          </div>` : ""}
        ${dados.blocos.unidade > 0 ? `
          <div class="linha-barra">
            <div class="label">Unidades</div>
            <div class="bar">
              ${Array.from({ length: dados.blocos.unidade }, () => `<div class="divisao"></div>`).join("")}
            </div>
            <span class="quantidade">${dados.blocos.unidade}</span>
          </div>` : ""}
      </div>

      <p><strong>Digite o número:</strong></p>
      <input type="text" id="entradaNumero" maxlength="3">

      <p><strong>Escolha por extenso:</strong></p>
      <div class="opcoes">
        ${opcoesAleatorias.map(opcao => `
          <button class="opcao" onclick="verificarResposta('${dados.numero}', '${opcao}', '${converterParaExtenso(dados.numero)}')">
            ${opcao}
          </button>
        `).join("")}
      </div>
      <p id="resultado"></p>
      <p id="pontuacao">Pontuação: ${pontuacao} / ${totalExercicios}</p>
    `;
  } catch (error) {
    console.error("Erro ao carregar exercício:", error);
    document.getElementById("exercicio-container").innerHTML = `<p>Erro ao carregar exercício ${numero}. Verifique se o arquivo existe.</p>`;
  }
}

function verificarResposta(numeroDigitado, escolhaExtenso, corretaExtenso) {
  const entrada = document.getElementById("entradaNumero").value;
  const resultado = document.getElementById("resultado");

  if (entrada === numeroDigitado && escolhaExtenso === corretaExtenso) {
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
  exercicioAtual = exercicioAtual < totalExercicios ? exercicioAtual + 1 : 1;
  carregarExercicio(exercicioAtual);
});
