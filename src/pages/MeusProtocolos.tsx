import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Clock,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Printer,
  AlertCircle,
  ChevronDown,
  User,
  Building2,
  CheckCheck,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockProtocolos = [
  {
    id: "1",
    numero: "ITJ-2025-00123",
    tipo_servico: "Iluminação Pública",
    secretaria: "Obras",
    status: "em_atendimento",
    prioridade: "alta",
    descricao: "Poste apagado na esquina da Rua das Flores",
    created_date: "2025-01-15T14:30:00",
    lido: true,
    aberto_por_mim: true,
    is_anonimo: false,
    nome_cidadao: "João Silva",
    email_cidadao: "joao.silva@email.com",
    telefone_cidadao: "(35) 99999-1234",
  },
  {
    id: "2",
    numero: "ITJ-2025-00118",
    tipo_servico: "Limpeza Urbana",
    secretaria: "Meio Ambiente",
    status: "aberto",
    prioridade: "media",
    descricao: "Acúmulo de lixo no terreno baldio próximo à escola",
    created_date: "2025-01-14T09:15:00",
    lido: false,
    aberto_por_mim: false,
    is_anonimo: false,
    nome_cidadao: "Maria Santos",
    email_cidadao: "maria.santos@email.com",
    telefone_cidadao: "(35) 98888-5678",
  },
  {
    id: "3",
    numero: "ITJ-2025-00095",
    tipo_servico: "Buracos e Vias",
    secretaria: "Obras",
    status: "concluido",
    prioridade: "urgente",
    descricao: "Buraco grande na Avenida Principal causando acidentes",
    created_date: "2025-01-10T16:45:00",
    data_conclusao: "2025-01-13T11:00:00",
    lido: true,
    aberto_por_mim: true,
    is_anonimo: false,
    nome_cidadao: "Carlos Oliveira",
    email_cidadao: "carlos.oliveira@email.com",
    telefone_cidadao: "(35) 97777-9012",
  },
  {
    id: "4",
    numero: "ITJ-2025-00082",
    tipo_servico: "Poda de Árvores",
    secretaria: "Meio Ambiente",
    status: "aguardando_documentos",
    prioridade: "baixa",
    descricao: "Árvore com galhos sobre a rede elétrica",
    created_date: "2025-01-08T08:00:00",
    lido: false,
    aberto_por_mim: false,
    is_anonimo: true,
    nome_cidadao: "",
    email_cidadao: "",
    telefone_cidadao: "",
  },
  {
    id: "5",
    numero: "ITJ-2025-00045",
    tipo_servico: "Certidões",
    secretaria: "Fazenda",
    status: "concluido",
    prioridade: "media",
    descricao: "Solicitação de certidão negativa de débitos",
    created_date: "2025-01-05T10:30:00",
    data_conclusao: "2025-01-07T14:20:00",
    lido: true,
    aberto_por_mim: true,
    is_anonimo: false,
    nome_cidadao: "Ana Costa",
    email_cidadao: "ana.costa@email.com",
    telefone_cidadao: "(35) 96666-3456",
  },
];

const statusConfig: Record<string, { label: string; class: string; icon: typeof Clock }> = {
  aberto: { label: "Aberto", class: "gov-badge-open", icon: Clock },
  em_atendimento: { label: "Em Atendimento", class: "gov-badge-progress", icon: MessageSquare },
  aguardando_documentos: { label: "Aguardando Docs", class: "gov-badge-progress", icon: AlertCircle },
  documentos_enviados: { label: "Docs Enviados", class: "gov-badge-open", icon: FileText },
  concluido: { label: "Concluído", class: "gov-badge-complete", icon: CheckCircle },
  cancelado: { label: "Cancelado", class: "gov-badge-cancelled", icon: XCircle },
};

const prioridadeConfig = {
  baixa: { label: "Baixa", class: "bg-gray-100 text-gray-700" },
  media: { label: "Média", class: "bg-blue-100 text-blue-700" },
  alta: { label: "Alta", class: "bg-orange-100 text-orange-700" },
  urgente: { label: "Urgente", class: "bg-red-100 text-red-700" },
};

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "abertos", label: "Abertos" },
  { value: "andamento", label: "Em Andamento" },
  { value: "concluidos", label: "Concluídos" },
];

// Mock: simular se é gestor ou cidadão
const isGestor = false; // Mudar para true para testar visão de gestor

