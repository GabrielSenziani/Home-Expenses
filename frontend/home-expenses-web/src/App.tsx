import { useState } from "react";

import ListaPessoas from "./components/ListaPessoas";
import Transacoes from "./components/Transacoes";
import Totais from "./components/Totais";
import AssistenteFinanceiro from "./components/AssistenteFinanceiro";

import "./App.css";

import { Users, Receipt, Wallet } from "lucide-react";

function App() {
  const [atualizacao, setAtualizacao] = useState(0);

  function atualizarDados() {
    setAtualizacao((valor) => valor + 1);
  }

return (
    <div className="app">
      <h1>Controle de Gastos Residenciais</h1>

      <div className="card">
        <h2>
          <Users size={22} />
          Pessoas
        </h2>

        <p className="card-description">
          Cadastre as pessoas que participam das despesas da residência.
        </p>

        <ListaPessoas onAtualizar={atualizarDados} />
      </div>

      <div className="card">
        <h2>
          <Receipt size={22} />
          Nova transação
        </h2>

        <p className="card-description">
          Registre despesas e receitas vinculadas a uma pessoa.
        </p>

        <Transacoes
          onAtualizar={atualizarDados}
          atualizacao={atualizacao}
        />
      </div>

      <div className="card">
        <h2>
          <Wallet size={22} />
          Resumo financeiro
        </h2>

        <p className="card-description">
          Acompanhe os totais das movimentações cadastradas.
        </p>

        <Totais atualizacao={atualizacao} />
      </div>

      <AssistenteFinanceiro />
    </div>
  );
}

export default App;