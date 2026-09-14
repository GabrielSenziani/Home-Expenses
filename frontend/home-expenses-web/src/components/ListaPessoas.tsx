import { useState, useEffect } from "react";
import api from "../services/api";
import type { Pessoa } from "../types/Pessoa";

import { UserPlus, Trash2 } from "lucide-react";

interface ListaPessoasProps {
    onAtualizar: () => void;
}

function ListaPessoas({ onAtualizar }: ListaPessoasProps) {
    const [pessoas, setPessoas] = useState<Pessoa[]>([]); // aqui foi tipado pois pessoas é uma lista de objetos do tipo Pessoa
    const [nome, setNome] = useState(""); // o useState() vai guardar os dados que mudam, mesma coisa para pessoas e idade
    const [idade, setIdade] = useState<number | "">("");

    useEffect(() => {
      async function carregarPessoas() {
        const resposta = await api.get<Pessoa[]>("/api/Pessoas");
        console.log("Resposta de pessoas:", resposta.data);
        setPessoas(resposta.data);
      }
      carregarPessoas();
    }, []);

    async function handleCriar() {
    if (!nome.trim() || idade === "") {
    alert("Preencha o nome e a idade.");
    return;
}
    await api.post("/api/Pessoas", {
        nome: nome,
        idade: idade,
    });

    const resposta = await api.get<Pessoa[]>("/api/Pessoas");
    setPessoas(resposta.data);

     onAtualizar();

     setNome("");
     setIdade("");
}

   async function handleDeletar(id: number) {
    await api.delete(`/api/Pessoas/${id}`);

    const resposta = await api.get<Pessoa[]>("/api/Pessoas");
     setPessoas(resposta.data);

     onAtualizar();
   }

return (
  <div>
    <div className="pessoas-form">
      <div className="form-group">
        <label htmlFor="nome">Nome completo</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite o nome da pessoa"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="idade">Idade</label>
        <input
          id="idade"
          type="number"
          placeholder="Digite a idade"
          value={idade}
          onChange={(e) =>
            setIdade(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
        />
      </div>

      <button onClick={handleCriar}>
        <UserPlus size={18} />
        Cadastrar pessoa
      </button>
    </div>

    <ul>
      {pessoas.map((pessoa) => (
        <li key={pessoa.id}>
          {pessoa.nome} — {pessoa.idade} anos

          <button onClick={() => handleDeletar(pessoa.id)}>
            <Trash2 size={16} />
            Deletar
          </button>
        </li>
      ))}
    </ul>
  </div>
);
}

export default ListaPessoas;