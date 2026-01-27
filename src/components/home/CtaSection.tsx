import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div className="gov-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-gov-green-dark p-8 md:p-12 text-center"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Abra seu protocolo agora e acompanhe sua solicitação em tempo real.
              Nosso sistema está disponível 24 horas por dia.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/novo-protocolo")}
              className="bg-white text-accent hover:bg-white/90 gap-2"
            >
              Abrir Novo Protocolo
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}