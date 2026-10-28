/**
 * ItaquiNav — Controle de Fila e Status de Navios (Porto do Itaqui)
 * Disciplina: Desenvolvimento de Sistemas Web (EECP0036) - UFMA
 * Trilha C: Lógica em Vanilla JS, persistência em localStorage e renderização segura com textContent.
 */

// ============================================================================
// 1. MÓDULO DE ESTADO E PERSISTÊNCIA (Camada de Dados / localStorage)
// ============================================================================

const CHAVE_STORAGE = "itaquinav_embarcacoes_v1";

// Dados reais extraídos das tabelas do artigo sobre o Porto do Itaqui (EMAP, 2023)
const NAVIOS_INICIAIS_EMAP = [
  {
    id: "emap-1",
    nome: "VITA UNITY",
    imo: "9901275",
    carga: "Soja (Exportação) - 65.000t",
    calado: 7.5,
    agencia: "FERTIMPORT",
    status: "atracado"
  },
  {
    id: "emap-2",
    nome: "BRASSIANA",
    imo: "9853190",
    carga: "Celulose (Exportação) - 54.500t",
    calado: 5.1,
    agencia: "WILHELMSEN PORT SERVICES",
    status: "atracado"
  },
  {
    id: "emap-3",
    nome: "HORIZON APHRODITE",
    imo: "9407368",
    carga: "Diesel (Importação) - 32.100t",
    calado: 12.0,
    agencia: "LACHMANN",
    status: "atracado"
  },
  {
    id: "emap-4",
    nome: "OCEAN VENUS",
    imo: "9696961",
    carga: "MOP / Fertilizantes - 41.849t",
    calado: 10.9,
    agencia: "ORION RODOS",
    status: "fundeado"
  },
  {
    id: "emap-5",
    nome: "ULTRA VISION",
    imo: "9888924",
    carga: "Fertilizantes - 44.000t",
    calado: 12.15,
    agencia: "CARGONAVE",
    status: "fundeado"
  },
  {
    id: "emap-6",
    nome: "GENTLEMAN TRADER",
    imo: "9834576",
    carga: "Soja (Exportação) - 39.300t",
    calado: 14.0,
    agencia: "L.B.H. BRASIL",
    status: "fundeado"
  },
  {
    id: "emap-7",
    nome: "VAN LEOPARD",
    imo: "9592678",
    carga: "Clínquer (Importação) - 47.300t",
    calado: 12.5,
    agencia: "LBH BRASIL",
    status: "esperado"
  },
  {
    id: "emap-8",
    nome: "TOMINI LEVANT",
    imo: "9714783",
    carga: "Fertilizantes - 27.399t",
    calado: 11.0,
    agencia: "WORLD SHIPPING",
    status: "esperado"
  }
];

let listaNavios = [];

function carregarNaviosDoStorage() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);
    if (!dadosSalvos) {
      listaNavios = [...NAVIOS_INICIAIS_EMAP];
      salvarNaviosNoStorage();
      return;
    }
    const convertidos = JSON.parse(dadosSalvos);
    if (Array.isArray(convertidos)) {
      listaNavios = convertidos;
    } else {
      listaNavios = [...NAVIOS_INICIAIS_EMAP];
    }
  } catch (erro) {
    // Caso o localStorage esteja bloqueado ou corrompido, usa a lista em memória sem quebrar o app
    listaNavios = [...NAVIOS_INICIAIS_EMAP];
  }
}

function salvarNaviosNoStorage() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(listaNavios));
  } catch (erro) {
    // Falha silenciosa caso o navegador restrinja escrita em modo privado
  }
}

// ============================================================================
// 2. MÓDULO DE VALIDAÇÃO E REGRAS DE NEGÓCIO (Camada de Controle)
// ============================================================================

function validarEntradaNavio(nome, carga, caladoTexto) {
  if (!nome || nome.length < 2) {
    return { valido: false, erro: "Por favor, informe o nome do navio (mínimo de 2 caracteres)." };
  }
  if (!carga || carga.length < 2) {
    return { valido: false, erro: "Por favor, informe o tipo de carga e a tonelagem prevista." };
  }
  const caladoNumero = parseFloat(caladoTexto);
  if (isNaN(caladoNumero) || caladoNumero <= 0 || caladoNumero > 25) {
    return { valido: false, erro: "Informe um calado válido entre 0,5 m e 25,0 m." };
  }
  return { valido: true, caladoNumero: caladoNumero };
}

function obterProximoStatus(statusAtual) {
  if (statusAtual === "esperado") return "fundeado";
  if (statusAtual === "fundeado") return "atracado";
  return null;
}

