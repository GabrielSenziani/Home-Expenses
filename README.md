# Home Expenses

Aplicação Full Stack para controle de gastos residenciais, desenvolvida como parte de um desafio técnico. O sistema permite gerenciar pessoas e transações financeiras, apresentar resumos financeiros e utilizar Inteligência Artificial para auxiliar no registro de novas transações.

## Deploy

- **Frontend:** [https://home-expenses-1.onrender.com](https://home-expenses-1.onrender.com/swagger)
- **Backend (Swagger):** [https://home-expenses-4nyv.onrender.com/swagger](https://home-expenses-4nyv.onrender.com/swagger)

## Tecnologias Utilizadas

### Backend

- ASP.NET Core (.NET)
- C#
- Entity Framework Core
- SQLite
- Integração com LLM (Google Gemini)

### Frontend

- React
- TypeScript
- Vite
- Axios

## Funcionalidades

### Cadastro de Pessoas

- Cadastro de novas pessoas
- Listagem de pessoas cadastradas
- Exclusão de pessoas
- Exclusão automática das transações vinculadas à pessoa removida

Cada pessoa possui:

- Identificador
- Nome
- Idade

### Cadastro de Transações

- Cadastro de receitas e despesas
- Listagem das transações cadastradas
- Associação obrigatória de cada transação a uma pessoa

Cada transação possui:

- Identificador
- Descrição
- Valor
- Tipo (Receita ou Despesa)
- Pessoa vinculada

### Assistente Financeiro com Inteligência Artificial

O sistema possui um assistente financeiro integrado a um LLM para auxiliar o usuário no registro de receitas e despesas a partir de linguagem natural.

O usuário pode descrever uma transação de forma livre, e a aplicação utiliza o modelo **Gemini Flash** para extrair as informações relevantes.

O fluxo foi desenvolvido para que a Inteligência Artificial não tenha controle direto sobre a criação da transação:

1. O usuário descreve a transação em linguagem natural.
2. O backend envia a solicitação para o modelo de IA.
3. A IA realiza a extração dos dados da transação.
4. A aplicação retorna os dados extraídos para o frontend.
5. O frontend apresenta um formulário pré-preenchido com as informações identificadas.
6. O usuário pode revisar e corrigir os dados.
7. Somente após a confirmação do usuário a transação é efetivamente registrada.

Esse fluxo adiciona uma camada de **validação humana (Human-in-the-Loop)**, evitando que uma interpretação incorreta do modelo resulte diretamente em uma alteração nos dados financeiros.

### Endpoints de Inteligência Artificial

Foram adicionados dois endpoints específicos para o fluxo do assistente financeiro:

- **Extração de dados:** recebe a descrição fornecida pelo usuário e utiliza o LLM para identificar os dados da transação.
- **Confirmação:** recebe os dados revisados pelo usuário e retorna as informações necessárias para o preenchimento/registro da transação.

A separação dessas responsabilidades permite que a IA seja utilizada como uma ferramenta de **interpretação e sugestão**, enquanto a aplicação continua responsável pela validação e pelas regras de negócio.

### Consulta de Totais

O sistema calcula automaticamente:

- Total de receitas por pessoa
- Total de despesas por pessoa
- Saldo individual
- Total geral de receitas
- Total geral de despesas
- Saldo líquido geral

## Regras de Negócio

- Pessoas menores de 18 anos podem cadastrar apenas despesas.
- Toda transação deve estar vinculada a uma pessoa existente.
- Ao excluir uma pessoa, todas as suas transações são removidas automaticamente.
- Os dados permanecem salvos após o encerramento da aplicação utilizando SQLite.
- Os dados extraídos pela Inteligência Artificial devem ser revisados e confirmados pelo usuário antes do registro da transação.
- A IA não possui acesso direto à persistência das transações.

## Estrutura do Projeto

```arduino
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

```bash
cd backend/HomeExpenses.Api
```

Restaure as dependências:

```bash
dotnet restore
```

Execute a aplicação:

```bash
dotnet run
```

O backend ficará disponível em:

```text
http://localhost:5045
```

Swagger:

```text
http://localhost:5045/swagger
```

### Frontend

Entre na pasta do frontend:

```bash
cd frontend/home-expenses-web
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## Arquitetura

O frontend desenvolvido em React consome a API REST criada em ASP.NET Core através de requisições HTTP utilizando Axios.

Toda a lógica de negócio é executada no backend, enquanto o frontend é responsável pela interface e consumo da API.

A integração com Inteligência Artificial também é realizada através do backend. O frontend não se comunica diretamente com o provedor do LLM.

O fluxo do assistente financeiro segue a seguinte arquitetura:

```text
Usuário
   ↓
Frontend (React)
   ↓
API ASP.NET Core
   ↓
Serviço de Inteligência Artificial
   ↓
LLM (Gemini Flash)
   ↓
Dados extraídos
   ↓
Frontend
   ↓
Formulário pré-preenchido
   ↓
Confirmação do usuário
   ↓
API ASP.NET Core
   ↓
Regras de negócio
   ↓
SQLite
```

Essa abordagem mantém a IA isolada da persistência dos dados e permite que o backend continue sendo a camada responsável pelas regras de negócio e validações.

## Demonstração

### Cadastro de Pessoas

- Criação
- Listagem
- Exclusão

### Cadastro de Transações

- Cadastro de receitas
- Cadastro de despesas
- Associação entre pessoa e transação

### Assistente Financeiro

- Entrada de transações utilizando linguagem natural
- Extração automática de informações utilizando LLM
- Retorno dos dados extraídos pela API
- Formulário pré-preenchido no frontend
- Revisão e correção dos dados pelo usuário
- Confirmação antes do registro definitivo

### Consulta Financeira

- Totais individuais
- Total geral
- Saldo líquido

## Objetivo

Este projeto foi desenvolvido para demonstrar conhecimentos em:

- Desenvolvimento de APIs REST
- ASP.NET Core
- C#
- Entity Framework Core
- React
- TypeScript
- Integração entre frontend e backend
- Persistência de dados com SQLite
- Aplicação de regras de negócio
- Integração de Inteligência Artificial em aplicações
- Integração com LLMs
- Processamento de linguagem natural
- Validação de dados gerados por IA
- Arquitetura Human-in-the-Loop
- Organização e estruturação de aplicações Full Stack
