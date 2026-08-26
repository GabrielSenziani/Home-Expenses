# Home Expenses

Aplicação Full Stack para controle de gastos residenciais, desenvolvida como parte de um desafio técnico. O sistema permite gerenciar pessoas e transações financeiras, além de apresentar um resumo financeiro individual e geral.

## Deploy

* **Frontend:** [https://home-expenses-1.onrender.com](https://home-expenses-1.onrender.com)
* **Backend (Swagger):** [https://home-expenses-4nyv.onrender.com/swagger](https://home-expenses-4nyv.onrender.com/swagger)

## Tecnologias Utilizadas

### Backend

* ASP.NET Core (.NET)
* C#
* Entity Framework Core
* SQLite

### Frontend

* React
* TypeScript
* Vite
* Axios

## Funcionalidades

### Cadastro de Pessoas

* Cadastro de novas pessoas
* Listagem de pessoas cadastradas
* Exclusão de pessoas
* Exclusão automática das transações vinculadas à pessoa removida

Cada pessoa possui:

* Identificador
* Nome
* Idade

### Cadastro de Transações

* Cadastro de receitas e despesas
* Listagem das transações cadastradas
* Associação obrigatória de cada transação a uma pessoa

Cada transação possui:

* Identificador
* Descrição
* Valor
* Tipo (Receita ou Despesa)
* Pessoa vinculada

### Consulta de Totais

O sistema calcula automaticamente:

* Total de receitas por pessoa
* Total de despesas por pessoa
* Saldo individual
* Total geral de receitas
* Total geral de despesas
* Saldo líquido geral

## Regras de Negócio

* Pessoas menores de 18 anos podem cadastrar apenas despesas.
* Toda transação deve estar vinculada a uma pessoa existente.
* Ao excluir uma pessoa, todas as suas transações são removidas automaticamente.
* Os dados permanecem salvos após o encerramento da aplicação utilizando SQLite.

## Estrutura do Projeto

```
HomeExpenses/
├── backend/
│   └── HomeExpenses.Api/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Models/
│       └── Migrations/
│
└── frontend/
    └── home-expenses-web/
        ├── src/
        │   ├── components/
        │   ├── services/
        │   └── types/
        └── public/

```

## Como Executar

### Backend

Entre na pasta do backend:

```
cd backend/HomeExpenses.Api
```

Restaure as dependências:

```
dotnet restore
```

Execute a aplicação:

```
dotnet run
```

O backend ficará disponível em:

```
http://localhost:5045

```

Swagger:

```
http://localhost:5045/swagger

```

### Frontend

Entre na pasta do frontend:

```
cd frontend/home-expenses-web
```

Instale as dependências:

```
npm install
```

Execute a aplicação:

```
npm run dev
```

O frontend ficará disponível em:

```
http://localhost:5173

```

## Arquitetura

O frontend desenvolvido em React consome a API REST criada em ASP.NET Core através de requisições HTTP utilizando Axios.
Toda a lógica de negócio é executada no backend, enquanto o frontend é responsável apenas pela interface e consumo da API.

## Demonstração

### Cadastro de Pessoas

* Criação
* Listagem
* Exclusão

### Cadastro de Transações

* Cadastro de receitas
* Cadastro de despesas
* Associação entre pessoa e transação

### Consulta Financeira

* Totais individuais
* Total geral
* Saldo líquido

## Objetivo

Este projeto foi desenvolvido para demonstrar conhecimentos em:

* Desenvolvimento de APIs REST
* ASP.NET Core
* Entity Framework Core
* React
* TypeScript
* Integração entre frontend e backend
* Persistência de dados com SQLite
* Aplicação de regras de negócio
* Organização e estruturação de aplicações Full Stack
