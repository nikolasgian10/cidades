import { Link } from "react-router-dom";
import { FileText, Mail, Clock, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="gov-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold">Cidade</span>
                <span className="text-lg font-bold text-accent"> Online</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Sistema Municipal de Protocolo Digital. Modernizando o atendimento
              ao cidadão com transparência e eficiência.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <nav className="space-y-2">
              <Link
                to="/"
                className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Portal do Cidadão
              </Link>
              {/* Mostrar apenas para usuários autenticados */}
              {(() => {
                try {
                  const { isAuthenticated } = useAuth();
                  return isAuthenticated ? (
                    <>
                      <Link
                        to="/consulta-protocolo"
                        className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        Consultar Protocolo
                      </Link>
                      <Link
                        to="/painel-senhas"
                        className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      >
                        Painel de Senhas
                      </Link>
                    </>
                  ) : null;
                } catch (e) {
                  return null;
                }
              })()}
              <Link
                to="/noticias"
                className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Notícias
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>Atendimento ao Cidadão</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Clock className="h-4 w-4" />
                <span>Segunda a Sexta: 8h às 17h</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>contato@cidadeonline.gov.br</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Cidade Online. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}