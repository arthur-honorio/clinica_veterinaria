const animai = [
  {
    nome: "Ti",
    nascimento: "2025-04-08",
    tutor: "Dionísio",
    raca: "Doberman",
    especie: "Cão",
  },
  {
    nome: "Ti",
    nascimento: "2025-04-08",
    tutor: "Dionísio",
    raca: "Doberman",
    especie: "Cão",
  },
  {
    nome: "Ti",
    nascimento: "2025-04-08",
    tutor: "Dionísio",
    raca: "Doberman",
    especie: "Cão",
  },
];

function gerarListaAnimais(listaAnimais) {
  let lista = "";
  listaAnimais.forEach((an) => {
    lista += `
      <tr>
        <td>${an.nome}</td>
        <td>${an.nascimento}</td>
        <td>${an.raca}</td>
        <td>${an.nome}</td>
        <td>${an.nascimento}</td>
      </tr>
        `;
  });
  return lista;
}

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("tbody");
  const listaHTML = gerarListaAnimais(animai);
  if (tableBody) tableBody.innerHTML = listaHTML;
});
