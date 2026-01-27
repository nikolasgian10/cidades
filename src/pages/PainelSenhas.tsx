import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Clock, Users } from "lucide-react";

// Mock data - senhas chamadas
const mockSenhas = [
  { numero: "P015", tipo: "preferencial", guiche: "02", servico: "Certidão", chamado: true },
  { numero: "N012", tipo: "normal", guiche: "03", servico: "Certidão", chamado: false },
  { numero: "P014", tipo: "preferencial", guiche: "01", servico: "Alvará", chamado: false },
  { numero: "N011", tipo: "normal", guiche: "02", servico: "Protocolo", chamado: false },
  { numero: "P013", tipo: "preferencial", guiche: "03", servico: "Certidão", chamado: false },
  { numero: "N010", tipo: "normal", guiche: "01", servico: "Alvará", chamado: false },
  { numero: "P012", tipo: "preferencial", guiche: "02", servico: "Protocolo", chamado: false },
  { numero: "N009", tipo: "normal", guiche: "03", servico: "Certidão", chamado: false },
  { numero: "P011", tipo: "preferencial", guiche: "01", servico: "Alvará", chamado: false },
  { numero: "N008", tipo: "normal", guiche: "02", servico: "Protocolo", chamado: false },
];

export default function PainelSenhas() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [senhaAtual, setSenhaAtual] = useState(mockSenhas[0]);
  const [ultimasSenhas, setUltimasSenhas] = useState(mockSenhas.slice(1, 11));

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate new ticket calls every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a new ticket being called
      const newSenha = {
        numero: `${Math.random() > 0.5 ? "P" : "N"}${String(Math.floor(Math.random() * 100)).padStart(3, "0")}`,
        tipo: Math.random() > 0.5 ? "preferencial" : "normal",
        guiche: String(Math.floor(Math.random() * 3) + 1).padStart(2, "0"),
        servico: ["Certidão", "Alvará", "Protocolo"][Math.floor(Math.random() * 3)],
        chamado: true,
      };
      setSenhaAtual(newSenha);
      setUltimasSenhas((prev) => [senhaAtual, ...prev.slice(0, 9)]);
    }, 15000);

    return () => clearInterval(interval);
  }, [senhaAtual]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gov-blue-light to-gov-blue text-white">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Prefeitura Municipal</h1>
            <p className="text-white/70">Painel de Atendimento</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-3xl font-mono font-bold">
            <Clock className="h-8 w-8" />
            {formatTime(currentTime)}
          </div>
          <p className="text-white/70 capitalize">{formatDate(currentTime)}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Senha Atual */}
          <motion.div
            key={senhaAtual.numero}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 text-center shadow-2xl"
          >
            <div className="mb-4">
              <span className="text-lg text-gray-500 uppercase tracking-wider font-medium">
                Senha Atual
              </span>
            </div>

            <motion.div
              key={senhaAtual.numero}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`text-[9rem] font-bold leading-none mb-6 ${
                senhaAtual.tipo === "preferencial"
                  ? "text-status-preferential"
                  : "text-primary"
              }`}
            >
              {senhaAtual.numero}
            </motion.div>

            <div className="space-y-2">
              <div className="text-[5rem] font-bold text-gray-800 leading-none">
                Guichê: {senhaAtual.guiche}
              </div>
              <div className="text-xl text-gray-500">{senhaAtual.servico}</div>
            </div>

            {senhaAtual.tipo === "preferencial" && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-status-preferential/10 text-status-preferential rounded-full">
                <Users className="h-5 w-5" />
                <span className="font-medium">Atendimento Preferencial</span>
              </div>
            )}
          </motion.div>

          {/* Últimas Chamadas */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Últimas Chamadas
            </h2>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {ultimasSenhas.map((senha, index) => (
                  <motion.div
                    key={`${senha.numero}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-2xl font-mono font-bold ${
                          senha.tipo === "preferencial"
                            ? "text-status-preferential"
                            : "text-white"
                        }`}
                      >
                        {senha.numero}
                      </span>
                      {senha.tipo === "preferencial" && (
                        <span className="px-2 py-1 bg-status-preferential/20 text-status-preferential text-xs rounded-full">
                          Preferencial
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-white/90">{senha.servico}</div>
                      <div className="text-white/50 text-sm">
                        Guichê {senha.guiche}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-white/50 text-sm">
        Sistema Municipal de Atendimento • Cidade Online
      </footer>
    </div>
  );
}