function obterRotuloBotaoAvancar(statusAtual) {
  if (statusAtual === "esperado") return "Mover para Fundeado (Fila)";
  if (statusAtual === "fundeado") return "Atracar no Berço";
  return "";
}

// ============================================================================
// 3. MÓDULO DE RENDERIZAÇÃO SEGURA (Camada de Visão / DOM via textContent)
// ============================================================================

function exibirMensagemFeedback(texto, tipo) {
  const elementoMensagem = document.getElementById("mensagem-feedback");
  elementoMensagem.textContent = texto;
  elementoMensagem.className = "mensagem-alerta";
  if (tipo === "erro") {
    elementoMensagem.classList.add("mensagem-erro");
  } else {
    elementoMensagem.classList.add("mensagem-sucesso");
  }
}

function ocultarMensagemFeedback() {
  const elementoMensagem = document.getElementById("mensagem-feedback");
  elementoMensagem.textContent = "";
  elementoMensagem.className = "mensagem-alerta oculto";
}

function criarElementoCartaoNavio(navio) {
  const itemLista = document.createElement("li");
  itemLista.className = "cartao-navio";

  // Topo do cartão: Nome + Código IMO
  const topoCartao = document.createElement("div");
  topoCartao.className = "topo-cartao";

  const tituloNome = document.createElement("strong");
  tituloNome.className = "nome-navio";
  tituloNome.textContent = navio.nome;

  const seloImo = document.createElement("span");
  seloImo.className = "imo-navio";
  seloImo.textContent = navio.imo ? "IMO: " + navio.imo : "IMO: N/D";

  topoCartao.appendChild(tituloNome);
  topoCartao.appendChild(seloImo);

  // Linha de Carga
  const linhaCarga = document.createElement("p");
  linhaCarga.className = "detalhe-item";
  linhaCarga.textContent = "Carga: " + navio.carga;

  // Linha de Calado e Agência
  const linhaCalado = document.createElement("p");
  linhaCalado.className = "detalhe-item";
  const agenciaTexto = navio.agencia ? " · Agência: " + navio.agencia : "";
  linhaCalado.textContent = "Calado: " + Number(navio.calado).toFixed(1) + "m" + agenciaTexto;

  itemLista.appendChild(topoCartao);
  itemLista.appendChild(linhaCarga);
  itemLista.appendChild(linhaCalado);

  // Regra de negócio do Porto do Itaqui: navios com calado >= 12m exigem atenção à amplitude de maré
  if (Number(navio.calado) >= 12.0) {
    const avisoMare = document.createElement("span");
    avisoMare.className = "alerta-mare";
    avisoMare.textContent = "Atenção: Calado profundo (≥ 12m) — Exige Janela de Maré Cheia";
    itemLista.appendChild(avisoMare);
  }

  // Botões de ação do cartão
  const barraAcoes = document.createElement("div");
  barraAcoes.className = "acoes-cartao";

  const proximoStatus = obterProximoStatus(navio.status);
  if (proximoStatus) {
    const botaoAvancar = document.createElement("button");
    botaoAvancar.type = "button";
    botaoAvancar.className = "btn-acao btn-avancar";
    botaoAvancar.textContent = obterRotuloBotaoAvancar(navio.status);
    botaoAvancar.addEventListener("click", function () {
      avancarStatusNavio(navio.id);
    });
    barraAcoes.appendChild(botaoAvancar);
  }

  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.className = "btn-acao btn-remover";
  botaoRemover.textContent = "Concluir / Remover";
  botaoRemover.addEventListener("click", function () {
    removerNavio(navio.id);
  });
  barraAcoes.appendChild(botaoRemover);

  itemLista.appendChild(barraAcoes);
  return itemLista;
}

function preencherColunaLista(elementoUl, naviosDaColuna, mensagemVazia) {
  // Limpa a lista sem usar innerHTML
  while (elementoUl.firstChild) {
    elementoUl.removeChild(elementoUl.firstChild);
  }

  if (naviosDaColuna.length === 0) {
    const itemVazio = document.createElement("li");
    itemVazio.className = "item-vazio";
    itemVazio.textContent = mensagemVazia;
    elementoUl.appendChild(itemVazio);
    return;
  }

  naviosDaColuna.forEach(function (navio) {
    const cartao = criarElementoCartaoNavio(navio);
    elementoUl.appendChild(cartao);
  });
}

