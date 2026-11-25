# Patas & Cia - Clínica Veterinária

Sistema web para a clínica veterinária Patas & Cia cadastrar **tutores** e os **animais** de cada tutor.

- Aplicação publicada: https://clinica-patas-e-cia.vercel.app
- API publicada: https://clinica-patas-e-cia-api.vercel.app

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como funciona](#como-funciona)
- [Como rodar localmente](#como-rodar-localmente)
- [Rotas da API](#rotas-da-api)
- [Regras de negócio](#regras-de-negócio)
- [Deploy](#deploy)
- [Problemas comuns](#problemas-comuns)

## Funcionalidades

- Cadastrar, listar, editar e remover tutores.
- Cadastrar, listar, editar e remover animais, sempre vinculados a um tutor.
- Ver os animais de um tutor específico (filtro na lista de animais).
- Validação dos dados no formulário (frontend) e de novo na API (backend), com mensagens de erro claras.

## Tecnologias

| Parte    | Tecnologias                                         |
| -------- | --------------------------------------------------- |
| Frontend | HTML, CSS e JavaScript puro (sem framework)          |
| Backend  | Node.js, Express 5, `pg` (driver do PostgreSQL), CORS |
| Banco    | PostgreSQL (em produção, Neon)                      |
| Deploy   | Vercel (frontend e API como projetos separados)     |

## Estrutura do projeto

```
amor-de-bicho/
├── backend/
│   ├── database/
│   │   └── schema.sql          # criação das tabelas
│   ├── requests/               # requisições de teste (extensão REST Client do VS Code)
│   │   ├── tutores.http
│   │   └── animais.http
│   ├── src/
│   │   ├── server.js           # cria o app Express, registra rotas e o tratamento de erros
│   │   ├── config/db.js        # conexão com o PostgreSQL (lê DATABASE_URL)
│   │   ├── routes/             # mapeia URL + método HTTP para o controller
│   │   ├── controllers/        # lê a requisição e monta a resposta HTTP
│   │   ├── services/           # regras de negócio e validações
│   │   ├── models/             # consultas SQL
│   │   ├── errors/ErroDeNegocio.js
│   │   └── utils/validacoes.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── index.html              # página inicial
    ├── tutores.html            # lista de tutores
    ├── tutorForm.html          # cadastro/edição de tutor
    ├── animais.html            # lista de animais (com filtro por tutor)
    ├── animalForm.html         # cadastro/edição de animal
    ├── css/style.css
    └── js/
        ├── config.js           # define a URL da API (local ou publicada)
        ├── api.js              # única camada que conversa com o backend (fetch)
        ├── ui.js               # funções de interface compartilhadas
        ├── validacoes.js       # validações dos formulários
        └── tutores.js, tutorForm.js, animais.js, animalForm.js  # um script por página
```

## Como funciona

### Visão geral

```
Navegador (HTML/CSS/JS)  --fetch/JSON-->  API Express  --SQL-->  PostgreSQL
```

O frontend é um conjunto de páginas estáticas. Cada página carrega os scripts na ordem `config.js` → `api.js` → `validacoes.js` → `ui.js` → script da página. Os dados nunca ficam no navegador: toda leitura e gravação passa pela API.

### Frontend

- **`config.js`** decide para onde as requisições vão. Se a página está aberta em `localhost`, `127.0.0.1` ou direto do arquivo (`file://`), usa `http://localhost:3000`. Em qualquer outro endereço, usa a API publicada.
- **`api.js`** expõe `tutorApi` e `animalApi` com os métodos `listar`, `buscar`, `inserir`, `editar` e `remover` (e `animalApi.listarPorTutor`). Se a API responde com erro, a mensagem que ela devolveu é mostrada ao usuário.
- **`validacoes.js`** aplica as mesmas regras do backend antes de enviar o formulário. O telefone pode ser digitado com máscara, como `(85) 99999-1111`, e é convertido para `5585999991111`.
- **`ui.js`** cuida das mensagens de sucesso/erro, inclusive avisos que aparecem na página seguinte depois de um redirecionamento.

### Backend

A API segue uma arquitetura em camadas. Uma requisição passa por:

1. **Route** (`routes/`): associa o caminho e o método HTTP a uma função do controller.
2. **Controller** (`controllers/`): pega parâmetros e corpo da requisição, chama o service e devolve o status HTTP certo (`200`, `201` ou `204`).
3. **Service** (`services/`): valida os dados e aplica as regras de negócio. Quando algo não é permitido, lança um `ErroDeNegocio` com a mensagem e o status (`400`, `404` ou `409`).
4. **Model** (`models/`): executa o SQL no PostgreSQL usando consultas parametrizadas.

O Express 5 encaminha automaticamente os erros das funções `async` para o tratador de erros em `server.js`. Ele responde `{ "mensagem": "..." }` com o status do `ErroDeNegocio`, ou `500` para erros inesperados.

### Banco de dados

Duas tabelas, definidas em [backend/database/schema.sql](backend/database/schema.sql):

- **`tutores`**: `id`, `nome`, `telefone`, `endereco`.
- **`animais`**: `id`, `nome`, `especie`, `raca`, `nascimento`, `tutor_id`.

`animais.tutor_id` referencia `tutores.id` com `ON DELETE RESTRICT`, ou seja, o banco não deixa apagar um tutor que ainda tem animais.

## Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) **20.6 ou superior** (o script usa `--env-file` e `--watch`).
- [PostgreSQL](https://www.postgresql.org/download/) instalado e rodando (ou um banco gratuito no [Neon](https://neon.tech/)).
- Git.

### 1. Clonar o repositório

```bash
git clone https://github.com/arthur-honorio/clinica_veterinaria.git
cd clinica_veterinaria
```

### 2. Criar o banco e as tabelas

Crie um banco vazio e rode o `schema.sql` nele. Pelo terminal, com o `psql`:

```bash
createdb -U postgres patas_e_cia
psql -U postgres -d patas_e_cia -f backend/database/schema.sql
```

Também dá para fazer pelo pgAdmin: crie o banco `patas_e_cia`, abra o Query Tool, cole o conteúdo de `schema.sql` e execute.

### 3. Configurar a conexão

Copie o arquivo de exemplo e ajuste usuário, senha, porta e nome do banco:

```bash
cd backend
cp .env.example .env
```

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/patas_e_cia
```

Se usar o Neon, cole a connection string que o painel dele fornece (ela já vem com `?sslmode=require`).

### 4. Instalar as dependências e subir a API

Ainda dentro de `backend/`:

```bash
npm install
npm run dev
```

O terminal deve mostrar `Servidor rodando em http://localhost:3000`. Abra esse endereço no navegador: se a resposta trouxer `horaDoBanco`, a API está conectada ao banco. Com `npm run dev`, o servidor reinicia sozinho quando um arquivo é salvo.

### 5. Abrir o frontend

O frontend não precisa de instalação. Com a API rodando, escolha uma opção:

- **Live Server (VS Code):** clique com o botão direito em `frontend/index.html` → *Open with Live Server*.
- **Pelo terminal:** na raiz do projeto, rode `npx serve frontend` e abra o endereço mostrado.
- **Direto do arquivo:** dê dois cliques em `frontend/index.html`.

Nos três casos o `config.js` detecta que está rodando localmente e usa a API em `http://localhost:3000`.

### 6. (Opcional) Popular com dados de teste

Os arquivos em [backend/requests/](backend/requests/) têm requisições prontas para cadastrar, listar, editar e remover tutores e animais. Instale a extensão **REST Client** no VS Code, abra `tutores.http` e clique em *Send Request* acima de cada bloco. Cadastre os tutores antes dos animais, porque todo animal precisa de um tutor existente.

## Rotas da API

URL base local: `http://localhost:3000`. Corpo das requisições e respostas em JSON.

| Método | Rota                       | Descrição                         | Sucesso |
| ------ | -------------------------- | --------------------------------- | ------- |
| GET    | `/`                        | Verifica se a API e o banco estão no ar | 200 |
| GET    | `/tutores`                 | Lista os tutores (ordem alfabética) | 200   |
| GET    | `/tutores/:id`             | Busca um tutor                    | 200     |
| POST   | `/tutores`                 | Cadastra um tutor                 | 201     |
| PUT    | `/tutores/:id`             | Edita um tutor                    | 200     |
| DELETE | `/tutores/:id`             | Remove um tutor sem animais       | 204     |
| GET    | `/animais`                 | Lista os animais (ordem alfabética) | 200   |
| GET    | `/animais/:id`             | Busca um animal                   | 200     |
| GET    | `/animais/tutor/:tutor_id` | Lista os animais de um tutor      | 200     |
| POST   | `/animais`                 | Cadastra um animal                | 201     |
| PUT    | `/animais/:id`             | Edita um animal                   | 200     |
| DELETE | `/animais/:id`             | Remove um animal                  | 204     |

### Exemplos de corpo

Tutor:

```json
{
  "nome": "Ana Maria",
  "telefone": "5585988887777",
  "endereco": "Rua 4"
}
```

Animal:

```json
{
  "nome": "Thor",
  "especie": "Cão",
  "raca": "Labrador",
  "nascimento": "2022-03-15",
  "tutor_id": 1
}
```

### Erros

Todo erro volta no formato:

```json
{ "mensagem": "Tutor não encontrado." }
```

| Status | Quando acontece                                                   |
| ------ | ----------------------------------------------------------------- |
| 400    | Dados obrigatórios faltando ou inválidos                          |
| 404    | Tutor ou animal com o `id` informado não existe                   |
| 409    | Tentativa de remover um tutor que ainda tem animais cadastrados   |
| 500    | Erro inesperado no servidor (detalhes aparecem só no terminal)    |

## Regras de negócio

**Tutor**

- Nome, telefone e endereço são obrigatórios.
- O telefone é salvo só com dígitos, no formato `55` + DDD + número de 8 ou 9 dígitos. Exemplos válidos: `558533334444` e `5585999991111`.
- Um tutor com animais cadastrados não pode ser removido (`409`). É preciso remover ou transferir os animais antes.

**Animal**

- Nome, espécie, raça, data de nascimento e tutor são obrigatórios.
- A data de nascimento precisa ser válida e não pode estar no futuro.
- O tutor informado em `tutor_id` precisa existir.

## Deploy

Frontend e API ficam na Vercel, em dois projetos separados que apontam para o mesmo repositório:

- **API** (`backend/` como diretório raiz): a Vercel importa o `app` exportado por `server.js` e o executa como função serverless. Por isso o `app.listen` só roda quando a variável `VERCEL` não existe, isto é, fora da Vercel. A variável de ambiente `DATABASE_URL` é configurada no painel da Vercel com a connection string do Neon.
- **Frontend** (`frontend/` como diretório raiz): site estático, sem etapa de build. Fora do `localhost`, o `config.js` usa a URL da API publicada, definida em `URL_API_PUBLICADA`.

Se a API mudar de endereço, basta atualizar `URL_API_PUBLICADA` em [frontend/js/config.js](frontend/js/config.js).

## Problemas comuns

| Sintoma | Causa provável e solução |
| ------- | ------------------------ |
| `node: bad option: --env-file=.env` | Node.js antigo. Atualize para a versão 20.6 ou superior. |
| API cai ao iniciar ou o `/` responde `500` | `DATABASE_URL` errada ou PostgreSQL parado. Confira usuário, senha, porta e nome do banco no `.env`. |
| `relation "tutores" does not exist` | O `schema.sql` não foi executado no banco configurado no `.env`. |
| `collation "pt-BR-x-icu" for encoding ... does not exist` | O PostgreSQL foi instalado sem suporte a ICU. Use o instalador oficial ou o Neon, que já vêm com ICU. |
| Frontend mostra "Não foi possível conectar ao servidor" | A API não está rodando em `http://localhost:3000`. Suba com `npm run dev` dentro de `backend/`. |
| `EADDRINUSE: address already in use :::3000` | Já existe outro processo usando a porta 3000. Encerre-o e rode de novo. |
