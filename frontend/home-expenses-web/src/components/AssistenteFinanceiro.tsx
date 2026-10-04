import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X } from "lucide-react";

function AssistenteFinanceiro() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button className="assistente-botao-flutuante" onClick={() => setAberto(!aberto)}>
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
            <p>Conteúdo do assistente vai aqui</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AssistenteFinanceiro;