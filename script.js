let clientes = [];

function addCliente() {
  const nome = nomeInput.value;
  const itens = parseInt(itensInput.value);

  if (!nome || !itens) return alert("Preencha corretamente!");

  if (itens <= 0) return alert("Digite um número de itens válido!");

  if (clientes.length >= 5) return alert("Máx. 5 clientes!");

  clientes.push({ nome, itens });
  renderLista();

  nomeInput.value = "";
  itensInput.value = "";
}

const nomeInput = document.getElementById("nome");
const itensInput = document.getElementById("itens");

function renderLista() {
  lista.innerHTML = clientes.map(c =>
    `<span class="tag">${c.nome} (${c.itens})</span>`
  ).join("");
}

const lista = document.getElementById("lista");

async function simular() {

  if (clientes.length === 0) {
    return alert("Adicione pelo menos 1 cliente!");
  }

  document.getElementById("tempoFifo").innerText = "";
  document.getElementById("tempoSjf").innerText = "";
  resultado.innerHTML = "";

  document.getElementById("filaFifo").classList.remove("highlight");
  document.getElementById("filaSjf").classList.remove("highlight");

  document.querySelector("#filaFifo h3").innerText = "Ordem de Chegada";
  document.querySelector("#filaSjf h3").innerText = "Menor Número de Itens";

  const fifo = [...clientes];
  const sjf = [...clientes].sort((a,b)=>a.itens-b.itens);

  renderFila("fifo", fifo);
  renderFila("sjf", sjf);

  await Promise.all([
    animarFila("fifo", fifo),
    animarFila("sjf", sjf)
  ]);

  mostrarResultado(fifo, sjf);
}

function renderFila(id, fila) {
  document.getElementById(id).innerHTML = fila.map(c =>
    `<div class="card">${c.nome}<br>${c.itens} itens</div>`
  ).join("");
}

async function animarFila(id, fila) {
  const container = document.getElementById(id);

  const filaAnimacao = [...fila];

  let tempoTotal = 0;
  let tempoAcumulado = 0;

  while (container.children.length > 0) {

    const primeiro = container.children[0];

    primeiro.classList.add("running");

    const itens = filaAnimacao[0].itens;

    await sleep(itens * 1000);

    primeiro.remove();

    tempoAcumulado += itens;
    tempoTotal += tempoAcumulado;

    filaAnimacao.shift();
  }

  const tempoMedio = (tempoTotal / clientes.length).toFixed(1);

  document.getElementById(
    id === "fifo" ? "tempoFifo" : "tempoSjf"
  ).innerText = `Tempo total de espera: ${tempoTotal}s | Tempo médio de espera: ${tempoMedio}s`;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function calcularTempoTotal(fila) {
  let total = 0, acc = 0;
  fila.forEach(c => {
    acc += c.itens;
    total += acc;
  });
  return total;
}

function mostrarResultado(fifo, sjf) {
  const t1 = calcularTempoTotal(fifo);
  const t2 = calcularTempoTotal(sjf);

  const mediaFifo = t1 / fifo.length;
  const mediaSjf = t2 / sjf.length;

  const diferenca = Math.abs(mediaFifo - mediaSjf).toFixed(1);

  const filaFifo = document.getElementById("filaFifo");
  const filaSjf = document.getElementById("filaSjf");

  filaFifo.classList.remove("highlight");
  filaSjf.classList.remove("highlight");

  document.querySelector("#filaFifo h3").innerText = "Ordem de Chegada";
  document.querySelector("#filaSjf h3").innerText = "Menor Número de Itens";

  if (t2 < t1) {

    filaSjf.classList.add("highlight");

    document.querySelector("#filaSjf h3").innerText =
      "Menor Número de Itens 🏆";

    resultado.innerHTML = `
      <div class="winner">
        Fila mais rápida: Menor Número de Itens com ${diferenca}s a menos de tempo médio de espera
      </div>
    `;
  } else if (t1 < t2) {

    filaFifo.classList.add("highlight");

    document.querySelector("#filaFifo h3").innerText =
      "Ordem de Chegada 🏆";

    resultado.innerHTML = `
      <div class="winner">
        Fila mais rápida: Ordem de Chegada com ${diferenca}s a menos de tempo médio de espera
      </div>
    `;
  } else {

    resultado.innerHTML = `
      <div class="winner">
        Empate! As duas filas têm o mesmo desempenho
      </div>
    `;
  }
}
const resultado = document.getElementById("resultado");

function limpar() {
  clientes = [];
  lista.innerHTML = "";
  document.getElementById("fifo").innerHTML = "";
  document.getElementById("sjf").innerHTML = "";
  document.getElementById("tempoFifo").innerText = "";
  document.getElementById("tempoSjf").innerText = "";
  document.getElementById("filaFifo").classList.remove("highlight");
  document.getElementById("filaSjf").classList.remove("highlight");
  document.querySelector("#filaFifo h3").innerText = "Ordem de Chegada";
  document.querySelector("#filaSjf h3").innerText = "Menor Número de Itens";
  resultado.innerHTML = "";
}
