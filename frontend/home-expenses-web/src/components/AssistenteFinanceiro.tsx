import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";
import api from "../services/api";

type Etapa = "digitando" | "confirmando" | "resultado";

interface DadosExtraidos {
  acao: string;
  periodo: string;
  categoriaMencionada: string | null;
}

interface ResultadoDaAnalise {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  textoExplicativo: string;
  aviso: string | null;
}

function AssistenteFinanceiro() {
  const [aberto, setAberto] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>("digitando");
  const [textoUsuario, setTextoUsuario] = useState("");
  const [dadosExtraidos, setDadosExtraidos] = useState<DadosExtraidos | null>(
    null,
  );
  const [carregando, setCarregando] = useState(false);
  const [podeEnviar, setPodeEnviar] = useState(true);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [nomePessoa, setNomePessoa] = useState("");
  const [periodoConfirmado, setPeriodoConfirmado] = useState("");
  const [categoriaConfirmada, setCategoriaConfirmada] = useState("");
  const [resultado, setResultado] = useState<ResultadoDaAnalise | null>(null);

  async function handleAnalisar() {
    if (!textoUsuario.trim()) {
      alert("Digite uma pergunta antes de continuar.");
      return;
    }

    setCarregando(true);
    try {
      const resposta = await api.post<DadosExtraidos>("/api/Assistente", {
        texto: textoUsuario,
      });
      setDadosExtraidos(resposta.data);
      setPeriodoConfirmado(resposta.data.periodo);
      setCategoriaConfirmada(resposta.data.categoriaMencionada ?? "");
      setEtapa("confirmando");
      iniciarCooldown();
    } catch (erro) {
      alert("Não foi possível analisar o texto. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  function iniciarCooldown() {
    setPodeEnviar(false);
    setSegundosRestantes(30);

    const intervalo = setInterval(() => {
      setSegundosRestantes((segundos) => {
        if (segundos <= 1) {
          clearInterval(intervalo);
          setPodeEnviar(true);
          return 0;
        }
        return segundos - 1;
      });
    }, 1000);
  }

  async function handleConfirmar() {
    if (!nomePessoa.trim() || !periodoConfirmado.trim()) {
      alert(
        "É necessário que o nome de uma pessoa e um periodo (dia, mês e ano) estejam preenchidos para iniciarmos a análise financeira.",
      );
      return;
    }

    setCarregando(true);
    try {
      const respostaEsperada = await api.post<ResultadoDaAnalise>(
        "/api/Assistente/confirmar",
        {
          nomePessoa: nomePessoa,
          periodo: periodoConfirmado,
          categoriaMencionada: categoriaConfirmada || null,
        },
      );
      setResultado(respostaEsperada.data);
      setEtapa("resultado");
      iniciarCooldown();
    } catch (erro) {
      alert(
        "Não foi possivel retornar uma analise com base nos dados cadastrados. Tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }

   function handleReiniciar() {
  setTextoUsuario("");
  setDadosExtraidos(null);
  setNomePessoa("");
  setPeriodoConfirmado("");
  setCategoriaConfirmada("");
  setResultado(null);
  setEtapa("digitando");
}

  return (
    <>
      <button
        className="assistente-botao-flutuante"
        onClick={() => setAberto(!aberto)}
      >
        {aberto ? <X size={24} /> : <Bot size={24} />}
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            className="assistente-painel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {etapa === "digitando" && (
              <div>
                <p>Me conte sobre suas finanças:</p>
                <textarea
                  value={textoUsuario}
                  onChange={(e) => setTextoUsuario(e.target.value)}
                  placeholder="Ex: recebi 3000 de salário e gastei 2000 com contas, como posso melhorar?"
                  rows={4}
                  maxLength={1000}
                />
                <button
                  onClick={handleAnalisar}
                  disabled={carregando || !podeEnviar}
                >
                  {carregando
                    ? "Analisando..."
                    : !podeEnviar
                      ? `Aguarde ${segundosRestantes}s`
                      : "Analisar"}
                </button>
              </div>
            )}

            {etapa === "confirmando" && (
              <div>
                <p>Confirme os dados da análise:</p>

                <div className="form-group">
                  <label htmlFor="nomePessoa">Nome da pessoa</label>
                  <input
                    id="nomePessoa"
                    type="text"
                    placeholder="Digite o nome completo"
                    value={nomePessoa}
                    onChange={(e) => setNomePessoa(e.target.value)}
                    maxLength={40}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="periodo">Período</label>
                  <input
                    id="periodo"
                    type="text"
                    value={periodoConfirmado}
                    onChange={(e) => setPeriodoConfirmado(e.target.value)}
                    maxLength={40}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoria">Categoria mencionada</label>
                  <input
                    id="categoria"
                    type="text"
                    placeholder="Nenhuma categoria mencionada"
                    value={categoriaConfirmada}
                    onChange={(e) => setCategoriaConfirmada(e.target.value)}
                    maxLength={40}
                  />
                </div>

                <button
                  onClick={handleConfirmar}
                  disabled={carregando || !podeEnviar}
                >
                  {carregando
                    ? "Confirmando..."
                    : !podeEnviar
                      ? `Aguarde ${segundosRestantes}s`
                      : "Confirmar"}
                </button>
              </div>
            )}

                {etapa === "resultado" && resultado && (
                  <div>
                    {resultado.aviso ? (
                      <p>{resultado.aviso}</p>
                    ) : (
                      <>
                        <p>Receitas: R$ {resultado.totalReceitas}</p>
                        <p>Despesas: R$ {resultado.totalDespesas}</p>
                        <p>Saldo: R$ {resultado.saldo}</p>
                        <p>{resultado.textoExplicativo}</p>
                      </>
                    )}
                    <button onClick={handleReiniciar}>Nova análise</button>
                  </div>
                )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AssistenteFinanceiro;
