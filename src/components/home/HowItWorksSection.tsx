import { motion } from "framer-motion";
import { MousePointer2, FileEdit, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Escolha o Serviço",
    description: "Selecione o tipo de serviço que você precisa entre as opções disponíveis",
    icon: MousePointer2,
  },
  {
    number: "2",
    title: "Preencha os Dados",
    description: "Informe os detalhes da sua solicitação, endereço e anexe documentos se necessário",
    icon: FileEdit,
  },
  {
    number: "3",
    title: "Receba o Protocolo",
    description: "Após o envio, você receberá um número de protocolo para acompanhamento",
    icon: CheckCircle,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="gov-container">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-4"
          >
            🎯 Como Funciona
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Abra seu protocolo em 3 passos simples
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="gov-card text-center h-full">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground font-bold text-lg flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}