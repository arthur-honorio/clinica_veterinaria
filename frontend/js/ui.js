// Funções de interface reutilizadas por todas as páginas.

const CHAVE_AVISO_PENDENTE = "avisoPendente";

// ---------- Mensagens para o usuário ----------

function mostrarMensagem(texto, tipo = "erro") {
  const caixa = document.getElementById("mensagem");
  caixa.textContent = texto;
  caixa.className = `mensagem mensagem-${tipo}`;
  caixa.hidden = false;
  caixa.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function esconderMensagem() {
  document.getElementById("mensagem").hidden = true;
}

// Guarda um aviso de sucesso para exibir na próxima página (após redirecionar).
function avisarNaProximaPagina(texto) {
  try {
    sessionStorage.setItem(CHAVE_AVISO_PENDENTE, texto);
  } catch {
    // sem sessionStorage o aviso apenas não aparece
  }
}

function exibirAvisoPendente() {
  try {
    const texto = sessionStorage.getItem(CHAVE_AVISO_PENDENTE);
    if (!texto) return;
    sessionStorage.removeItem(CHAVE_AVISO_PENDENTE);
    mostrarMensagem(texto, "sucesso");
  } catch {
    // ignora
  }
}

// ---------- Formulários ----------

function lerFormulario(formulario) {
  const dados = Object.fromEntries(new FormData(formulario));
  Object.keys(dados).forEach((campo) => (dados[campo] = dados[campo].trim()));
  return dados;
}

function limparErrosDosCampos(formulario) {
  formulario.querySelectorAll(".erro-campo").forEach((erro) => erro.remove());
  formulario
    .querySelectorAll("[aria-invalid]")
    .forEach((campo) => campo.removeAttribute("aria-invalid"));
}

function mostrarErrosDosCampos(formulario, erros) {
  limparErrosDosCampos(formulario);
  Object.entries(erros).forEach(([nomeCampo, texto]) => {
    const campo = formulario.elements[nomeCampo];
    const aviso = document.createElement("span");
    aviso.className = "erro-campo";
    aviso.id = `erro-${nomeCampo}`;
    aviso.textContent = texto;
    campo.setAttribute("aria-invalid", "true");
    campo.setAttribute("aria-describedby", aviso.id);
    campo.after(aviso);
  });
  formulario.querySelector("[aria-invalid]")?.focus();
}

function preencherFormulario(formulario, dados) {
  Object.entries(dados).forEach(([nomeCampo, valor]) => {
    const campo = formulario.elements[nomeCampo];
    if (campo) campo.value = valor ?? "";
  });
}

function definirCarregando(botao, carregando) {
  botao.disabled = carregando;
  botao.dataset.textoOriginal ??= botao.textContent;
  botao.textContent = carregando ? "Salvando..." : botao.dataset.textoOriginal;
}

// ---------- Formatação ----------

const ENTIDADES_HTML = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

// Evita que um texto digitado pelo usuário seja interpretado como HTML.
function escaparHtml(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ENTIDADES_HTML[c]);
}

// "2026-02-24" ou "2026-02-24T03:00:00.000Z" -> "2026-02-24"
function paraCampoData(data) {
  return String(data ?? "").slice(0, 10);
}

// "2026-02-24" -> "24/02/2026"
function formatarData(data) {
  const [ano, mes, dia] = paraCampoData(data).split("-");
  return dia ? `${dia}/${mes}/${ano}` : "";
}

// "85999991111" -> "(85) 99999-1111"
function formatarTelefoneNacional(digitos) {
  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  const corte = numero.length - 4;
  if (!numero) return ddd ? `(${ddd}` : "";
  if (corte <= 0) return `(${ddd}) ${numero}`;
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`;
}

// "5585999991111" -> "(85) 99999-1111"
function formatarTelefone(telefone) {
  return formatarTelefoneNacional(somenteDigitos(telefone).replace(/^55/, ""));
}

function aplicarMascaraTelefone(campo) {
  campo.addEventListener("input", () => {
    const digitos = somenteDigitos(campo.value).slice(0, 11);
    campo.value = formatarTelefoneNacional(digitos);
  });
}

// ---------- Navegação ----------

function obterParametroDaUrl(nome) {
  return new URLSearchParams(window.location.search).get(nome);
}

function irPara(endereco) {
  window.location.href = endereco;
}
