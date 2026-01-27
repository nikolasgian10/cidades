import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  X,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Mail,
  Share2,
  Search,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const services = [
  { id: "iluminacao_publica", title: "Iluminação Pública", icon: Lightbulb, color: "bg-amber-500", prioridade: "media" },
  { id: "limpeza_urbana", title: "Limpeza Urbana", icon: Trash2, color: "bg-emerald-500", prioridade: "media" },
  { id: "buracos_vias", title: "Buracos e Vias", icon: Construction, color: "bg-orange-500", prioridade: "alta" },
  { id: "poda_arvores", title: "Poda de Árvores", icon: TreePine, color: "bg-green-600", prioridade: "baixa" },
  { id: "fiscalizacao_urbana", title: "Fiscalização Urbana", icon: Building, color: "bg-red-500", prioridade: "media" },
  { id: "certidao", title: "Certidões", icon: FileCheck, color: "bg-blue-500", prioridade: "baixa" },
  { id: "alvara", title: "Alvarás", icon: ClipboardList, color: "bg-indigo-500", prioridade: "media" },
  { id: "processo_seletivo", title: "Processos Seletivos", icon: Users, color: "bg-purple-500", prioridade: "media" },
  { id: "denuncia", title: "Denúncias", icon: Megaphone, color: "bg-red-600", prioridade: "alta" },
  { id: "ouvidoria", title: "Ouvidoria", icon: MessageSquare, color: "bg-cyan-500", prioridade: "media" },
  { id: "outros", title: "Outros Serviços", icon: FileText, color: "bg-gray-500", prioridade: "baixa" },
];

