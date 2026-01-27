import { motion } from "framer-motion";
import { FileText, Clock, Users, CheckCircle2 } from "lucide-react";

const stats = [
  {
    label: "Total de Protocolos",
    value: "1.234",
    icon: FileText,
    color: "bg-status-open/10 text-status-open",
    iconBg: "bg-status-open",
  },
  {
    label: "Aguardando",
    value: "45",
    icon: Clock,
    color: "bg-status-progress/10 text-status-progress",
    iconBg: "bg-status-progress",
  },
  {
    label: "Em Atendimento",
    value: "89",
    icon: Users,
    color: "bg-status-preferential/10 text-status-preferential",
    iconBg: "bg-status-preferential",
  },
  {
    label: "Concluídos",
    value: "1.100",
    icon: CheckCircle2,
    color: "bg-status-complete/10 text-status-complete",
    iconBg: "bg-status-complete",
  },
];

export function StatsSection() {
  return (
    <section className="py-12 -mt-8 relative z-10">
      <div className="gov-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="gov-card flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}