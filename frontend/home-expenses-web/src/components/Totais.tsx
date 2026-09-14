import { useState, useEffect } from "react";
import api from "../services/api";
import type { TotalGeral } from "../types/Totais";

interface TotaisProps {
    atualizacao: number;
}

function Totais({ atualizacao }: TotaisProps) {
    const [totalGeral, setTotalGeral] = useState<TotalGeral | null>(null);

    useEffect(() => {
    async function buscaTodasAsPessoas() {
        const busca = await api.get<TotalGeral>("/api/Pessoas/totais");
        setTotalGeral(busca.data);
    } buscaTodasAsPessoas();
}, [atualizacao]);

  if (!totalGeral) {
    return <p>Carregando totais...</p>;
  }

  return (
    <div>
        <h2>Totais por Pessoa</h2>
        <ul>
        {totalGeral.pessoas.map((pessoa) => (
    <li key={pessoa.id}>
        { pessoa.nome } - Receitas: R$ {pessoa.totalReceitas} — Despesas: R${" "}
        {pessoa.totalDespesas} — Saldo: R$ {pessoa.saldo}
    </li>
))}
</ul>
        <h2>Total Geral</h2>
            <p>Receitas: R$ {totalGeral.totalDeReceitas}</p>
            <p>Despesas: R$ {totalGeral.totalDeDespesas}</p>
            <p>Saldo Líquido: R$ {totalGeral.saldoGeralTotal}</p>
    </div>
  )

}

export default Totais;