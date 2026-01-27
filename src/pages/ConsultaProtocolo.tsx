import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Clock,
  User,
  MapPin,
  Building2,
  Printer,
  Download,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockProtocolo = {
  numero: "ITJ-2025-00123",
  tipo_servico: "Iluminação Pública",
  secretaria: "Secretaria de Obras",
  status: "em_atendimento",
  prioridade: "alta",
  descricao:
    "Poste apagado na esquina da Rua das Flores com Avenida Principal. O problema persiste há mais de uma semana, causando insegurança para os moradores da região.",
  endereco: "Rua das Flores, 123 - Centro",
  nome_cidadao: "João Silva",
  email_cidadao: "joao.silva@email.com",
  telefone_cidadao: "(35) 99999-1234",
  created_date: "2025-01-10T10:30:00",
  servidor_responsavel: "Maria Santos",
  is_anonimo: false,
  anexos: ["foto_poste.jpg", "localizacao.pdf"],
  historico: [
    {
      data: "2025-01-10T10:30:00",
      acao: "Protocolo aberto pelo cidadão",
      responsavel: "João Silva",
      tipo: "cidadao",
    },
    {
      data: "2025-01-11T08:15:00",
      acao: "Protocolo assumido para atendimento",
      responsavel: "Maria Santos",
      tipo: "servidor",
    },
    {
      data: "2025-01-12T14:00:00",
      acao: "Solicitação de documentos adicionais",
      responsavel: "Maria Santos",
      tipo: "servidor",
    },
    {
      data: "2025-01-13T09:30:00",
      acao: "Documentos enviados pelo cidadão",
      responsavel: "João Silva",
      tipo: "cidadao",
    },
  ],
};

const statusConfig = {
  aberto: { label: "Aberto", class: "gov-badge-open", icon: Clock },
  em_atendimento: { label: "Em Atendimento", class: "gov-badge-progress", icon: MessageSquare },
  aguardando_documentos: { label: "Aguardando Documentos", class: "gov-badge-progress", icon: AlertCircle },
  documentos_enviados: { label: "Documentos Enviados", class: "gov-badge-open", icon: FileText },
  concluido: { label: "Concluído", class: "gov-badge-complete", icon: CheckCircle },
  cancelado: { label: "Cancelado", class: "gov-badge-cancelled", icon: XCircle },
};

const prioridadeConfig = {
  baixa: { label: "Baixa", class: "bg-gray-100 text-gray-700" },
  media: { label: "Média", class: "bg-blue-100 text-blue-700" },
  alta: { label: "Alta", class: "bg-orange-100 text-orange-700" },
  urgente: { label: "Urgente", class: "bg-red-100 text-red-700" },
};

