import { useState } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Printer,
  Users,
  Clock,
  Volume2,
  ChevronRight,
  RefreshCw,
  Plus,
  Settings,
  MessageSquare,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const tiposAtendimento = [
  { id: "iluminacao_publica", label: "Iluminação Pública", prefixo: "I", cor: "bg-amber-500", secretaria: "Secretaria de Obras" },
  { id: "limpeza_urbana", label: "Limpeza Urbana", prefixo: "L", cor: "bg-emerald-500", secretaria: "Secretaria de Meio Ambiente" },
  { id: "buracos_vias", label: "Buracos e Vias", prefixo: "B", cor: "bg-orange-500", secretaria: "Secretaria de Obras" },
  { id: "poda_arvores", label: "Poda de Árvores", prefixo: "P", cor: "bg-green-600", secretaria: "Secretaria de Meio Ambiente" },
  { id: "fiscalizacao_urbana", label: "Fiscalização Urbana", prefixo: "F", cor: "bg-red-500", secretaria: "Secretaria de Obras" },
  { id: "certidao", label: "Certidões", prefixo: "C", cor: "bg-blue-500", secretaria: "Secretaria de Fazenda" },
  { id: "alvara", label: "Alvarás", prefixo: "A", cor: "bg-indigo-500", secretaria: "Secretaria de Fazenda" },
  { id: "processo_seletivo", label: "Processos Seletivos", prefixo: "S", cor: "bg-purple-500", secretaria: "Administração Geral" },
  { id: "denuncia", label: "Denúncias", prefixo: "D", cor: "bg-red-600", secretaria: "Administração Geral" },
  { id: "ouvidoria", label: "Ouvidoria", prefixo: "O", cor: "bg-cyan-500", secretaria: "Administração Geral" },
  { id: "comunicacao", label: "Comunicação", prefixo: "M", cor: "bg-teal-500", secretaria: "Administração Geral" },
  { id: "outros", label: "Outros Serviços", prefixo: "X", cor: "bg-gray-500", secretaria: "A Definir" },
];

const secretariasDisponiveis = [
  "Secretaria de Obras",
  "Secretaria de Meio Ambiente", 
  "Secretaria de Fazenda",
  "Administração Geral",
  "Secretaria de Saúde",
  "Secretaria de Educação",
  "Secretaria de Assistência Social"
];

const mockSenhas = [
  { numero: "I001", tipo: "iluminacao_publica", status: "aguardando", guiche: null, horario: "08:15", secretaria: "Secretaria de Obras", preferencial: false },
  { numero: "C002", tipo: "certidao", status: "em_atendimento", guiche: 1, horario: "08:20", secretaria: "Secretaria de Fazenda", preferencial: true },
  { numero: "B003", tipo: "buracos_vias", status: "aguardando", guiche: null, horario: "08:25", secretaria: "Secretaria de Obras", preferencial: false },
  { numero: "L004", tipo: "limpeza_urbana", status: "aguardando", guiche: null, horario: "08:30", secretaria: "Secretaria de Meio Ambiente", preferencial: false },
];

const mockGuiches = [
  { id: 1, atendente: "Maria Santos", status: "ocupado", senhaAtual: "C002" },
  { id: 2, atendente: "João Silva", status: "livre", senhaAtual: null },
  { id: 3, atendente: "Ana Costa", status: "livre", senhaAtual: null },
];

