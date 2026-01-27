import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Menu,
  Home,
  Newspaper,
  Users,
  FilePlus,
  ClipboardList,
  Bell,
  ChevronDown,
  LayoutDashboard,
  UserCog,
  Building2,
  BarChart3,
  Inbox,
  Ticket,
  Monitor,
  Settings,
  LogIn,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

const publicLinks = [
  { href: "/", label: "Início", icon: Home },
  { href: "/noticias", label: "Notícias", icon: Newspaper },
  { href: "/processos-seletivos", label: "Processos Seletivos", icon: Users },
];

const authLinks = [
  { href: "/meus-protocolos", label: "Meus Protocolos", icon: ClipboardList },
  { href: "/novo-protocolo", label: "Novo Protocolo", icon: FilePlus },
];

const adminLinks = [
  { href: "/dashboard-gestor", label: "Dashboard Gestor", icon: LayoutDashboard },
  { href: "/gestao-usuarios", label: "Usuários", icon: UserCog },
  { href: "/gestao-noticias", label: "Notícias", icon: Newspaper },
  { href: "/secretarias", label: "Secretarias", icon: Building2 },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
];

const gestaoLinks = [
  { href: "/gestao-dashboard", label: "Gestão Dashboard", icon: BarChart3 },
  { href: "/gestao-processos-seletivos", label: "Processos Seletivos", icon: Users },
  { href: "/atendimentos", label: "Atendimentos", icon: Inbox },
  { href: "/recepcao", label: "Recepção", icon: Ticket },
  { href: "/painel-senhas", label: "Painel Senhas", icon: Monitor },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = isAuthenticated ? [...publicLinks, ...authLinks] : publicLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="gov-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-base font-bold text-primary leading-tight">Cidade Online</span>
              <span className="text-xs text-muted-foreground leading-tight">Sistema de Protocolo Digital</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                {/* Admin Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex gap-1.5 text-muted-foreground hover:text-foreground">
                      <Settings className="h-4 w-4" />
                      Admin
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Administração</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {adminLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link to={link.href} className="flex items-center gap-2">
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Gestão Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex gap-1.5 text-muted-foreground hover:text-foreground">
                      <LayoutDashboard className="h-4 w-4" />
                      Gestão
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Gestão de Atendimento</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {gestaoLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link to={link.href} className="flex items-center gap-2">
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notificações</span>
                      <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                        Ver todas
                      </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      {/* Notification Items */}
                      <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
                        <div className="flex items-start gap-2 w-full">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Novo protocolo atribuído</p>
                            <p className="text-xs text-muted-foreground truncate">
                              Protocolo #113-2026-43198 foi atribuído a você
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">5 min atrás</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
                        <div className="flex items-start gap-2 w-full">
                          <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Prazo se aproximando</p>
                            <p className="text-xs text-muted-foreground truncate">
                              Protocolo #113-2026-43197 vence em 2 dias
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">1 hora atrás</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
                        <div className="flex items-start gap-2 w-full">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">Protocolo concluído</p>
                            <p className="text-xs text-muted-foreground truncate">
                              Protocolo #113-2026-43196 foi finalizado
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">3 horas atrás</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="justify-center">
                      <Link to="/notificacoes" className="w-full text-center">
                        Ver todas as notificações
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 ml-1">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {user?.nome?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="hidden sm:flex items-center gap-1">
                        <span className="text-sm font-medium">{user?.nome || "Usuário"}</span>
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.nome}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {user?.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/meus-protocolos">Meus Protocolos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/configuracoes">Configurações</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate("/login")} className="gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-primary leading-tight">Cidade Online</span>
                      <span className="text-xs text-muted-foreground leading-tight">Sistema de Protocolo Digital</span>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive(link.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {isAuthenticated && (
                    <>
                      <div className="border-t pt-4">
                        <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">
                          ADMINISTRAÇÃO
                        </p>
                        <div className="space-y-1">
                          {adminLinks.map((link) => (
                            <Link
                              key={link.href}
                              to={link.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                            >
                              <link.icon className="h-4 w-4" />
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">
                          GESTÃO
                        </p>
                        <div className="space-y-1">
                          {gestaoLinks.map((link) => (
                            <Link
                              key={link.href}
                              to={link.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                            >
                              <link.icon className="h-4 w-4" />
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Button
                          variant="outline"
                          className="w-full gap-2 text-destructive"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          Sair
                        </Button>
                      </div>
                    </>
                  )}

                  {!isAuthenticated && (
                    <div className="border-t pt-4">
                      <Button
                        className="w-full gap-2"
                        onClick={() => {
                          navigate("/login");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogIn className="h-4 w-4" />
                        Entrar
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