export default function MeusProtocolos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [origemFilter, setOrigemFilter] = useState<"todos" | "meus" | "secretaria">("todos");
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [finalizarDialogOpen, setFinalizarDialogOpen] = useState(false);
  const [selectedProtocolo, setSelectedProtocolo] = useState<string | null>(null);
  const [parecerForm, setParecerForm] = useState({
    parecer: "",
    decisao: "aprovado"
  });
  const [avaliacaoForm, setAvaliacaoForm] = useState({
    satisfacao: "",
    comentario: ""
  });

  const stats = {
    total: mockProtocolos.length,
    abertos: mockProtocolos.filter((p) => p.status === "aberto" || p.status === "aguardando_documentos").length,
    andamento: mockProtocolos.filter((p) => p.status === "em_atendimento").length,
    concluidos: mockProtocolos.filter((p) => p.status === "concluido").length,
    naoLidos: mockProtocolos.filter((p) => !p.lido).length,
  };

  const filteredProtocolos = mockProtocolos.filter((protocolo) => {
    const matchesSearch =
      protocolo.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocolo.tipo_servico.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocolo.descricao.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === "abertos") {
      matchesStatus = protocolo.status === "aberto" || protocolo.status === "aguardando_documentos";
    } else if (statusFilter === "andamento") {
      matchesStatus = protocolo.status === "em_atendimento";
    } else if (statusFilter === "concluidos") {
      matchesStatus = protocolo.status === "concluido";
    }

    let matchesOrigem = true;
    if (isGestor) {
      if (origemFilter === "meus") {
        matchesOrigem = protocolo.aberto_por_mim;
      } else if (origemFilter === "secretaria") {
        matchesOrigem = !protocolo.aberto_por_mim;
      }
    }

    return matchesSearch && matchesStatus && matchesOrigem;
  });

  const handleCloseProtocolo = () => {
    setCloseDialogOpen(false);
    setSelectedProtocolo(null);
  };

  const handleCancelProtocolo = () => {
    setCancelDialogOpen(false);
    setSelectedProtocolo(null);
  };

  const handleMarcarRecebido = (id: string) => {
    toast({
      title: "Protocolo marcado como recebido!",
      description: "O protocolo foi marcado como lido e recebido.",
    });
  };

  const handleFinalizar = () => {
    if (user?.role === 'gestor') {
      // Gestor precisa fornecer parecer
      if (!parecerForm.parecer.trim()) {
        alert("Por favor, forneça um parecer antes de finalizar.");
        return;
      }
    } else if (user?.role === 'cidadao') {
      // Cidadão precisa fornecer avaliação
      if (!avaliacaoForm.satisfacao) {
        alert("Por favor, avalie o atendimento antes de finalizar.");
        return;
      }
    }
    
    // Atualizar status do protocolo
    // Aqui seria feita a chamada para a API para atualizar o status
    
    setFinalizarDialogOpen(false);
    
    // Resetar formulários
    setParecerForm({ parecer: "", decisao: "aprovado" });
    setAvaliacaoForm({ satisfacao: "", comentario: "" });
    
    alert("Protocolo finalizado com sucesso!");
  };

  const handlePrintProtocolo = (protocolo: typeof mockProtocolos[0]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Protocolo ${protocolo.numero}</title>
          <style>
            @page { 
              size: A4; 
              margin: 15mm;
            }
            html, body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              color: #111;
              height: 100%;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page-container {
              height: 267mm; /* A4 height minus margins */
              display: flex;
              flex-direction: column;
            }
            .comprovante { 
              flex: 1;
              padding: 15px; 
              box-sizing: border-box;
              border-bottom: 2px dashed #999;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .comprovante:last-child { border-bottom: none; }
            .header { text-align:center; border-bottom:2px solid #222; padding-bottom:10px; margin-bottom:10px }
            .logo { font-size:14px; font-weight:700; color:#2563eb }
            .protocol-number { font-size:12px; font-weight:700; margin-top:5px }
            .section { margin-bottom:6px; font-size: 11px; line-height: 1.3; }
            .label { font-weight:700; display:inline-block; width:110px }
            .signatures { display:flex; gap:25px; margin-top:15px }
            .signature-box { flex:1; text-align:center }
            .sig-line { border-top:1px solid #000; margin-top:30px; }
            .small { font-size:9px; color:#666 }
            .cut-line { 
              text-align: center; 
              font-size: 9px; 
              color: #999; 
              margin: 8px 0; 
              border-top: 1px dashed #999; 
              padding-top: 3px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
          </style>
          </style>
        </head>
        <body>
          <div class="page-container">
            <!-- Primeiro comprovante -->
            <div class="comprovante">
              <div class="header">
                <div class="logo">🏛️ Prefeitura Municipal</div>
                <div class="protocol-number">Protocolo: ${protocolo.numero}</div>
              </div>
              <div class="section"><div><span class="label">Tipo de Serviço:</span> ${protocolo.tipo_servico}</div></div>
              <div class="section"><div><span class="label">Secretaria:</span> ${protocolo.secretaria}</div></div>
              <div class="section"><div><span class="label">Status:</span> ${statusConfig[protocolo.status].label}</div></div>
              <div class="section"><div><span class="label">Prioridade:</span> ${prioridadeConfig[protocolo.prioridade].label}</div></div>
              <div class="section"><div><span class="label">Data de Abertura:</span> ${new Date(protocolo.created_date).toLocaleDateString('pt-BR')}</div></div>
              ${protocolo.data_conclusao ? `<div class="section"><div><span class="label">Data de Conclusão:</span> ${new Date(protocolo.data_conclusao).toLocaleDateString('pt-BR')}</div></div>` : ''}
              <div class="section"><div style="margin-top:3px"><span class="label">Descrição:</span><div style="margin-left:115px; margin-top:3px">${protocolo.descricao}</div></div></div>
              ${!protocolo.is_anonimo ? `
              <div class="section"><div><span class="label">Solicitante:</span> ${protocolo.nome_cidadao}</div></div>
              <div class="section"><div><span class="label">E-mail:</span> ${protocolo.email_cidadao}</div></div>
              <div class="section"><div><span class="label">Telefone:</span> ${protocolo.telefone_cidadao}</div></div>
              ` : ''}

              <div class="signatures">
                <div class="signature-box">
                  <div class="sig-line"></div>
                  <div class="small">Assinatura do Solicitante</div>
                </div>
                <div class="signature-box">
                  <div class="sig-line"></div>
                  <div class="small">Assinatura do Funcionário</div>
                </div>
              </div>

              <div style="margin-top:10px; font-size:9px; color:#666; text-align:center">Documento gerado em ${new Date().toLocaleString('pt-BR')}</div>
            </div>

            <div class="cut-line">LINHA DE CORTE - DOBRAR E GUARDAR</div>

            <!-- Segundo comprovante (idêntico) -->
            <div class="comprovante">
              <div class="header">
                <div class="logo">🏛️ Prefeitura Municipal</div>
                <div class="protocol-number">Protocolo: ${protocolo.numero}</div>
              </div>
              <div class="section"><div><span class="label">Tipo de Serviço:</span> ${protocolo.tipo_servico}</div></div>
              <div class="section"><div><span class="label">Secretaria:</span> ${protocolo.secretaria}</div></div>
              <div class="section"><div><span class="label">Status:</span> ${statusConfig[protocolo.status].label}</div></div>
              <div class="section"><div><span class="label">Prioridade:</span> ${prioridadeConfig[protocolo.prioridade].label}</div></div>
              <div class="section"><div><span class="label">Data de Abertura:</span> ${new Date(protocolo.created_date).toLocaleDateString('pt-BR')}</div></div>
              ${protocolo.data_conclusao ? `<div class="section"><div><span class="label">Data de Conclusão:</span> ${new Date(protocolo.data_conclusao).toLocaleDateString('pt-BR')}</div></div>` : ''}
              <div class="section"><div style="margin-top:3px"><span class="label">Descrição:</span><div style="margin-left:115px; margin-top:3px">${protocolo.descricao}</div></div></div>
              ${!protocolo.is_anonimo ? `
              <div class="section"><div><span class="label">Solicitante:</span> ${protocolo.nome_cidadao}</div></div>
              <div class="section"><div><span class="label">E-mail:</span> ${protocolo.email_cidadao}</div></div>
              <div class="section"><div><span class="label">Telefone:</span> ${protocolo.telefone_cidadao}</div></div>
              ` : ''}

              <div class="signatures">
                <div class="signature-box">
                  <div class="sig-line"></div>
                  <div class="small">Assinatura do Solicitante</div>
                </div>
                <div class="signature-box">
                  <div class="sig-line"></div>
                  <div class="small">Assinatura do Funcionário</div>
                </div>
              </div>

              <div style="margin-top:10px; font-size:9px; color:#666; text-align:center">Documento gerado em ${new Date().toLocaleString('pt-BR')}</div>
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">📄 Meus Protocolos</h1>
                <p className="text-muted-foreground mt-1">
                  {isGestor ? "Protocolos da sua secretaria" : "Acompanhe todas as suas solicitações"}
                </p>
              </div>
            </div>
            <Button onClick={() => navigate("/novo-protocolo")} className="gap-2">
              <FileText className="h-4 w-4" />
              Novo Protocolo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                    <p className="text-sm text-blue-600/70 dark:text-blue-400/70 font-medium">Total</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.abertos}</p>
                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70 font-medium">Abertos</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.andamento}</p>
                    <p className="text-sm text-purple-600/70 dark:text-purple-400/70 font-medium">Em Andamento</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.concluidos}</p>
                    <p className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">Concluídos</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número, tipo ou descrição..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                {/* Status Dropdown */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Origem Filter (apenas para gestor) */}
                {isGestor && (
                  <Select 
                    value={origemFilter} 
                    onValueChange={(value: "todos" | "meus" | "secretaria") => setOrigemFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Todos
                        </span>
                      </SelectItem>
                      <SelectItem value="meus">
                        <span className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Abertos por mim
                        </span>
                      </SelectItem>
                      <SelectItem value="secretaria">
                        <span className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Da minha secretaria
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Protocol List */}
          <div className="space-y-4">
            {filteredProtocolos.map((protocolo, index) => {
              const status = statusConfig[protocolo.status];
              const canClose = ["em_atendimento", "aguardando_documentos", "documentos_enviados"].includes(
                protocolo.status
              );
              const canCancel = protocolo.status === "aberto";

              return (
                <motion.div
                  key={protocolo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`overflow-hidden hover:shadow-md transition-shadow ${!protocolo.lido ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Main Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="gov-protocol-number text-lg">
                              {protocolo.numero}
                            </span>
                            <Badge className={status.class}>
                              <status.icon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                            {!protocolo.lido && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                <Eye className="h-3 w-3 mr-1" />
                                Não Lido
                              </Badge>
                            )}
                            {protocolo.lido && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                <CheckCheck className="h-3 w-3 mr-1" />
                                Lido
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {protocolo.tipo_servico}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {protocolo.descricao}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              📅{" "}
                              {new Date(protocolo.created_date).toLocaleDateString("pt-BR")}
                            </span>
                            <span>🏛️ {protocolo.secretaria}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/consulta-protocolo?numero=${protocolo.numero}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/comunicacao/${protocolo.id}`)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Mensagens
                          </Button>
                          {isGestor && !protocolo.lido && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-amber-600 border-amber-300 hover:bg-amber-50"
                              onClick={() => handleMarcarRecebido(protocolo.id)}
                            >
                              <CheckCheck className="h-4 w-4 mr-1" />
                              Recebido
                            </Button>
                          )}
                          {canClose && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-status-complete border-status-complete hover:bg-status-complete/10"
                              onClick={() => {
                                setSelectedProtocolo(protocolo.numero);
                                setFinalizarDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Finalizar
                            </Button>
                          )}
                          {canCancel && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setSelectedProtocolo(protocolo.numero);
                                setCancelDialogOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePrintProtocolo(protocolo)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {filteredProtocolos.length === 0 && (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum protocolo encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não possui protocolos ou nenhum corresponde à busca.
                </p>
                <Button onClick={() => navigate("/novo-protocolo")}>
                  Abrir Novo Protocolo
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Close Protocol Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Fechamento</DialogTitle>
            <DialogDescription>
              Você confirma que o protocolo <strong>{selectedProtocolo}</strong> foi
              atendido satisfatoriamente?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCloseProtocolo} className="bg-status-complete hover:bg-status-complete/90">
              Confirmar Fechamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Protocol Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Protocolo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar o protocolo{" "}
              <strong>{selectedProtocolo}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleCancelProtocolo}>
              Cancelar Protocolo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalizar Protocolo Dialog */}
      <Dialog open={finalizarDialogOpen} onOpenChange={setFinalizarDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Finalizar Protocolo</DialogTitle>
            <DialogDescription>
              {user?.role === 'gestor' 
                ? 'Forneça seu parecer sobre este protocolo antes de finalizar.'
                : 'Avalie o atendimento recebido antes de finalizar o protocolo.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {user?.role === 'gestor' ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="parecer">Parecer *</Label>
                <Textarea
                  id="parecer"
                  placeholder="Digite seu parecer sobre o protocolo..."
                  value={parecerForm.parecer}
                  onChange={(e) => setParecerForm(prev => ({ ...prev, parecer: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="decisao">Decisão</Label>
                <Select 
                  value={parecerForm.decisao} 
                  onValueChange={(value) => setParecerForm(prev => ({ ...prev, decisao: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="reprovado">Reprovado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="satisfacao">Satisfação com o atendimento *</Label>
                <Select 
                  value={avaliacaoForm.satisfacao} 
                  onValueChange={(value) => setAvaliacaoForm(prev => ({ ...prev, satisfacao: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma avaliação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muito_satisfeito">Muito Satisfeito</SelectItem>
                    <SelectItem value="satisfeito">Satisfeito</SelectItem>
                    <SelectItem value="neutro">Neutro</SelectItem>
                    <SelectItem value="insatisfeito">Insatisfeito</SelectItem>
                    <SelectItem value="muito_insatisfeito">Muito Insatisfeito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comentario">Comentário (opcional)</Label>
                <Textarea
                  id="comentario"
                  placeholder="Deixe seu comentário sobre o atendimento..."
                  value={avaliacaoForm.comentario}
                  onChange={(e) => setAvaliacaoForm(prev => ({ ...prev, comentario: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setFinalizarDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFinalizar}>
              Finalizar Protocolo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