function renderizarPainel() {
  const termoFiltro = document.getElementById("input-filtro").value.trim().toLowerCase();

  const naviosFiltrados = listaNavios.filter(function (navio) {
    if (!termoFiltro) return true;
    const textoBusca = (navio.nome + " " + navio.carga + " " + (navio.agencia || "") + " " + (navio.imo || "")).toLowerCase();
    return textoBusca.includes(termoFiltro);
  });

  const esperados = naviosFiltrados.filter(function (n) { return n.status === "esperado"; });
  const fundeados = naviosFiltrados.filter(function (n) { return n.status === "fundeado"; });
  const atracados = naviosFiltrados.filter(function (n) { return n.status === "atracado"; });

  // Atualiza contadores usando textContent
  document.getElementById("contador-total").textContent = String(naviosFiltrados.length);
  document.getElementById("contador-esperados").textContent = String(esperados.length);
  document.getElementById("contador-fundeados").textContent = String(fundeados.length);
  document.getElementById("contador-atracados").textContent = String(atracados.length);

  // Preenche as 3 listas
  preencherColunaLista(
    document.getElementById("lista-esperados"),
    esperados,
    "Nenhum navio esperado para este filtro."
  );
  preencherColunaLista(
    document.getElementById("lista-fundeados"),
    fundeados,
    "Nenhum navio aguardando na fila de fundeio."
  );
  preencherColunaLista(
    document.getElementById("lista-atracados"),
    atracados,
    "Nenhum navio atracado nos berços no momento."
  );
}

// ============================================================================
// 4. MÓDULO DE EVENTOS E AÇÕES DO USUÁRIO (Camada de Interação)
// ============================================================================

function lidarComEnvioFormulario(evento) {
  evento.preventDefault();

  const campoNome = document.getElementById("input-nome");
  const campoImo = document.getElementById("input-imo");
  const campoCarga = document.getElementById("input-carga");
  const campoCalado = document.getElementById("input-calado");
  const campoAgencia = document.getElementById("input-agencia");
  const campoStatus = document.getElementById("select-status");

  const nomeLimpo = campoNome.value.trim().toUpperCase();
  const imoLimpo = campoImo.value.trim();
  const cargaLimpa = campoCarga.value.trim();
  const caladoTexto = campoCalado.value.trim();
  const agenciaLimpa = campoAgencia.value.trim().toUpperCase();
  const statusEscolhido = campoStatus.value;

  const resultadoValidacao = validarEntradaNavio(nomeLimpo, cargaLimpa, caladoTexto);
  if (!resultadoValidacao.valido) {
    exibirMensagemFeedback(resultadoValidacao.erro, "erro");
    return;
  }

  const novoNavio = {
    id: "navio-" + Date.now(),
    nome: nomeLimpo,
    imo: imoLimpo || "N/D",
    carga: cargaLimpa,
    calado: resultadoValidacao.caladoNumero,
    agencia: agenciaLimpa || "EMAP / AGÊNCIA LOCAL",
    status: statusEscolhido
  };

  listaNavios.unshift(novoNavio);
  salvarNaviosNoStorage();
  renderizarPainel();

  document.getElementById("form-navio").reset();
  campoNome.focus();
  exibirMensagemFeedback("Navio " + novoNavio.nome + " registrado com sucesso no painel!", "sucesso");
}

function avancarStatusNavio(idNavio) {
  ocultarMensagemFeedback();
  const navioEncontrado = listaNavios.find(function (n) { return n.id === idNavio; });
  if (!navioEncontrado) return;

  const proximo = obterProximoStatus(navioEncontrado.status);
  if (proximo) {
    navioEncontrado.status = proximo;
    salvarNaviosNoStorage();
    renderizarPainel();
  }
}

function removerNavio(idNavio) {
  ocultarMensagemFeedback();
  listaNavios = listaNavios.filter(function (n) { return n.id !== idNavio; });
  salvarNaviosNoStorage();
  renderizarPainel();
}

function restaurarDadosIniciaisEmap() {
  listaNavios = [...NAVIOS_INICIAIS_EMAP];
  salvarNaviosNoStorage();
  document.getElementById("input-filtro").value = "";
  renderizarPainel();
  exibirMensagemFeedback("Dados originais do artigo da EMAP restaurados com sucesso.", "sucesso");
}

// Inicialização da aplicação após carregamento do DOM
document.addEventListener("DOMContentLoaded", function () {
  carregarNaviosDoStorage();
  renderizarPainel();

  document.getElementById("form-navio").addEventListener("submit", lidarComEnvioFormulario);
  document.getElementById("input-filtro").addEventListener("input", renderizarPainel);
  document.getElementById("btn-restaurar").addEventListener("click", restaurarDadosIniciaisEmap);
});