export default function Recepcao() {
  const [senhas, setSenhas] = useState(mockSenhas);
  const [guiches, setGuiches] = useState(mockGuiches);
  const [novaSenhaDialogOpen, setNovaSenhaDialogOpen] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [nomeCidadao, setNomeCidadao] = useState("");
  const [cpfCidadao, setCpfCidadao] = useState("");
  const [isPreferencial, setIsPreferencial] = useState(false);
  const [secretariaSelecionada, setSecretariaSelecionada] = useState("");
  const [comunicacaoDialogOpen, setComunicacaoDialogOpen] = useState(false);
  const [mensagemComunicacao, setMensagemComunicacao] = useState("");
  const [senhaComunicacao, setSenhaComunicacao] = useState("");

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cleaned;
  };

  const stats = {
    aguardando: senhas.filter((s) => s.status === "aguardando").length,
    emAtendimento: senhas.filter((s) => s.status === "em_atendimento").length,
    atendidos: 15,
    tempoMedio: "12 min",
  };

  const handleGerarSenha = () => {
    const tipo = tiposAtendimento.find((t) => t.id === tipoSelecionado);
    if (!tipo) return;

    const novoNumero = `${tipo.prefixo}${String(senhas.length + 1).padStart(3, "0")}`;
    
    let secretariaFinal = tipo.secretaria;
    if (tipoSelecionado === "outros" && secretariaSelecionada) {
      secretariaFinal = secretariaSelecionada;
    }
    
    const novaSenha = {
      numero: novoNumero,
      tipo: tipoSelecionado,
      status: "aguardando" as const,
      guiche: null,
      horario: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      secretaria: secretariaFinal,
      preferencial: isPreferencial,
    };

    setSenhas((prev) => [...prev, novaSenha]);
    
    toast({
      title: `Senha ${novoNumero} gerada!`,
      description: "A senha está sendo impressa.",
    });

    // Simular impressão
    handlePrintSenha(novoNumero, tipo.label, secretariaFinal, isPreferencial);

    setNovaSenhaDialogOpen(false);
    setTipoSelecionado("");
    setNomeCidadao("");
    setCpfCidadao("");
    setIsPreferencial(false);
    setSecretariaSelecionada("");
  };

  const handlePrintSenha = (numero: string, tipo: string, secretaria: string, preferencial: boolean) => {
    const printContent = `
      <html>
        <head>
          <title>Senha de Atendimento</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .numero { font-size: 72px; font-weight: bold; margin: 20px 0; }
            .tipo { font-size: 24px; color: #666; }
            .secretaria { font-size: 18px; color: #444; margin: 10px 0; }
            .preferencial { font-size: 20px; color: #d97706; font-weight: bold; margin: 10px 0; }
            .data { font-size: 14px; color: #999; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>Prefeitura Municipal</h2>
          <p class="tipo">${tipo}</p>
          <p class="secretaria">${secretaria}</p>
          ${preferencial ? '<p class="preferencial">SENHA PREFERENCIAL</p>' : ''}
          <p class="numero">${numero}</p>
          <p class="data">${new Date().toLocaleString("pt-BR")}</p>
          <p>Aguarde ser chamado</p>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleChamarProxima = (guicheId: number) => {
    const proximaSenha = senhas.find((s) => s.status === "aguardando");
    if (!proximaSenha) {
      toast({
        title: "Nenhuma senha na fila",
        description: "Não há cidadãos aguardando atendimento.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Chamando ${proximaSenha.numero}`,
      description: `Guichê ${guicheId}`,
    });

    // Atualizar estados
    setSenhas((prev) =>
      prev.map((s) =>
        s.numero === proximaSenha.numero
          ? { ...s, status: "em_atendimento", guiche: guicheId }
          : s
      )
    );
    setGuiches((prev) =>
      prev.map((g) =>
        g.id === guicheId
          ? { ...g, status: "ocupado", senhaAtual: proximaSenha.numero }
          : g
      )
    );
  };

  const handleFinalizarAtendimento = (guicheId: number) => {
    const guiche = guiches.find((g) => g.id === guicheId);
    if (!guiche?.senhaAtual) return;

    const senhaAtual = senhas.find((s) => s.numero === guiche.senhaAtual);
    if (!senhaAtual) return;

    // Se for comunicação, abrir modal de comunicação
    if (senhaAtual.tipo === "comunicacao") {
      setSenhaComunicacao(senhaAtual.numero);
      setComunicacaoDialogOpen(true);
      return;
    }

    toast({
      title: "Atendimento finalizado",
      description: `Senha ${guiche.senhaAtual} foi finalizada.`,
    });

    setSenhas((prev) =>
      prev.map((s) =>
        s.numero === guiche.senhaAtual ? { ...s, status: "finalizado" } : s
      )
    );
    setGuiches((prev) =>
      prev.map((g) =>
        g.id === guicheId ? { ...g, status: "livre", senhaAtual: null } : g
      )
    );
  };

  const handleEnviarComunicacao = () => {
    if (!mensagemComunicacao.trim()) {
      toast({
        title: "Mensagem obrigatória",
        description: "Digite uma mensagem para enviar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comunicação enviada",
      description: `Mensagem enviada para a senha ${senhaComunicacao}.`,
    });

    // Finalizar o atendimento após enviar comunicação
    setSenhas((prev) =>
      prev.map((s) =>
        s.numero === senhaComunicacao ? { ...s, status: "finalizado" } : s
      )
    );
    setGuiches((prev) =>
      prev.map((g) =>
        g.senhaAtual === senhaComunicacao ? { ...g, status: "livre", senhaAtual: null } : g
      )
    );

    // Limpar e fechar modal
    setComunicacaoDialogOpen(false);
    setMensagemComunicacao("");
    setSenhaComunicacao("");
  };

  const handleChamarNovamente = (numeroSenha: string) => {
    const senha = senhas.find((s) => s.numero === numeroSenha);
    if (!senha) return;

    // Encontrar guichê livre
    const guicheLivre = guiches.find((g) => g.status === "livre");
    if (!guicheLivre) {
      toast({
        title: "Nenhum guichê disponível",
        description: "Todos os guichês estão ocupados.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Chamando novamente ${numeroSenha}`,
      description: `Guichê ${guicheLivre.id}`,
    });

    // Atualizar senha para em atendimento
    setSenhas((prev) =>
      prev.map((s) =>
        s.numero === numeroSenha
          ? { ...s, status: "em_atendimento", guiche: guicheLivre.id }
          : s
      )
    );

    // Atualizar guichê
    setGuiches((prev) =>
      prev.map((g) =>
        g.id === guicheLivre.id
          ? { ...g, status: "ocupado", senhaAtual: numeroSenha }
          : g
      )
    );
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">🎫 Recepção</h1>
              <p className="text-muted-foreground mt-1">
                Gerenciamento de senhas e atendimento presencial
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
              <Button className="gap-2" onClick={() => setNovaSenhaDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nova Senha
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.aguardando}</p>
                  <p className="text-xs text-muted-foreground">Aguardando</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Ticket className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.emAtendimento}</p>
                  <p className="text-xs text-muted-foreground">Em Atendimento</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.atendidos}</p>
                  <p className="text-xs text-muted-foreground">Atendidos Hoje</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.tempoMedio}</p>
                  <p className="text-xs text-muted-foreground">Tempo Médio</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Fila de Espera */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Fila de Espera
                  </span>
                  <Badge>{stats.aguardando}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {senhas
                  .filter((s) => s.status === "aguardando")
                  .map((senha, index) => {
                    const tipo = tiposAtendimento.find((t) => t.id === senha.tipo);
                    return (
                      <div
                        key={senha.numero}
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          index === 0 ? "bg-amber-50 border-amber-200" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg ${tipo?.cor} flex items-center justify-center text-white font-bold`}
                          >
                            {senha.numero.charAt(0)}
                          </div>
                          <div>
                            <p className="font-mono font-bold">{senha.numero}</p>
                            <p className="text-xs text-muted-foreground">
                              {senha.horario} • {senha.secretaria}
                            </p>
                            {senha.preferencial && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300">
                                Preferencial
                              </Badge>
                            )}
                          </div>
                        </div>
                        {index === 0 && (
                          <Badge className="bg-amber-500">Próximo</Badge>
                        )}
                      </div>
                    );
                  })}

                {senhas.filter((s) => s.status === "aguardando").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum cidadão aguardando
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Senhas Finalizadas */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ChevronRight className="h-5 w-5" />
                    Finalizadas
                  </span>
                  <Badge variant="outline">{senhas.filter((s) => s.status === "finalizado").length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {senhas
                  .filter((s) => s.status === "finalizado")
                  .slice(0, 5) // Mostrar apenas as últimas 5
                  .map((senha) => {
                    const tipo = tiposAtendimento.find((t) => t.id === senha.tipo);
                    return (
                      <div
                        key={senha.numero}
                        className="p-3 rounded-lg border border-green-200 bg-green-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-lg ${tipo?.cor} flex items-center justify-center text-white font-bold text-sm`}
                          >
                            {senha.numero.charAt(0)}
                          </div>
                          <div>
                            <p className="font-mono font-bold text-sm">{senha.numero}</p>
                            <p className="text-xs text-muted-foreground">
                              {senha.horario}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => handleChamarNovamente(senha.numero)}
                        >
                          Chamar
                        </Button>
                      </div>
                    );
                  })}

                {senhas.filter((s) => s.status === "finalizado").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma senha finalizada
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guichês */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Guichês de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {guiches.map((guiche) => (
                    <Card
                      key={guiche.id}
                      className={`p-4 ${
                        guiche.status === "ocupado"
                          ? "border-blue-300 bg-blue-50"
                          : "border-green-300 bg-green-50"
                      }`}
                    >
                      <div className="text-center mb-4">
                        <p className="text-3xl font-bold text-foreground">
                          Guichê {guiche.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {guiche.atendente}
                        </p>
                      </div>

                      {guiche.senhaAtual ? (
                        <div className="text-center mb-4">
                          <Badge className="text-lg px-4 py-2">
                            {guiche.senhaAtual}
                          </Badge>
                        </div>
                      ) : (
                        <div className="text-center mb-4">
                          <Badge variant="outline" className="text-lg px-4 py-2">
                            Livre
                          </Badge>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {guiche.status === "livre" ? (
                          <Button
                            className="w-full gap-1"
                            onClick={() => handleChamarProxima(guiche.id)}
                          >
                            <Volume2 className="h-4 w-4" />
                            Chamar
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full gap-1"
                            onClick={() => handleFinalizarAtendimento(guiche.id)}
                          >
                            <ChevronRight className="h-4 w-4" />
                            Finalizar
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            {tiposAtendimento.map((tipo) => (
              <Button
                key={tipo.id}
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => {
                  setTipoSelecionado(tipo.id);
                  setNovaSenhaDialogOpen(true);
                }}
              >
                <div className={`h-8 w-8 rounded-lg ${tipo.cor} flex items-center justify-center text-white font-bold`}>
                  {tipo.prefixo}
                </div>
                <span>{tipo.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Nova Senha Dialog */}
      <Dialog open={novaSenhaDialogOpen} onOpenChange={setNovaSenhaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Senha</DialogTitle>
            <DialogDescription>
              Gere uma senha de atendimento para o cidadão
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Atendimento *</Label>
              <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAtendimento.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      <span className="flex items-center gap-2">
                        <span className={`h-4 w-4 rounded ${tipo.cor}`}></span>
                        {tipo.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {tipoSelecionado === "outros" && (
              <div className="space-y-2">
                <Label>Secretaria Responsável *</Label>
                <Select value={secretariaSelecionada} onValueChange={setSecretariaSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a secretaria" />
                  </SelectTrigger>
                  <SelectContent>
                    {secretariasDisponiveis.map((secretaria) => (
                      <SelectItem key={secretaria} value={secretaria}>
                        {secretaria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="senha-nome">Nome do Cidadão (opcional)</Label>
              <Input
                id="senha-nome"
                value={nomeCidadao}
                onChange={(e) => setNomeCidadao(e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha-cpf">CPF (opcional)</Label>
              <Input
                id="senha-cpf"
                value={cpfCidadao}
                onChange={(e) => setCpfCidadao(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="preferencial"
                checked={isPreferencial}
                onCheckedChange={(checked) => setIsPreferencial(checked as boolean)}
              />
              <Label htmlFor="preferencial" className="text-sm">
                Senha Preferencial
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNovaSenhaDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGerarSenha} disabled={!tipoSelecionado || (tipoSelecionado === "outros" && !secretariaSelecionada)} className="gap-2">
              <Printer className="h-4 w-4" />
              Gerar e Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comunicação Dialog */}
      <Dialog open={comunicacaoDialogOpen} onOpenChange={setComunicacaoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Enviar Comunicação
            </DialogTitle>
            <DialogDescription>
              Envie uma mensagem para o cidadão da senha {senhaComunicacao}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem *</Label>
              <Textarea
                id="mensagem"
                value={mensagemComunicacao}
                onChange={(e) => setMensagemComunicacao(e.target.value)}
                placeholder="Digite a mensagem que será enviada ao cidadão..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComunicacaoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEnviarComunicacao} disabled={!mensagemComunicacao.trim()} className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Enviar Comunicação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
