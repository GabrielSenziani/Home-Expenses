import { useState, useEffect } from "react";
import api from "../services/api";
import type { Pessoa } from "../types/Pessoa";
import type { Transacao } from "../types/Transacao";

interface TransacoesProps {
  onAtualizar: () => void;
  atualizacao: number;
}

function Transacoes({ onAtualizar, atualizacao }: TransacoesProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [tipo, setTipo] = useState(0); // 0 = Despesa, 1 = Receita
  const [pessoaId, setPessoaId] = useState(0);
  const [data, setData] = useState("");

  async function carregarTransacoes() {
    const resposta = await api.get<Transacao[]>("/api/Transacoes");
    setTransacoes(resposta.data);
  }

  async function carregarPessoas() {
    const resposta = await api.get<Pessoa[]>("/api/Pessoas");
    setPessoas(resposta.data);
  }

  useEffect(() => {
    async function carregarDados() {
      carregarTransacoes();
      carregarPessoas();
    }
    carregarDados();
  }, [atualizacao]);

  async function handleCriar() {
    if (
      !descricao.trim() ||
      valor === "" ||
      valor <= 0 ||
      pessoaId === 0 ||
      !data
    ) {
      alert(
        "Preencha a descrição, informe um valor maior que 0 e selecione uma pessoa e escolha uma data válida.",
      );
      return;
    } try {
      await api.post("/api/Transacoes", {
      descricao: descricao,
      valor: valor,
      tipo: tipo,
      pessoaId: pessoaId,
      data: data,
    });

    await carregarTransacoes();

    // Atualiza o componente Totais
    onAtualizar();

    // limpa o formulário
    setDescricao("");
    setValor("");
    setTipo(0);
    setPessoaId(0);
    setData("");
    } catch (erro) {
      alert("Não foi possível cadastrar a transação. Verifique os dados e tente novamente.");

    }
  }

  return (
    <div>
      <div className="transacoes-form">
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            placeholder="Digite a descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="valor">Valor</label>
          <input
            id="valor"
            type="number"
            placeholder="Digite o valor"
            value={valor}
            onChange={(e) =>
              setValor(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo">Tipo</label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(Number(e.target.value))}
          >
            <option value={0}>Despesa</option>
            <option value={1}>Receita</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="data">Data</label>
          <input
            id="data"
            type="datetime-local"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pessoaId">Pessoa</label>
          <select
            id="pessoaId"
            value={pessoaId}
            onChange={(e) => setPessoaId(Number(e.target.value))}
          >
            <option value={0}>Selecione a pessoa</option>

            {pessoas.map((pessoa) => (
              <option key={pessoa.id} value={pessoa.id}>
                {pessoa.nome}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleCriar}>Cadastrar Transação</button>
      </div>

      <ul>
        {transacoes.map((transacao) => (
          <li key={transacao.id}>
            {transacao.descricao} — R$ {transacao.valor} —{" "}
            {transacao.tipo === 0 ? "Despesa" : "Receita"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transacoes;
