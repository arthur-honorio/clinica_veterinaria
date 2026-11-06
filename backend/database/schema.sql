CREATE TABLE tutores (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    telefone    VARCHAR(15) NOT NULL,
    endereco    VARCHAR(200) NOT NULL
);

CREATE TABLE animais (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    especie     VARCHAR(50) NOT NULL,
    raca        VARCHAR(50) NOT NULL,
    nascimento  DATE NOT NULL,
    tutor_id    INTEGER NOT NULL REFERENCES tutores(id) ON DELETE RESTRICT
);