export default function ConsultaProtocolo() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("numero") || "");
  const [protocolo, setProtocolo] = useState<typeof mockProtocolo | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-search when numero parameter is present
  useEffect(() => {
    const numero = searchParams.get("numero");
    if (numero && !protocolo) {
      performSearch(numero);
    }
  }, [searchParams, protocolo]);

  const performSearch = async (numero: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setProtocolo(mockProtocolo);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setProtocolo(mockProtocolo);
    setLoading(false);
  };

  const handlePrintProtocolo = () => {
    if (!protocolo) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
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
            <div class="section"><div><span class="label">Status:</span> ${status?.label}</div></div>
            <div class="section"><div><span class="label">Prioridade:</span> ${prioridade?.label}</div></div>
            <div class="section"><div><span class="label">Data de Abertura:</span> ${new Date(protocolo.created_date).toLocaleDateString('pt-BR')}</div></div>
            ${protocolo.endereco ? `<div class="section"><div><span class="label">Endereço:</span> ${protocolo.endereco}</div></div>` : ''}
            <div class="section"><div style="margin-top:4px"><span class="label">Descrição:</span><div style="margin-left:130px; margin-top:4px">${protocolo.descricao}</div></div></div>
            
            ${!protocolo.is_anonimo ? `
            <div class="section"><div><span class="label">Solicitante:</span> ${protocolo.nome_cidadao}</div></div>
            <div class="section"><div><span class="label">E-mail:</span> ${protocolo.email_cidadao}</div></div>
            <div class="section"><div><span class="label">Telefone:</span> ${protocolo.telefone_cidadao}</div></div>
            ` : '<div class="section"><div><span class="label">Tipo:</span> Solicitação Anônima</div></div>'}
            
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

            <div style="margin-top:15px; font-size:10px; color:#666; text-align:center">Documento gerado em ${new Date().toLocaleString('pt-BR')}</div>
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
            <div class="section"><div><span class="label">Status:</span> ${status?.label}</div></div>
            <div class="section"><div><span class="label">Prioridade:</span> ${prioridade?.label}</div></div>
            <div class="section"><div><span class="label">Data de Abertura:</span> ${new Date(protocolo.created_date).toLocaleDateString('pt-BR')}</div></div>
            ${protocolo.endereco ? `<div class="section"><div><span class="label">Endereço:</span> ${protocolo.endereco}</div></div>` : ''}
            <div class="section"><div style="margin-top:4px"><span class="label">Descrição:</span><div style="margin-left:130px; margin-top:4px">${protocolo.descricao}</div></div></div>
            
            ${!protocolo.is_anonimo ? `
            <div class="section"><div><span class="label">Solicitante:</span> ${protocolo.nome_cidadao}</div></div>
            <div class="section"><div><span class="label">E-mail:</span> ${protocolo.email_cidadao}</div></div>
            <div class="section"><div><span class="label">Telefone:</span> ${protocolo.telefone_cidadao}</div></div>
            ` : '<div class="section"><div><span class="label">Tipo:</span> Solicitação Anônima</div></div>'}
            
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

            <div style="margin-top:15px; font-size:10px; color:#666; text-align:center">Documento gerado em ${new Date().toLocaleString('pt-BR')}</div>
          </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const status = protocolo ? statusConfig[protocolo.status as keyof typeof statusConfig] : null;
  const prioridade = protocolo ? prioridadeConfig[protocolo.prioridade as keyof typeof prioridadeConfig] : null;

  return (
    <Layout>
      <div className="gov-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              🔍 Consultar Protocolo
            </h1>
            <p className="text-muted-foreground">
              Digite o número do protocolo para consultar o status
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Ex: ITJ-2025-00123"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 font-mono"
                  />
                </div>
                <Button type="submit" size="lg" disabled={loading}>
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {protocolo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="gov-protocol-number text-2xl">
                          {protocolo.numero}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {protocolo.tipo_servico}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {status && (
                        <Badge className={status.class}>
                          <status.icon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      )}
                      {prioridade && (
                        <Badge className={prioridade.class}>
                          {prioridade.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <Tabs defaultValue="detalhes" className="w-full">
                  <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="detalhes"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Detalhes
                    </TabsTrigger>
                    <TabsTrigger
                      value="historico"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Histórico
                    </TabsTrigger>
                    <TabsTrigger
                      value="anexos"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Anexos
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="detalhes" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Secretaria
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="font-medium">{protocolo.secretaria}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Endereço/Local
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{protocolo.endereco}</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Data de Abertura
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>
                              {new Date(protocolo.created_date).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {!protocolo.is_anonimo && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Cidadão
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <User className="h-4 w-4 text-primary" />
                              <span>{protocolo.nome_cidadao}</span>
                            </div>
                          </div>
                        )}

                        {protocolo.servidor_responsavel && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Servidor Responsável
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <User className="h-4 w-4 text-accent" />
                              <span>{protocolo.servidor_responsavel}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Descrição
                        </label>
                        <p className="mt-1 text-foreground leading-relaxed">
                          {protocolo.descricao}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="historico" className="p-6">
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                      <div className="space-y-6">
                        {protocolo.historico.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-10"
                          >
                            <div
                              className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                                item.tipo === "servidor"
                                  ? "bg-accent border-accent"
                                  : "bg-primary border-primary"
                              }`}
                            />
                            <div className="bg-muted/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-foreground">
                                  {item.acao}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(item.data).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Por: {item.responsavel}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="anexos" className="p-6">
                    {protocolo.anexos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {protocolo.anexos.map((anexo, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <span className="font-medium">{anexo}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum anexo disponível
                      </p>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Actions */}
                <div className="border-t p-6 flex justify-end">
                  <Button variant="outline" className="gap-2" onClick={handlePrintProtocolo}>
                    <Printer className="h-4 w-4" />
                    Imprimir Protocolo
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {!protocolo && !loading && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Consulte seu protocolo
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Digite o número do protocolo no campo acima para visualizar os
                detalhes e acompanhar o status da sua solicitação.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}