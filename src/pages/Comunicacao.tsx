import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  User,
  Building2,
  Clock,
  CheckCircle,
  Paperclip,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock data for messages
const mockMessages = [
  {
    id: "1",
    sender: "João Silva",
    senderType: "cidadao",
    message: "Olá, gostaria de saber sobre o IPTU do meu imóvel na Rua das Flores, número 123.",
    timestamp: "2025-01-18T19:20:00",
    read: true,
  },
  {
    id: "2",
    sender: "Secretaria da Fazenda",
    senderType: "secretaria",
    message: "Olá João! Podemos ajudar com informações sobre o IPTU. Qual é o número da inscrição imobiliária do seu imóvel?",
    timestamp: "2025-01-18T19:30:00",
    read: true,
  },
  {
    id: "3",
    sender: "João Silva",
    senderType: "cidadao",
    message: "O número da inscrição é 123456-78. Preciso do valor atual e como parcelar.",
    timestamp: "2025-01-18T19:45:00",
    read: true,
  },
  {
    id: "4",
    sender: "Carlos Oliveira",
    senderType: "secretaria",
    message: "Obrigado pelas informações. O valor do IPTU para este imóvel é R$ 450,00. Você pode parcelar em até 10 vezes sem juros.",
    timestamp: "2025-01-18T20:00:00",
    read: false,
  },
];

const mockProtocolo = {
  id: "1",
  numero: "ITJ-2026-43198",
  tipo_servico: "Consulta de IPTU",
  secretaria: "Fazenda",
  status: "novo",
  descricao: "Solicitação de informações sobre IPTU",
  created_date: "2025-01-18T19:17:00",
};

export default function Comunicacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [protocol, setProtocol] = useState(mockProtocolo);
  const [finalizarDialogOpen, setFinalizarDialogOpen] = useState(false);
  const [parecerForm, setParecerForm] = useState({
    parecer: "",
    decisao: "aprovado"
  });
  const [finalizacaoForm, setFinalizacaoForm] = useState({
    decisao: "",
    comentario: ""
  });

  const handleFinalizar = () => {
    if (user?.role === 'gestor') {
      // Gestor precisa fornecer parecer
      if (!parecerForm.parecer.trim()) {
        alert("Por favor, forneça um parecer antes de finalizar.");
        return;
      }
    } else if (user?.role === 'cidadao') {
      // Cidadão precisa fornecer parecer final (resolvido/não resolvido/finalizado)
      if (!finalizacaoForm.decisao) {
        alert("Por favor, selecione o parecer final antes de finalizar.");
        return;
      }
    }
    
    // Atualizar status do protocolo
    setProtocol(prev => ({
      ...prev,
      status: 'finalizado',
      dataFinalizacao: new Date().toISOString()
    }));
    
    setFinalizarDialogOpen(false);
    
    // Resetar formulários
    setParecerForm({ parecer: "", decisao: "aprovado" });
    setFinalizacaoForm({ decisao: "", comentario: "" });
    
    alert("Protocolo finalizado com sucesso!");
  };

  const handleMarcarComoLido = () => {
    // Lógica para marcar como lido
    alert("Mensagem marcada como lida!");
  };

  // Verificar se é comunicação com cidadão ou secretaria
  const urlParams = new URLSearchParams(window.location.search);
  const tipo = urlParams.get('tipo') || 'secretaria'; // 'cidadao' ou 'secretaria'

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    // Mock: simulate sending message
    setTimeout(() => {
      const newMsg = {
        id: (messages.length + 1).toString(),
        sender: tipo === 'cidadao' ? 'Secretaria' : 'Você',
        senderType: tipo === 'cidadao' ? 'secretaria' : 'cidadao',
        message: newMessage,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      setIsSending(false);
    }, 1000);
  };

  const handleMarkAsRead = () => {
    setMessages(prev => prev.map(msg => ({...msg, read: true})));
  };

  const handleCloseProtocol = () => {
    setProtocol(prev => ({...prev, status: 'fechado'}));
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                💬 {tipo === 'cidadao' ? 'Comunicação com Solicitante' : 'Comunicação do Protocolo'}
              </h1>
              <p className="text-muted-foreground">
                Protocolo {protocol.numero}
              </p>
            </div>
          </div>

          {/* Protocol Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Informações do Protocolo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número</p>
                  <p className="font-semibold">{mockProtocolo.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Serviço</p>
                  <p className="font-semibold">{mockProtocolo.tipo_servico}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Secretaria</p>
                  <p className="font-semibold">{mockProtocolo.secretaria}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`gov-badge-${protocol.status === 'fechado' ? 'success' : 'progress'}`}>
                    {protocol.status === 'em_atendimento' ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                    {protocol.status === 'em_atendimento' ? 'Em Atendimento' : 'Fechado'}
                  </Badge>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="text-sm">{protocol.descricao}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleMarcarComoLido} variant="outline" size="sm">
                  Marcar como Lido
                </Button>
                <Button onClick={() => setFinalizarDialogOpen(true)} variant="outline" size="sm" disabled={protocol.status === 'finalizado'}>
                  Finalizar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.senderType === "cidadao" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.senderType === "secretaria" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.senderType === "cidadao"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.senderType === "cidadao" ? (
                            <>
                              <User className="h-3 w-3 inline mr-1" />
                              Você
                            </>
                          ) : (
                            <>
                              <Building2 className="h-3 w-3 inline mr-1" />
                              {message.sender}
                            </>
                          )}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.read && message.senderType === "secretaria" && (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    {message.senderType === "cidadao" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Send Message */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Enviar Mensagem {tipo === 'cidadao' ? 'para o Solicitante' : 'para a Secretaria'}
                  </label>
                  <Textarea
                    placeholder={`Digite sua mensagem ${tipo === 'cidadao' ? 'para o solicitante' : 'para a secretaria responsável'}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Paperclip className="h-4 w-4" />
                    Anexar Arquivo
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSending ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Finalizar Protocolo Dialog */}
      <Dialog open={finalizarDialogOpen} onOpenChange={setFinalizarDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Finalizar Protocolo</DialogTitle>
            <DialogDescription>
              {user?.role === 'gestor' 
                ? 'Forneça seu parecer sobre este protocolo antes de finalizar.'
                : 'Forneça o parecer final sobre o atendimento antes de finalizar o protocolo.'
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
                <Label htmlFor="decisao_final">Parecer Final *</Label>
                <Select 
                  value={finalizacaoForm.decisao} 
                  onValueChange={(value) => setFinalizacaoForm(prev => ({ ...prev, decisao: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o parecer final" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resolvido">Resolvido</SelectItem>
                    <SelectItem value="nao_resolvido">Não Resolvido</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comentario">Comentário (opcional)</Label>
                <Textarea
                  id="comentario"
                  placeholder="Deixe seu comentário sobre o atendimento..."
                  value={finalizacaoForm.comentario}
                  onChange={(e) => setFinalizacaoForm(prev => ({ ...prev, comentario: e.target.value }))}
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