export default function NovoProtocolo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTipo = searchParams.get("tipo") || "";

  const [step, setStep] = useState(1);
  const [serviceSearch, setServiceSearch] = useState("");
  const [formData, setFormData] = useState({
    tipo_servico: initialTipo,
    descricao: "",
    endereco: "",
    anexos: [] as File[],
    tipo_pessoa: "fisica" as "fisica" | "juridica",
    nome: "",
    cpf_cnpj: "",
    email: "",
    telefone: "",
    is_anonimo: false,
    vaga_processo_seletivo: "", // Novo campo para vaga do processo seletivo
  });
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useState<HTMLVideoElement | null>(null);
  const canvasRef = useState<HTMLCanvasElement | null>(null);
  const [protocoloNumero, setProtocoloNumero] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedService = services.find((s) => s.id === formData.tipo_servico);
  const progress = (step / 4) * 100;

  // Filter services by search
  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 5 - formData.anexos.length);
      setFormData((prev) => ({
        ...prev,
        anexos: [...prev.anexos, ...newFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index),
    }));
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraOpen(true);
    } catch (error) {
      toast({
        title: "Erro na câmera",
        description: "Não foi possível acessar a câmera do dispositivo.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef[0] && canvasRef[0]) {
      const canvas = canvasRef[0];
      const video = videoRef[0];
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setFormData((prev) => ({
              ...prev,
              anexos: [...prev.anexos, file],
            }));
          }
        });
        
        closeCamera();
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraOpen(false);
  };

  const handlePrintProtocoloRevisao = () => {
    const protocoloData = {
      numero: protocoloNumero || "Pré-visualização",
      tipo_servico: selectedService?.title || formData.tipo_servico,
      secretaria: "Secretaria Municipal",
      status: "Em Revisão",
      prioridade: "Média",
      descricao: formData.descricao,
      endereco: formData.endereco,
      nome_cidadao: formData.is_anonimo ? "Solicitação Anônima" : formData.nome,
      email_cidadao: formData.email,
      telefone_cidadao: formData.telefone,
      created_date: new Date().toISOString(),
      data_conclusao: null,
    };

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Protocolo ${protocoloData.numero}</title>
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
                <div class="protocol-number">Protocolo: ${protocoloData.numero}</div>
              </div>
              <div class="section"><div><span class="label">Tipo de Serviço:</span> ${protocoloData.tipo_servico}</div></div>
              <div class="section"><div><span class="label">Secretaria:</span> ${protocoloData.secretaria}</div></div>
              <div class="section"><div><span class="label">Status:</span> ${protocoloData.status}</div></div>
              <div class="section"><div><span class="label">Prioridade:</span> ${protocoloData.prioridade}</div></div>
              <div class="section"><div><span class="label">Data de Abertura:</span> ${new Date(protocoloData.created_date).toLocaleDateString('pt-BR')}</div></div>
              ${protocoloData.endereco ? `<div class="section"><div><span class="label">Endereço:</span> ${protocoloData.endereco}</div></div>` : ''}
              <div class="section"><div style="margin-top:3px"><span class="label">Descrição:</span><div style="margin-left:115px; margin-top:3px">${protocoloData.descricao}</div></div></div>
              ${!formData.is_anonimo ? `
              <div class="section"><div><span class="label">Solicitante:</span> ${protocoloData.nome_cidadao}</div></div>
              <div class="section"><div><span class="label">E-mail:</span> ${protocoloData.email_cidadao}</div></div>
              <div class="section"><div><span class="label">Telefone:</span> ${protocoloData.telefone_cidadao}</div></div>
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
                <div class="protocol-number">Protocolo: ${protocoloData.numero}</div>
              </div>
              <div class="section"><div><span class="label">Tipo de Serviço:</span> ${protocoloData.tipo_servico}</div></div>
              <div class="section"><div><span class="label">Secretaria:</span> ${protocoloData.secretaria}</div></div>
              <div class="section"><div><span class="label">Status:</span> ${protocoloData.status}</div></div>
              <div class="section"><div><span class="label">Prioridade:</span> ${protocoloData.prioridade}</div></div>
              <div class="section"><div><span class="label">Data de Abertura:</span> ${new Date(protocoloData.created_date).toLocaleDateString('pt-BR')}</div></div>
              ${protocoloData.endereco ? `<div class="section"><div><span class="label">Endereço:</span> ${protocoloData.endereco}</div></div>` : ''}
              <div class="section"><div style="margin-top:3px"><span class="label">Descrição:</span><div style="margin-left:115px; margin-top:3px">${protocoloData.descricao}</div></div></div>
              ${!formData.is_anonimo ? `
              <div class="section"><div><span class="label">Solicitante:</span> ${protocoloData.nome_cidadao}</div></div>
              <div class="section"><div><span class="label">E-mail:</span> ${protocoloData.email_cidadao}</div></div>
              <div class="section"><div><span class="label">Telefone:</span> ${protocoloData.telefone_cidadao}</div></div>
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

  const handlePrint = () => {
    window.print();
    toast({
      title: "Imprimindo...",
      description: "O comprovante está sendo enviado para impressão.",
    });
  };

  const handleEmail = () => {
    toast({
      title: "Email enviado!",
      description: `O comprovante foi enviado para ${formData.email || "seu email cadastrado"}.`,
    });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `*Comprovante de Protocolo*\n\nNúmero: ${protocoloNumero}\nServiço: ${selectedService?.title || "N/A"}\nData: ${new Date().toLocaleDateString("pt-BR")}\n\nGuarde este número para acompanhar sua solicitação.`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const canProceedStep1 = formData.tipo_servico !== "";
  const canProceedStep2 = formData.descricao.length >= 10 && 
    (formData.tipo_servico !== "processo_seletivo" || formData.vaga_processo_seletivo !== "");
  const canProceedStep3 = formData.is_anonimo || (formData.nome && formData.cpf_cnpj && formData.email);

  const handleSubmit = () => {
    // Generate a unique protocol number
    const numero = `PROTO-${Date.now()}`;
    setProtocoloNumero(numero);
    setSubmitted(true);
    toast({
      title: "Protocolo enviado!",
      description: "Sua solicitação foi registrada com sucesso.",
    });
  };

  if (submitted) {
    return (
      <Layout>
        <div className="gov-container py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-status-complete/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-status-complete" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Protocolo Registrado!
            </h1>
            <p className="text-muted-foreground mb-6">
              Sua solicitação foi enviada com sucesso.
            </p>

            <Card className="mb-6 print:border-2 print:border-black">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Número do Protocolo
                </p>
                <p className="gov-protocol-number text-3xl">{protocoloNumero}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  Guarde este número para acompanhar sua solicitação
                </p>
                
                <div className="mt-6 pt-6 border-t text-left text-sm space-y-2 print:block hidden">
                  <p><strong>Serviço:</strong> {selectedService?.title}</p>
                  <p><strong>Data:</strong> {new Date().toLocaleDateString("pt-BR")}</p>
                  <p><strong>Hora:</strong> {new Date().toLocaleTimeString("pt-BR")}</p>
                  {!formData.is_anonimo && (
                    <>
                      <p><strong>Cidadão:</strong> {formData.nome}</p>
                      <p><strong>{formData.tipo_pessoa === "juridica" ? "CNPJ" : "CPF"}:</strong> {formData.cpf_cnpj}</p>
                    </>
                  )}
                  <div className="mt-8 pt-8 border-t grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="border-t border-black mt-16 pt-2">
                        Assinatura do Cidadão
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-black mt-16 pt-2">
                        Assinatura do Funcionário
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compartilhamento */}
            <Card className="mb-6 print:hidden">
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-3">Enviar Comprovante</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleEmail} className="gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleWhatsApp}
                    className="gap-2 text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Share2 className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
              <Button
                variant="outline"
                onClick={() => navigate(`/consulta-protocolo?numero=${protocoloNumero}`)}
              >
                Ver Protocolo
              </Button>
              <Button onClick={() => navigate("/meus-protocolos")}>
                Meus Protocolos
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      {/* Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Tirar Foto</h3>
            <div className="relative">
              <video
                ref={(el) => (videoRef[0] = el)}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-black rounded"
                onLoadedMetadata={() => {
                  if (videoRef[0] && stream) {
                    videoRef[0].srcObject = stream;
                  }
                }}
              />
              <canvas ref={(el) => (canvasRef[0] = el)} className="hidden" />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={capturePhoto} className="flex-1">
                📸 Capturar
              </Button>
              <Button variant="outline" onClick={closeCamera} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Layout>
        <div className="gov-container py-8">
          <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              📝 Novo Protocolo
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados para registrar sua solicitação
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Passo {step} de 4</span>
              <span className="text-sm text-muted-foreground">
                {step === 1 && "Tipo de Serviço"}
                {step === 2 && "Detalhes"}
                {step === 3 && "Seus Dados"}
                {step === 4 && "Revisão e Envio"}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps */}
          <Card>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Service Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-xl font-semibold mb-4">
                      Escolha o tipo de serviço
                    </h2>
                    
                    {/* Search Bar */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar tipo de serviço..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {filteredServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              tipo_servico: service.id,
                            }))
                          }
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            formData.tipo_servico === service.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg ${service.color} flex items-center justify-center mb-2`}>
                            <service.icon className="h-5 w-5 text-white" />
                          </div>
                          <p className="font-medium text-sm">{service.title}</p>
                        </button>
                      ))}
                    </div>

                    {filteredServices.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum serviço encontrado para "{serviceSearch}"
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label htmlFor="descricao">
                        Descrição da Solicitação *
                      </Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descreva detalhadamente sua solicitação (mínimo 10 caracteres)"
                        value={formData.descricao}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            descricao: e.target.value,
                          }))
                        }
                        className="mt-2 min-h-32"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.descricao.length}/10 caracteres mínimos
                      </p>
                    </div>

                    {/* Campo específico para Processo Seletivo */}
                    {formData.tipo_servico === "processo_seletivo" && (
                      <div>
                        <Label htmlFor="vaga-processo-seletivo">
                          Vaga Pretendida *
                        </Label>
                        <Select
                          value={formData.vaga_processo_seletivo}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              vaga_processo_seletivo: value,
                            }))
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Selecione a vaga pretendida" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="analista-administrativo">Analista Administrativo</SelectItem>
                            <SelectItem value="auxiliar-administrativo">Auxiliar Administrativo</SelectItem>
                            <SelectItem value="engenheiro-civil">Engenheiro Civil</SelectItem>
                            <SelectItem value="arquiteto">Arquiteto</SelectItem>
                            <SelectItem value="tecnico-informatica">Técnico em Informática</SelectItem>
                            <SelectItem value="assistente-social">Assistente Social</SelectItem>
                            <SelectItem value="professor">Professor</SelectItem>
                            <SelectItem value="medico">Médico</SelectItem>
                            <SelectItem value="enfermeiro">Enfermeiro</SelectItem>
                            <SelectItem value="motorista">Motorista</SelectItem>
                            <SelectItem value="vigia">Vigia</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="endereco">Endereço/Local (opcional)</Label>
                      <Input
                        id="endereco"
                        placeholder="Ex: Rua das Flores, 123 - Centro"
                        value={formData.endereco}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endereco: e.target.value,
                          }))
                        }
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Anexos (opcional)</Label>
                      <div className="mt-2 space-y-3">
                        <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Clique para anexar arquivos (máx. 5)
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={formData.anexos.length >= 5}
                          />
                        </label>
                        
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={openCamera}
                            disabled={formData.anexos.length >= 5}
                            className="flex-1 gap-2"
                          >
                            📷 Tirar Foto
                          </Button>
                        </div>
                      </div>
                      {formData.anexos.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {formData.anexos.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted rounded-lg"
                            >
                              <span className="text-sm truncate">
                                {file.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Personal Data */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {formData.tipo_servico === "denuncia" && (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">
                            Denúncia Anônima Disponível
                          </p>
                          <p className="text-sm text-amber-700 mt-1">
                            Você pode fazer esta denúncia de forma anônima. Seus
                            dados não serão registrados.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tipo de Pessoa */}
                    <div>
                      <Label className="text-base font-semibold">Tipo de Pessoa</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tipo_pessoa"
                            value="fisica"
                            checked={formData.tipo_pessoa === "fisica"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                tipo_pessoa: e.target.value as "fisica" | "juridica",
                                cpf_cnpj: "", // Reset CPF/CNPJ when changing type
                              }))
                            }
                            className="text-primary"
                          />
                          <span className="text-sm">Pessoa Física</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="tipo_pessoa"
                            value="juridica"
                            checked={formData.tipo_pessoa === "juridica"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                tipo_pessoa: e.target.value as "fisica" | "juridica",
                                cpf_cnpj: "", // Reset CPF/CNPJ when changing type
                              }))
                            }
                            className="text-primary"
                          />
                          <span className="text-sm">Pessoa Jurídica</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonimo"
                        checked={formData.is_anonimo}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            is_anonimo: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="anonimo"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Fazer protocolo de forma anônima
                      </label>
                    </div>

                    {!formData.is_anonimo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nome">
                              {formData.tipo_pessoa === "juridica" ? "Razão Social" : "Nome Completo"} *
                            </Label>
                            <Input
                              id="nome"
                              placeholder={formData.tipo_pessoa === "juridica" ? "Nome da empresa" : "Seu nome completo"}
                              value={formData.nome}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nome: e.target.value,
                                }))
                              }
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cpf_cnpj">
                              {formData.tipo_pessoa === "juridica" ? "CNPJ" : "CPF"} *
                            </Label>
                            <Input
                              id="cpf_cnpj"
                              placeholder={formData.tipo_pessoa === "juridica" ? "00.000.000/0000-00" : "000.000.000-00"}
                              value={formData.cpf_cnpj}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  cpf_cnpj: e.target.value,
                                }))
                              }
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">E-mail *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="seu@email.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                              id="telefone"
                              placeholder="(00) 00000-0000"
                              value={formData.telefone}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  telefone: e.target.value,
                                }))
                              }
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {formData.is_anonimo && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-muted rounded-lg text-center"
                      >
                        <Check className="h-8 w-8 mx-auto text-status-complete mb-2" />
                        <p className="font-medium">Protocolo Anônimo</p>
                        <p className="text-sm text-muted-foreground">
                          Seus dados pessoais não serão registrados
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Review and Submit */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-4">📋 Revisão do Protocolo</h3>
                      <p className="text-muted-foreground mb-6">
                        Verifique todas as informações antes de enviar. Você pode editar qualquer campo clicando em "Editar".
                      </p>
                    </div>

                    {/* Service Summary */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Tipo de Serviço</h4>
                            <p className="text-sm text-muted-foreground">{selectedService?.title}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Details Summary */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Detalhes da Solicitação</h4>
                          <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                            Editar
                          </Button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><strong>Descrição:</strong> {formData.descricao}</p>
                          {formData.endereco && <p><strong>Endereço:</strong> {formData.endereco}</p>}
                          {formData.anexos.length > 0 && (
                            <p><strong>Anexos:</strong> {formData.anexos.length} arquivo(s)</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Personal Data Summary */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Dados Pessoais</h4>
                          <Button variant="outline" size="sm" onClick={() => setStep(3)}>
                            Editar
                          </Button>
                        </div>
                        <div className="space-y-2 text-sm">
                          {formData.is_anonimo ? (
                            <p><strong>Tipo:</strong> Solicitação Anônima</p>
                          ) : (
                            <>
                              <p><strong>Tipo:</strong> {formData.tipo_pessoa === "juridica" ? "Pessoa Jurídica" : "Pessoa Física"}</p>
                              <p><strong>{formData.tipo_pessoa === "juridica" ? "Razão Social" : "Nome"}:</strong> {formData.nome}</p>
                              <p><strong>{formData.tipo_pessoa === "juridica" ? "CNPJ" : "CPF"}:</strong> {formData.cpf_cnpj}</p>
                              <p><strong>E-mail:</strong> {formData.email}</p>
                              <p><strong>Telefone:</strong> {formData.telefone}</p>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Print Preview */}
                    <Card className="border-dashed">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Imprimir Protocolo</h4>
                            <p className="text-sm text-muted-foreground">
                              Gere uma versão para impressão antes de enviar
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={handlePrintProtocoloRevisao}>
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (step === 1) {
                      navigate(-1);
                    } else {
                      setStep(step - 1);
                    }
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && !canProceedStep1) ||
                      (step === 2 && !canProceedStep2) ||
                      (step === 3 && !canProceedStep3)
                    }
                  >
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceedStep3}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Enviar Protocolo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}
