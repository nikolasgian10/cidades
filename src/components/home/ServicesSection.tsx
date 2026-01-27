import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb,
  Trash2,
  Construction,
  TreePine,
  Building,
  FileCheck,
  ClipboardList,
  Users,
  Megaphone,
  MessageSquare,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "iluminacao_publica",
    title: "Iluminação Pública",
    description: "Solicite reparos em postes, lâmpadas e rede elétrica pública",
    icon: Lightbulb,
    color: "bg-amber-500",
    secretaria: "obras",
  },
  {
    id: "limpeza_urbana",
    title: "Limpeza Urbana",
    description: "Denuncie acúmulo de lixo, entulho ou solicite limpeza",
    icon: Trash2,
    color: "bg-emerald-500",
    secretaria: "meio_ambiente",
  },
  {
    id: "buracos_vias",
    title: "Buracos e Vias",
    description: "Informe problemas em ruas, calçadas e pavimentação",
    icon: Construction,
    color: "bg-orange-500",
    secretaria: "obras",
  },
  {
    id: "poda_arvores",
    title: "Poda de Árvores",
    description: "Solicite poda ou remoção de árvores em área pública",
    icon: TreePine,
    color: "bg-green-600",
    secretaria: "meio_ambiente",
  },
  {
    id: "fiscalizacao_urbana",
    title: "Fiscalização Urbana",
    description: "Denuncie construções irregulares ou ocupações indevidas",
    icon: Building,
    color: "bg-red-500",
    secretaria: "urbanismo",
  },
  {
    id: "certidao",
    title: "Certidões",
    description: "Solicite certidões negativas, de débitos e outras",
    icon: FileCheck,
    color: "bg-blue-500",
    secretaria: "fazenda",
  },
  {
    id: "alvara",
    title: "Alvarás",
    description: "Solicite alvarás de funcionamento, obras e eventos",
    icon: ClipboardList,
    color: "bg-indigo-500",
    secretaria: "fazenda",
  },
  {
    id: "processo_seletivo",
    title: "Processos Seletivos",
    description: "Inscreva-se em concursos e processos seletivos",
    icon: Users,
    color: "bg-purple-500",
    secretaria: "administracao",
  },
  {
    id: "denuncia",
    title: "Denúncias",
    description: "Faça denúncias anônimas sobre irregularidades",
    icon: Megaphone,
    color: "bg-red-600",
    secretaria: "ouvidoria",
  },
  {
    id: "ouvidoria",
    title: "Ouvidoria",
    description: "Registre sugestões, reclamações e elogios",
    icon: MessageSquare,
    color: "bg-cyan-500",
    secretaria: "ouvidoria",
  },
  {
    id: "outros",
    title: "Outros Serviços",
    description: "Demais solicitações e serviços municipais",
    icon: FileText,
    color: "bg-gray-500",
    secretaria: "administracao",
  },
];

export function ServicesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div className="gov-container">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-4"
          >
            📋 Serviços Disponíveis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Escolha o tipo de serviço para abrir seu protocolo. A prioridade será
            definida automaticamente de acordo com o tipo selecionado.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="gov-card group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/novo-protocolo?tipo=${service.id}`)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${service.color} shrink-0`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-primary"
                >
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}