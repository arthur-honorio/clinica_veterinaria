
let tutores = [{nome: 'Nome do Tutor', telefone: 558567676767, endereco: 'Rua'}];
let animais = [];
let indiceEdicao = null;
let indiceEdicaoAnimal = null;


// ABRIR E FECHAR FORMULÁRIO DE TUTOR

function irPara(destino) {
    location.href = destino
}

function fecharFormulario() {
    document.querySelector("form").reset();
    indiceEdicao = null;
    history.back()
}

function atualizarListaTutores() {
    const select = document.getElementById("tutorAnimal");

    select.innerHTML = '<option value="">Selecione um tutor</option>';

    tutores.forEach(function(tutor, indice) {
        const opcao = document.createElement("option");

        opcao.value = indice;
        opcao.textContent = tutor.nome;

        select.appendChild(opcao);
    });
}


// CADASTRAR E EDITAR TUTOR

document.getElementsByTagName("Form").addEventListener("submit", function(event) {
    event.preventDefault();

    const tutor = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value
    };

    if (indiceEdicao === null) {
        tutores.push(tutor);
        alert("Tutor cadastrado com sucesso!");
    } else {
        tutores[indiceEdicao] = tutor;
        indiceEdicao = null;
        alert("Tutor atualizado com sucesso!");
    }

    mostrarTutores();
    fecharFormulario();
});


// CADASTRAR E EDITAR ANIMAL

document.getElementById("formAnimal").addEventListener("submit", function(event) {
    event.preventDefault();

    const animal = {
        nome: document.getElementById("nomeAnimal").value,
        especie: document.getElementById("especie").value,
        raca: document.getElementById("raca").value,
        tutorIndice: document.getElementById("tutorAnimal").value,
        nascimento: document.getElementById("nascimento").value
    };

    if (indiceEdicaoAnimal === null) {
        animais.push(animal);
        alert("Animal cadastrado com sucesso!");
    } else {
        animais[indiceEdicaoAnimal] = animal;
        indiceEdicaoAnimal = null;
        alert("Animal atualizado com sucesso!");
    }

    mostrarAnimais();
    fecharFormulario();
});


// MOSTRAR TUTORES

function mostrarTutores() {
    const lista = document.getElementById("listaTutores");

    lista.innerHTML = "";

    tutores.forEach(function(tutor, indice) {
        lista.innerHTML += `
            <div class="card">
                <h3>${tutor.nome}</h3>
                <p>Telefone: ${tutor.telefone}</p>
                <p>Endereço: ${tutor.endereco}</p>

                <button type="button" onclick="excluirTutor(${indice})">
                    Excluir
                </button>

                <button type="button" onclick="editarTutor(${indice})">
                    Editar
                </button>
            </div>
        `;
    });
}


// EXCLUIR TUTOR

function excluirTutor(indice) {
    tutores.splice(indice, 1);
    mostrarTutores();
}


// EDITAR TUTOR

function editarTutor(indice) {
    const tutor = tutores[indice];

    document.getElementById("nome").value = tutor.nome;
    document.getElementById("telefone").value = tutor.telefone;
    document.getElementById("endereco").value = tutor.endereco;

    indiceEdicao = indice;

    mostrarFormularioTutor();
}


// MOSTRAR ANIMAIS

function mostrarAnimais() {
    const lista = document.getElementById("listaAnimais");

    lista.innerHTML = "";

    animais.forEach(function(animal, indice) {
        lista.innerHTML += `
            <div class="card">
                <h3>${animal.nome}</h3>
                <p>Espécie: ${animal.especie}</p>
                <p>Raça: ${animal.raca}</p>
                <p>Tutor responsável: ${tutores[animal.tutorIndice]?.nome || "Não informado"}</p>
                <p>Data de nascimento: ${animal.nascimento}</p>

                <button type="button" onclick="excluirAnimal(${indice})">
                    Excluir
                </button>

                <button type="button" onclick="editarAnimal(${indice})">
                    Editar
                </button>
            </div>
        `;
    });
}


// EXCLUIR ANIMAL

function excluirAnimal(indice) {
    animais.splice(indice, 1);
    mostrarAnimais();
}


// EDITAR ANIMAL

function editarAnimal(indice) {
    const animal = animais[indice];

    document.getElementById("nomeAnimal").value = animal.nome;
    document.getElementById("especie").value = animal.especie;
    document.getElementById("raca").value = animal.raca;
    document.getElementById("nascimento").value = animal.nascimento;

    indiceEdicaoAnimal = indice;

    mostrarFormularioAnimal();

    document.getElementById("tutorAnimal").value = animal.tutorIndice;
}
