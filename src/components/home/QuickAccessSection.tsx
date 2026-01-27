import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FilePlus, 
  ClipboardList, 
  Users, 
  Clock,
  Newspaper,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const quickLinks = [
  {
    title: "Novo Protocolo",
    description: "Abra uma nova solicitação",
    href: "/novo-protocolo",
    icon: FilePlus,
    color: "text-accent",
  },
  {
    title: "Meus Protocolos",
    description: "Acompanhe suas solicitações",
    href: "/meus-protocolos",
    icon: ClipboardList,
    color: "text-primary",
  },
  {
    title: "Processos Seletivos",
    description: "Concursos e seleções",
    href: "/processos-seletivos",
    icon: Users,
    color: "text-status-preferential",
  },
  {
    title: "Painel de Senhas",
    description: "Atendimento presencial",
    href: "/painel-senhas",
    icon: Clock,
    color: "text-status-progress",
  },
];

const latestNews = [
  {
    id: 1,
    title: "Novo sistema de protocolo digital entra em operação",
    date: "16 Jan 2026",
    category: "Tecnologia",
  },
  {
    id: 2,
    title: "Prefeitura amplia horário de atendimento ao cidadão",
    date: "15 Jan 2026",
    category: "Serviços",
  },
  {
    id: 3,
    title: "Campanha de conscientização ambiental terá início em fevereiro",
    date: "14 Jan 2026",
    category: "Meio Ambiente",
  },
];

export function QuickAccessSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="gov-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest News */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                  <CardTitle>Últimas Notícias</CardTitle>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/noticias" className="gap-1">
                    Ver todas
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {latestNews.map((news, index) => (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="w-2 h-2 mt-2 rounded-full bg-accent shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground line-clamp-1">
                          {news.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {news.date}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {news.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔗 Acesso Rápido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className={`${link.color}`}>
                          <link.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {link.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}