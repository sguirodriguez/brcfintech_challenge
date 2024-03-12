## Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados em sua máquina.

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

```bash
    DB_DATABASE="brcfintech"
    DB_USERNAME="guilherme.engr"
    DB_PASSWORD="K5xd9JRjPCQM"
    DB_HOST="ep-dark-darkness-a5yk2f8d.us-east-2.aws.neon.tech"
    DB_PORT="5432"
    PORT="3333"
    JWT_SECRET="c28c143fe8b775aa97cdcaa04dbcaae7f4e4c1ab2786a46078d63016b01769f8"
    CORS_ORIGIN="*"
    REDIS_URL="redis://default:97c95ee1355b47458b1c93b5e5a73dc4@precious-mayfly-45394.upstash.io:45394"
```

## Instalação

1. Instale as dependências utilizando o NPM:

```bash
 npm i
```

2. Execute o seguinte comando para rodar o build:

```bash
    npm run build
```

3. Execute o seguinte comando para rodar o server:

```bash
    npm run dev
```

## Documentação da API

#### Faz login na aplicação

```http
  POST /login
```

###### Retona os seguintes parâmetros

| Parâmetro  | Tipo     | Descrição                                  |
| :--------- | :------- | :----------------------------------------- |
| `id`       | `number` |                                            |
| `username` | `string` |                                            |
| `token`    | `string` | **Obrigatório**. para fazer as requisições |

#### Segue collection do postman para ver as API'S:

- [link para a collection](https://www.postman.com/security-technologist-45772221/workspace/brc-challenge/collection/31169427-c30318e5-e463-44ee-8819-6a62cd042930?action=share&creator=31169427)
