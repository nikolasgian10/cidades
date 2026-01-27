import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Save,
  X,
  Upload,
  Link as LinkIcon,
  Trash2,
  Calendar,
  Building2,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  EyeOff,
  Star,
  Mail,
  FileText,
  Download,
} from "lucide-react";
import html2canvas from "html2canvas";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// Tipos
interface Vaga {
  id: string;
  cargo: string;
  secretaria: string;
  quantidade: number;
  salario: string;
  cargaHoraria: string;
  requisitos: string[];
}

interface Documento {
  nome: string;
  arquivo: string;
  status: "aprovado" | "pendente" | "reprovado";
}

interface Inscricao {
  id: string;
  processoId: string;
  vagaId?: string;
  candidatoNome: string;
  candidatoEmail: string;
  candidatoTelefone: string;
  candidatoCPF: string;
  candidatoDataNascimento: string;
  candidatoEndereco: string;
  documentos: Documento[];
  dataInscricao: string;
  status: "pendente" | "documentos_validos" | "avaliado";
  documentosValidados?: boolean; // true após validação documental
  avaliacao?: {
    status: "aprovado" | "reprovado";
    pontuacao: number;
    parecer: string;
    motivoReprovacao?: string;
    dataAvaliacao: string;
    checklistAvaliacao?: ChecklistAvaliacao[];
    pontuacaoTotal: number;
  };
  mensagens: Mensagem[];
  dadosVisiveis: boolean; // Só true após parecer
}

interface Mensagem {
  id: string;
  de: "gestor" | "candidato";
  mensagem: string;
  data: string;
  lida: boolean;
}

interface ProcessoSeletivo {
  id: string;
  titulo: string;
  descricao: string;
  dataAbertura: string;
  dataEncerramento: string;
  status: "aberto" | "encerrado" | "emAndamento";
  vagas: Vaga[];
  editalArquivo?: File;
  editalLink?: string;
  documentosNecessarios: string[];
  checklistAvaliacao?: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  criterio: string;
  peso: number;
  descricao: string;
}

interface ChecklistAvaliacao {
  criterioId: string;
  criterio: string;
  peso: number;
  pontuacao: number; // 0-10
  observacao: string;
}

const secretarias = [
  "Secretaria de Saúde",
  "Secretaria de Educação",
  "Secretaria de Administração",
  "Secretaria de Infraestrutura",
  "Secretaria de Meio Ambiente",
  "Secretaria de Assistência Social",
];

export default function GestaoProcessosSeletivos() {
  const navigate = useNavigate();
  const [processos, setProcessos] = useState<ProcessoSeletivo[]>([]);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [avaliacaoDialogOpen, setAvaliacaoDialogOpen] = useState(false);
  const [mensagemDialogOpen, setMensagemDialogOpen] = useState(false);
  const [editingProcesso, setEditingProcesso] = useState<ProcessoSeletivo | null>(null);
  const [inscricaoAvaliada, setInscricaoAvaliada] = useState<Inscricao | null>(null);

  const [formData, setFormData] = useState<Omit<ProcessoSeletivo, 'id'>>({
    titulo: "",
    descricao: "",
    dataAbertura: "",
    dataEncerramento: "",
    status: "aberto",
    vagas: [],
    editalLink: "",
    documentosNecessarios: [],
  });

  const [novaVaga, setNovaVaga] = useState<Omit<Vaga, 'id'>>({
    cargo: "",
    secretaria: "",
    quantidade: 1,
    salario: "",
    cargaHoraria: "",
    requisitos: [],
  });

  const [requisitoTemp, setRequisitoTemp] = useState("");
  const [documentoTemp, setDocumentoTemp] = useState("");

  // Estados para avaliação
  const [avaliacaoForm, setAvaliacaoForm] = useState({
    status: "aprovado" as "aprovado" | "reprovado",
    pontuacao: 0,
    parecer: "",
    motivoReprovacao: "",
  });

  // Estados para mensagens
  const [novaMensagem, setNovaMensagem] = useState("");
  const [mensagemInscricao, setMensagemInscricao] = useState<Inscricao | null>(null);

  // Estados para seleção de processo na avaliação
  const [processoSelecionado, setProcessoSelecionado] = useState<string>("");

  // Estados para checklist de avaliação
  const [checklistAvaliacao, setChecklistAvaliacao] = useState<ChecklistAvaliacao[]>([]);

  // Estados para revisão de documentos
  const [documentReviewDialogOpen, setDocumentReviewDialogOpen] = useState(false);
  const [inscricaoParaRevisao, setInscricaoParaRevisao] = useState<Inscricao | null>(null);

  // Estados para envio de email com parecer
  const [emailParecerDialogOpen, setEmailParecerDialogOpen] = useState(false);
  const [emailParecerForm, setEmailParecerForm] = useState({
    parecer: "",
    status: "aprovado" as "aprovado" | "reprovado",
  });

  // Estados para resultados detalhados
  const [detailedResultsDialogOpen, setDetailedResultsDialogOpen] = useState(false);
  const [selectedProcessoForResults, setSelectedProcessoForResults] = useState<ProcessoSeletivo | null>(null);

  // Dados mock para teste
  useEffect(() => {
    const mockProcessos: ProcessoSeletivo[] = [
      {
        id: "1",
        titulo: "Concurso Público - Analista Administrativo",
        descricao: "Processo seletivo para contratação de analistas administrativos na Prefeitura Municipal",
        dataAbertura: "2024-01-15",
        dataEncerramento: "2024-02-15",
        status: "aberto",
        vagas: [
          {
            id: "1",
            cargo: "Analista Administrativo",
            secretaria: "Secretaria de Administração",
            quantidade: 5,
            salario: "R$ 3.500,00",
            cargaHoraria: "40 horas semanais",
            requisitos: ["Ensino Superior Completo", "Experiência de 2 anos", "Conhecimento em Excel"]
          }
        ],
        editalLink: "https://prefeitura.com/edital-001.pdf",
        documentosNecessarios: ["RG", "CPF", "Diploma", "Comprovante de Residência"],
        checklistAvaliacao: [
          {
            id: "1",
            criterio: "Formação Acadêmica",
            peso: 30,
            descricao: "Avaliação da formação acadêmica e compatibilidade com o cargo"
          },
          {
            id: "2",
            criterio: "Experiência Profissional",
            peso: 25,
            descricao: "Avaliação da experiência profissional na área"
          },
          {
            id: "3",
            criterio: "Conhecimentos Técnicos",
            peso: 20,
            descricao: "Avaliação dos conhecimentos técnicos específicos"
          },
          {
            id: "4",
            criterio: "Habilidades Comportamentais",
            peso: 15,
            descricao: "Avaliação de habilidades interpessoais e comportamentais"
          },
          {
            id: "5",
            criterio: "Motivação e Adequação",
            peso: 10,
            descricao: "Avaliação da motivação e adequação ao perfil da vaga"
          }
        ]
      },
      {
        id: "2",
        titulo: "Seleção - Professor de Matemática",
        descricao: "Seleção simplificada para professores de matemática na rede municipal",
        dataAbertura: "2024-01-20",
        dataEncerramento: "2024-02-20",
        status: "aberto",
        vagas: [
          {
            id: "2",
            cargo: "Professor de Matemática",
            secretaria: "Secretaria de Educação",
            quantidade: 3,
            salario: "R$ 2.800,00",
            cargaHoraria: "20 horas semanais",
            requisitos: ["Licenciatura em Matemática", "Experiência docente"]
          }
        ],
        editalLink: "",
        documentosNecessarios: ["RG", "CPF", "Diploma de Licenciatura", "Certificado de Experiência"],
        checklistAvaliacao: [
          {
            id: "1",
            criterio: "Formação Específica",
            peso: 35,
            descricao: "Avaliação da formação em Matemática e áreas afins"
          },
          {
            id: "2",
            criterio: "Experiência Docente",
            peso: 30,
            descricao: "Avaliação da experiência em docência"
          },
          {
            id: "3",
            criterio: "Metodologia de Ensino",
            peso: 20,
            descricao: "Avaliação dos conhecimentos em metodologias de ensino"
          },
          {
            id: "4",
            criterio: "Relacionamento Interpessoal",
            peso: 15,
            descricao: "Avaliação das habilidades de relacionamento com alunos e colegas"
          }
        ]
      },
      {
        id: "3",
        titulo: "Processo Seletivo - Técnico em Informática",
        descricao: "Seleção para contratação de técnicos em informática na Secretaria de Tecnologia",
        dataAbertura: "2024-01-01",
        dataEncerramento: "2024-01-31",
        status: "encerrado",
        vagas: [
          {
            id: "3",
            cargo: "Técnico em Informática",
            secretaria: "Secretaria de Tecnologia",
            quantidade: 2,
            salario: "R$ 4.200,00",
            cargaHoraria: "40 horas semanais",
            requisitos: ["Ensino Médio Completo", "Curso Técnico em Informática", "Experiência de 1 ano"]
          }
        ],
        editalLink: "https://prefeitura.com/edital-tecnico.pdf",
        documentosNecessarios: ["RG", "CPF", "Certificado de Ensino Médio", "Certificado Técnico"],
        checklistAvaliacao: [
          {
            id: "1",
            criterio: "Formação Técnica",
            peso: 30,
            descricao: "Avaliação da formação técnica em informática"
          },
          {
            id: "2",
            criterio: "Experiência Profissional",
            peso: 25,
            descricao: "Avaliação da experiência na área de TI"
          },
          {
            id: "3",
            criterio: "Conhecimentos Técnicos",
            peso: 20,
            descricao: "Avaliação dos conhecimentos técnicos específicos"
          },
          {
            id: "4",
            criterio: "Capacidade de Aprendizado",
            peso: 15,
            descricao: "Avaliação da capacidade de aprender novas tecnologias"
          },
          {
            id: "5",
            criterio: "Perfil Comportamental",
            peso: 10,
            descricao: "Avaliação do perfil comportamental para trabalho em equipe"
          }
        ]
      }
    ];

    const mockInscricoes: Inscricao[] = [
      {
        id: "1",
        processoId: "1",
        candidatoNome: "João Silva",
        candidatoEmail: "joao.silva@email.com",
        candidatoTelefone: "(11) 99999-9999",
        candidatoCPF: "123.456.789-00",
        candidatoDataNascimento: "1990-05-15",
        candidatoEndereco: "Rua das Flores, 123 - Centro",
        documentos: [
          { nome: "RG", arquivo: "rg_joao.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_joao.pdf", status: "aprovado" },
          { nome: "Diploma", arquivo: "diploma_joao.pdf", status: "pendente" }
        ],
        status: "pendente",
        documentosValidados: false,
        dataInscricao: "2024-01-16",
        avaliacao: null,
        mensagens: [],
        dadosVisiveis: false
      },
      {
        id: "2",
        processoId: "1",
        candidatoNome: "Maria Santos",
        candidatoEmail: "maria.santos@email.com",
        candidatoTelefone: "(11) 88888-8888",
        candidatoCPF: "987.654.321-00",
        candidatoDataNascimento: "1985-08-22",
        candidatoEndereco: "Av. Principal, 456 - Jardim",
        documentos: [
          { nome: "RG", arquivo: "rg_maria.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_maria.pdf", status: "aprovado" },
          { nome: "Diploma", arquivo: "diploma_maria.pdf", status: "aprovado" }
        ],
        status: "avaliado",
        documentosValidados: true,
        dataInscricao: "2024-01-17",
        avaliacao: {
          status: "aprovado",
          pontuacao: 85,
          parecer: "Candidata com excelente perfil profissional. Demonstrou todas as competências necessárias.",
          dataAvaliacao: "2024-01-20",
          pontuacaoTotal: 85
        },
        mensagens: [
          {
            id: "1",
            de: "gestor",
            mensagem: "Olá Maria, precisamos que você envie uma cópia autenticada do seu diploma.",
            data: "2024-01-18",
            lida: true
          },
          {
            id: "2",
            de: "candidato",
            mensagem: "Olá, estou enviando o documento solicitado.",
            data: "2024-01-19",
            lida: true
          }
        ],
        dadosVisiveis: true
      },
      {
        id: "3",
        processoId: "2",
        candidatoNome: "Pedro Oliveira",
        candidatoEmail: "pedro.oliveira@email.com",
        candidatoTelefone: "(11) 77777-7777",
        candidatoCPF: "456.789.123-00",
        candidatoDataNascimento: "1988-12-10",
        candidatoEndereco: "Rua do Comércio, 789 - Centro",
        documentos: [
          { nome: "RG", arquivo: "rg_pedro.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_pedro.pdf", status: "pendente" },
          { nome: "Diploma", arquivo: "diploma_pedro.pdf", status: "pendente" }
        ],
        status: "avaliado",
        documentosValidados: true,
        dataInscricao: "2024-01-21",
        avaliacao: {
          status: "reprovado",
          pontuacao: 45,
          parecer: "Candidato não atende aos requisitos mínimos estabelecidos no edital.",
          motivoReprovacao: "Falta de experiência docente comprovada",
          dataAvaliacao: "2024-01-25",
          pontuacaoTotal: 45
        },
        mensagens: [],
        dadosVisiveis: true
      },
      {
        id: "4",
        processoId: "1",
        candidatoNome: "Ana Silva",
        candidatoEmail: "ana.silva@email.com",
        candidatoTelefone: "(11) 55555-5555",
        candidatoCPF: "111.222.333-44",
        candidatoDataNascimento: "1992-03-20",
        candidatoEndereco: "Rua Nova, 100 - Centro",
        documentos: [
          { nome: "RG", arquivo: "rg_ana.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_ana.pdf", status: "aprovado" },
          { nome: "Diploma", arquivo: "diploma_ana.pdf", status: "pendente" }
        ],
        status: "pendente",
        documentosValidados: false,
        dataInscricao: "2024-01-22",
        avaliacao: null,
        mensagens: [],
        dadosVisiveis: false
      },
      {
        id: "5",
        processoId: "1",
        candidatoNome: "Carlos Santos",
        candidatoEmail: "carlos.santos@email.com",
        candidatoTelefone: "(11) 66666-6666",
        candidatoCPF: "222.333.444-55",
        candidatoDataNascimento: "1987-07-15",
        candidatoEndereco: "Av. Central, 200 - Jardim",
        documentos: [
          { nome: "RG", arquivo: "rg_carlos.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_carlos.pdf", status: "aprovado" },
          { nome: "Diploma", arquivo: "diploma_carlos.pdf", status: "aprovado" }
        ],
        status: "pendente",
        documentosValidados: false,
        dataInscricao: "2024-01-23",
        avaliacao: null,
        mensagens: [],
        dadosVisiveis: false
      },
      {
        id: "6",
        processoId: "2",
        candidatoNome: "Beatriz Oliveira",
        candidatoEmail: "beatriz.oliveira@email.com",
        candidatoTelefone: "(11) 77777-7777",
        candidatoCPF: "333.444.555-66",
        candidatoDataNascimento: "1995-11-30",
        candidatoEndereco: "Rua Velha, 300 - Centro",
        documentos: [
          { nome: "RG", arquivo: "rg_beatriz.pdf", status: "pendente" },
          { nome: "CPF", arquivo: "cpf_beatriz.pdf", status: "pendente" },
          { nome: "Diploma", arquivo: "diploma_beatriz.pdf", status: "pendente" }
        ],
        status: "pendente",
        documentosValidados: false,
        dataInscricao: "2024-01-24",
        avaliacao: null,
        mensagens: [],
        dadosVisiveis: false
      },
      // Inscrições do Processo 3 - Todas Avaliadas (para demonstrar ranking)
      {
        id: "7",
        processoId: "3",
        vagaId: "3",
        candidatoNome: "Roberto Almeida",
        candidatoEmail: "roberto.almeida@email.com",
        candidatoTelefone: "(11) 11111-1111",
        candidatoCPF: "777.888.999-00",
        candidatoDataNascimento: "1990-06-15",
        candidatoEndereco: "Rua Tecnológica, 500 - Centro",
        documentos: [
          { nome: "RG", arquivo: "rg_roberto.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_roberto.pdf", status: "aprovado" },
          { nome: "Certificado Ensino Médio", arquivo: "ensino_medio_roberto.pdf", status: "aprovado" },
          { nome: "Certificado Técnico", arquivo: "tecnico_roberto.pdf", status: "aprovado" }
        ],
        status: "avaliado",
        documentosValidados: true,
        dataInscricao: "2024-01-05",
        avaliacao: {
          status: "aprovado",
          pontuacao: 87.5,
          pontuacaoTotal: 87.5,
          parecer: "Excelente candidato com sólida formação técnica e experiência comprovada. Demonstrou conhecimentos avançados em várias áreas da informática.",
          dataAvaliacao: "2024-02-15",
          checklistAvaliacao: [
            { criterioId: "1", criterio: "Formação Técnica", peso: 30, pontuacao: 9.5, observacao: "Formação técnica completa e atualizada" },
            { criterioId: "2", criterio: "Experiência Profissional", peso: 25, pontuacao: 8.5, observacao: "3 anos de experiência em suporte técnico" },
            { criterioId: "3", criterio: "Conhecimentos Técnicos", peso: 20, pontuacao: 9.0, observacao: "Conhecimentos sólidos em redes e sistemas" },
            { criterioId: "4", criterio: "Capacidade de Aprendizado", peso: 15, pontuacao: 8.0, observacao: "Demonstrou rápida adaptação a novas tecnologias" },
            { criterioId: "5", criterio: "Perfil Comportamental", peso: 10, pontuacao: 8.5, observacao: "Excelente trabalho em equipe" }
          ]
        },
        mensagens: [],
        dadosVisiveis: true
      },
      {
        id: "8",
        processoId: "3",
        vagaId: "3",
        candidatoNome: "Fernanda Costa",
        candidatoEmail: "fernanda.costa@email.com",
        candidatoTelefone: "(11) 22222-2222",
        candidatoCPF: "888.999.000-11",
        candidatoDataNascimento: "1992-09-20",
        candidatoEndereco: "Av. Digital, 750 - Jardim",
        documentos: [
          { nome: "RG", arquivo: "rg_fernanda.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_fernanda.pdf", status: "aprovado" },
          { nome: "Certificado Ensino Médio", arquivo: "ensino_medio_fernanda.pdf", status: "aprovado" },
          { nome: "Certificado Técnico", arquivo: "tecnico_fernanda.pdf", status: "aprovado" }
        ],
        status: "avaliado",
        documentosValidados: true,
        dataInscricao: "2024-01-08",
        avaliacao: {
          status: "aprovado",
          pontuacao: 82.0,
          pontuacaoTotal: 82.0,
          parecer: "Candidata com bom perfil técnico e experiência adequada. Atende bem aos requisitos do cargo.",
          dataAvaliacao: "2024-02-15",
          checklistAvaliacao: [
            { criterioId: "1", criterio: "Formação Técnica", peso: 30, pontuacao: 8.0, observacao: "Formação técnica sólida" },
            { criterioId: "2", criterio: "Experiência Profissional", peso: 25, pontuacao: 8.5, observacao: "2 anos de experiência em desenvolvimento" },
            { criterioId: "3", criterio: "Conhecimentos Técnicos", peso: 20, pontuacao: 8.0, observacao: "Bons conhecimentos em programação" },
            { criterioId: "4", criterio: "Capacidade de Aprendizado", peso: 15, pontuacao: 8.5, observacao: "Boa capacidade de aprendizado" },
            { criterioId: "5", criterio: "Perfil Comportamental", peso: 10, pontuacao: 7.0, observacao: "Bom relacionamento interpessoal" }
          ]
        },
        mensagens: [],
        dadosVisiveis: true
      },
      {
        id: "9",
        processoId: "3",
        vagaId: "3",
        candidatoNome: "Lucas Pereira",
        candidatoEmail: "lucas.pereira@email.com",
        candidatoTelefone: "(11) 33333-3333",
        candidatoCPF: "999.000.111-22",
        candidatoDataNascimento: "1988-12-10",
        candidatoEndereco: "Rua da Inovação, 900 - Centro",
        documentos: [
          { nome: "RG", arquivo: "rg_lucas.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_lucas.pdf", status: "aprovado" },
          { nome: "Certificado Ensino Médio", arquivo: "ensino_medio_lucas.pdf", status: "aprovado" },
          { nome: "Certificado Técnico", arquivo: "tecnico_lucas.pdf", status: "aprovado" }
        ],
        status: "avaliado",
        documentosValidados: true,
        dataInscricao: "2024-01-12",
        avaliacao: {
          status: "aprovado",
          pontuacao: 79.5,
          pontuacaoTotal: 79.5,
          parecer: "Candidato com experiência adequada e conhecimentos técnicos satisfatórios. Bom perfil para a vaga.",
          dataAvaliacao: "2024-02-15",
          checklistAvaliacao: [
            { criterioId: "1", criterio: "Formação Técnica", peso: 30, pontuacao: 7.5, observacao: "Formação técnica adequada" },
            { criterioId: "2", criterio: "Experiência Profissional", peso: 25, pontuacao: 9.0, observacao: "4 anos de experiência em TI" },
            { criterioId: "3", criterio: "Conhecimentos Técnicos", peso: 20, pontuacao: 8.0, observacao: "Conhecimentos técnicos sólidos" },
            { criterioId: "4", criterio: "Capacidade de Aprendizado", peso: 15, pontuacao: 7.0, observacao: "Capacidade de aprendizado média" },
            { criterioId: "5", criterio: "Perfil Comportamental", peso: 10, pontuacao: 8.0, observacao: "Bom perfil comportamental" }
          ]
        },
        mensagens: [],
        dadosVisiveis: true
      },
      {
        id: "10",
        processoId: "3",
        vagaId: "3",
        candidatoNome: "Juliana Martins",
        candidatoEmail: "juliana.martins@email.com",
        candidatoTelefone: "(11) 44444-4444",
        candidatoCPF: "000.111.222-33",
        candidatoDataNascimento: "1995-04-25",
        candidatoEndereco: "Rua do Conhecimento, 1200 - Jardim",
        documentos: [
          { nome: "RG", arquivo: "rg_juliana.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_juliana.pdf", status: "aprovado" },
          { nome: "Certificado Ensino Médio", arquivo: "ensino_medio_juliana.pdf", status: "aprovado" },
          { nome: "Certificado Técnico", arquivo: "tecnico_juliana.pdf", status: "aprovado" }
        ],
        status: "avaliado",
        documentosValidados: true,
        dataInscricao: "2024-01-15",
        avaliacao: {
          status: "reprovado",
          pontuacao: 65.0,
          pontuacaoTotal: 65.0,
          parecer: "Candidata com formação adequada mas experiência insuficiente para as demandas do cargo.",
          motivoReprovacao: "Experiência profissional abaixo do mínimo exigido",
          dataAvaliacao: "2024-02-15",
          checklistAvaliacao: [
            { criterioId: "1", criterio: "Formação Técnica", peso: 30, pontuacao: 7.0, observacao: "Formação técnica básica" },
            { criterioId: "2", criterio: "Experiência Profissional", peso: 25, pontuacao: 5.0, observacao: "Experiência insuficiente (6 meses)" },
            { criterioId: "3", criterio: "Conhecimentos Técnicos", peso: 20, pontuacao: 7.5, observacao: "Conhecimentos técnicos básicos" },
            { criterioId: "4", criterio: "Capacidade de Aprendizado", peso: 15, pontuacao: 8.5, observacao: "Boa capacidade de aprendizado" },
            { criterioId: "5", criterio: "Perfil Comportamental", peso: 10, pontuacao: 7.0, observacao: "Perfil comportamental adequado" }
          ]
        },
        mensagens: [],
        dadosVisiveis: true
      },
      {
        id: "11",
        processoId: "3",
        vagaId: "3",
        candidatoNome: "Marcos Silva",
        candidatoEmail: "marcos.silva@email.com",
        candidatoTelefone: "(11) 55555-5555",
        candidatoCPF: "111.222.333-44",
        candidatoDataNascimento: "1985-08-30",
        candidatoEndereco: "Av. Tecnológica, 1500 - Centro",
        documentos: [
          { nome: "RG", arquivo: "rg_marcos.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_marcos.pdf", status: "aprovado" },
          { nome: "Certificado Ensino Médio", arquivo: "ensino_medio_marcos.pdf", status: "aprovado" },
          { nome: "Certificado Técnico", arquivo: "tecnico_marcos.pdf", status: "aprovado" }
        ],
        status: "avaliado",
        documentosValidados: true,
        dataInscricao: "2024-01-18",
        avaliacao: {
          status: "aprovado",
          pontuacao: 76.0,
          pontuacaoTotal: 76.0,
          parecer: "Candidato com experiência sólida e conhecimentos técnicos adequados. Bom perfil para a função.",
          dataAvaliacao: "2024-02-15",
          checklistAvaliacao: [
            { criterioId: "1", criterio: "Formação Técnica", peso: 30, pontuacao: 7.0, observacao: "Formação técnica completa" },
            { criterioId: "2", criterio: "Experiência Profissional", peso: 25, pontuacao: 8.5, observacao: "3 anos de experiência em infraestrutura" },
            { criterioId: "3", criterio: "Conhecimentos Técnicos", peso: 20, pontuacao: 7.5, observacao: "Conhecimentos em redes e servidores" },
            { criterioId: "4", criterio: "Capacidade de Aprendizado", peso: 15, pontuacao: 7.0, observacao: "Capacidade de aprendizado adequada" },
            { criterioId: "5", criterio: "Perfil Comportamental", peso: 10, pontuacao: 7.0, observacao: "Perfil comportamental adequado" }
          ]
        },
        mensagens: [],
        dadosVisiveis: true
      },
      {
        id: "12",
        processoId: "3",
        vagaId: "3",
        candidatoNome: "Carla Rodrigues",
        candidatoEmail: "carla.rodrigues@email.com",
        candidatoTelefone: "(11) 66666-6666",
        candidatoCPF: "222.333.444-55",
        candidatoDataNascimento: "1993-01-12",
        candidatoEndereco: "Rua da Tecnologia, 800 - Jardim",
        documentos: [
          { nome: "RG", arquivo: "rg_carla.pdf", status: "aprovado" },
          { nome: "CPF", arquivo: "cpf_carla.pdf", status: "aprovado" },
          { nome: "Certificado Ensino Médio", arquivo: "ensino_medio_carla.pdf", status: "aprovado" },
          { nome: "Certificado Técnico", arquivo: "tecnico_carla.pdf", status: "aprovado" }
        ],
        status: "avaliado",
        documentosValidados: true,
        dataInscricao: "2024-01-20",
        avaliacao: {
          status: "reprovado",
          pontuacao: 58.5,
          pontuacaoTotal: 58.5,
          parecer: "Candidata com formação básica mas conhecimentos técnicos insuficientes para as demandas do cargo.",
          motivoReprovacao: "Conhecimentos técnicos abaixo do esperado",
          dataAvaliacao: "2024-02-15",
          checklistAvaliacao: [
            { criterioId: "1", criterio: "Formação Técnica", peso: 30, pontuacao: 6.0, observacao: "Formação técnica básica" },
            { criterioId: "2", criterio: "Experiência Profissional", peso: 25, pontuacao: 6.5, observacao: "Experiência limitada" },
            { criterioId: "3", criterio: "Conhecimentos Técnicos", peso: 20, pontuacao: 5.0, observacao: "Conhecimentos técnicos insuficientes" },
            { criterioId: "4", criterio: "Capacidade de Aprendizado", peso: 15, pontuacao: 7.0, observacao: "Capacidade de aprendizado razoável" },
            { criterioId: "5", criterio: "Perfil Comportamental", peso: 10, pontuacao: 6.0, observacao: "Perfil comportamental básico" }
          ]
        },
        mensagens: [],
        dadosVisiveis: true
      }
    ];

    setProcessos(mockProcessos);
    setInscricoes(mockInscricoes);
  }, []);

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      dataAbertura: "",
      dataEncerramento: "",
      status: "aberto",
      vagas: [],
      editalLink: "",
      documentosNecessarios: [],
    });
    setEditingProcesso(null);
  };

  const handleOpenDialog = (processo?: ProcessoSeletivo) => {
    if (processo) {
      setEditingProcesso(processo);
      setFormData({
        titulo: processo.titulo,
        descricao: processo.descricao,
        dataAbertura: processo.dataAbertura,
        dataEncerramento: processo.dataEncerramento,
        status: processo.status,
        vagas: processo.vagas,
        editalLink: processo.editalLink || "",
        documentosNecessarios: processo.documentosNecessarios,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleAddVaga = () => {
    if (!novaVaga.cargo || !novaVaga.secretaria || !novaVaga.salario) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos cargo, secretaria e salário.",
        variant: "destructive",
      });
      return;
    }

    const vaga: Vaga = {
      ...novaVaga,
      id: Date.now().toString(),
    };

    setFormData(prev => ({
      ...prev,
      vagas: [...prev.vagas, vaga],
    }));

    setNovaVaga({
      cargo: "",
      secretaria: "",
      quantidade: 1,
      salario: "",
      cargaHoraria: "",
      requisitos: [],
    });
  };

  const handleRemoveVaga = (vagaId: string) => {
    setFormData(prev => ({
      ...prev,
      vagas: prev.vagas.filter(v => v.id !== vagaId),
    }));
  };

  const handleAddRequisito = () => {
    if (!requisitoTemp.trim()) return;

    setNovaVaga(prev => ({
      ...prev,
      requisitos: [...prev.requisitos, requisitoTemp.trim()],
    }));
    setRequisitoTemp("");
  };

  const handleRemoveRequisito = (index: number) => {
    setNovaVaga(prev => ({
      ...prev,
      requisitos: prev.requisitos.filter((_, i) => i !== index),
    }));
  };

  const handleAddDocumento = () => {
    if (!documentoTemp.trim()) return;

    setFormData(prev => ({
      ...prev,
      documentosNecessarios: [...prev.documentosNecessarios, documentoTemp.trim()],
    }));
    setDocumentoTemp("");
  };

  const handleRemoveDocumento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentosNecessarios: prev.documentosNecessarios.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        editalArquivo: file,
      }));
    }
  };

  const handleSave = () => {
    if (!formData.titulo || !formData.descricao || !formData.dataAbertura || !formData.dataEncerramento) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.vagas.length === 0) {
      toast({
        title: "Vagas obrigatórias",
        description: "Adicione pelo menos uma vaga ao processo seletivo.",
        variant: "destructive",
      });
      return;
    }

    const processo: ProcessoSeletivo = {
      ...formData,
      id: editingProcesso?.id || Date.now().toString(),
    };

    if (editingProcesso) {
      setProcessos(prev => prev.map(p => p.id === processo.id ? processo : p));
      toast({
        title: "Processo atualizado",
        description: "Processo seletivo atualizado com sucesso.",
      });
    } else {
      setProcessos(prev => [...prev, processo]);
      toast({
        title: "Processo criado",
        description: "Processo seletivo criado com sucesso.",
      });
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (processoId: string) => {
    setProcessos(prev => prev.filter(p => p.id !== processoId));
    toast({
      title: "Processo removido",
      description: "Processo seletivo removido com sucesso.",
    });
  };

  // Funções de avaliação
  const handleDownloadDocumento = (documento: Documento) => {
    // Simulação de download - em produção, isso faria uma requisição para o servidor
    toast({
      title: "Download iniciado",
      description: `Baixando ${documento.nome}...`,
    });

    // Para dados mock, criamos um blob simulado
    // Em produção, você substituiria isso por uma chamada de API real
    try {
      // Simular criação de um arquivo PDF
      const blob = new Blob(['Conteúdo simulado do documento'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = documento.arquivo.split('/').pop() || `${documento.nome}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpar o URL do objeto
      URL.revokeObjectURL(url);

      toast({
        title: "Download concluído",
        description: `${documento.nome} foi baixado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o documento.",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = (processoId: string) => {
    try {
      const approvedInscricoes = inscricoes
        .filter(inscricao => 
          inscricao.processoId === processoId && 
          inscricao.avaliacao?.status === 'aprovado'
        )
        .sort((a, b) => (b.avaliacao?.pontuacaoTotal || b.avaliacao?.pontuacao || 0) - (a.avaliacao?.pontuacaoTotal || a.avaliacao?.pontuacao || 0));

      if (approvedInscricoes.length === 0) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não há inscrições aprovadas para exportar.",
          variant: "destructive",
        });
        return;
      }

      const processo = processos.find(p => p.id === processoId);
      const csvContent = [
        ['Posição', 'Nome do Candidato', 'Cargo', 'Pontuação', 'Data de Avaliação'],
        ...approvedInscricoes.map((inscricao, index) => {
          const vaga = processo?.vagas.find(v => v.id === inscricao.vagaId);
          return [
            (index + 1).toString(),
            inscricao.candidatoNome,
            vaga?.cargo || 'N/A',
            (inscricao.avaliacao?.pontuacaoTotal || inscricao.avaliacao?.pontuacao || 0).toString(),
            new Date(inscricao.avaliacao?.dataAvaliacao || '').toLocaleDateString("pt-BR")
          ];
        })
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `ranking_aprovados_${processo?.titulo.replace(/\s+/g, '_') || 'processo'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: "Arquivo CSV exportado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleExportToImage = (processoId: string) => {
    try {
      const approvedInscricoes = inscricoes
        .filter(inscricao => 
          inscricao.processoId === processoId && 
          inscricao.avaliacao?.status === 'aprovado'
        )
        .sort((a, b) => (b.avaliacao?.pontuacaoTotal || b.avaliacao?.pontuacao || 0) - (a.avaliacao?.pontuacaoTotal || a.avaliacao?.pontuacao || 0));

      if (approvedInscricoes.length === 0) {
        toast({
          title: "Nenhum dado para exportar",
          description: "Não há inscrições aprovadas para exportar.",
          variant: "destructive",
        });
        return;
      }

      const processo = processos.find(p => p.id === processoId);

      // Criar conteúdo HTML para a imagem
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: white;">
          <h1 style="color: #333; text-align: center; margin-bottom: 20px;">Ranking de Aprovados</h1>
          <h2 style="color: #666; text-align: center; margin-bottom: 30px;">${processo?.titulo}</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Posição</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Nome do Candidato</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Cargo</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Pontuação</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Data de Avaliação</th>
              </tr>
            </thead>
            <tbody>
              ${approvedInscricoes.map((inscricao, index) => {
                const vaga = processo?.vagas.find(v => v.id === inscricao.vagaId);
                return `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 12px;">${index + 1}º</td>
                    <td style="border: 1px solid #ddd; padding: 12px;">${inscricao.candidatoNome}</td>
                    <td style="border: 1px solid #ddd; padding: 12px;">${vaga?.cargo || 'N/A'}</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${inscricao.avaliacao?.pontuacaoTotal || inscricao.avaliacao?.pontuacao || 0}</td>
                    <td style="border: 1px solid #ddd; padding: 12px;">${new Date(inscricao.avaliacao?.dataAvaliacao || '').toLocaleDateString("pt-BR")}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}
          </div>
        </div>
      `;

      // Criar um elemento temporário para renderizar o HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);

      // Usar html2canvas para gerar a imagem
      html2canvas(tempDiv).then(canvas => {
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ranking_aprovados_${processo?.titulo.replace(/\s+/g, '_') || 'processo'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          document.body.removeChild(tempDiv);

          toast({
            title: "Exportação concluída",
            description: "Imagem exportada com sucesso.",
          });
        });
      }).catch(error => {
        console.error('Erro ao gerar imagem:', error);
        toast({
          title: "Erro na exportação",
          description: "Não foi possível exportar a imagem.",
          variant: "destructive",
        });
        document.body.removeChild(tempDiv);
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar a imagem.",
        variant: "destructive",
      });
    }
  };

  const handleAprovarDocumento = (documentoNome: string) => {
    if (!inscricaoParaRevisao) return;

    setInscricoes(prev => prev.map(inscricao =>
      inscricao.id === inscricaoParaRevisao.id
        ? {
            ...inscricao,
            documentos: inscricao.documentos.map(doc =>
              doc.nome === documentoNome
                ? { ...doc, status: "aprovado" as const }
                : doc
            ),
          }
        : inscricao
    ));

    // Update the local state for the dialog
    setInscricaoParaRevisao(prev => prev ? {
      ...prev,
      documentos: prev.documentos.map(doc =>
        doc.nome === documentoNome
          ? { ...doc, status: "aprovado" as const }
          : doc
      ),
    } : null);

    toast({
      title: "Documento aprovado",
      description: `${documentoNome} foi aprovado.`,
    });
  };

  const handleReprovarDocumento = (documentoNome: string) => {
    if (!inscricaoParaRevisao) return;

    setInscricoes(prev => prev.map(inscricao =>
      inscricao.id === inscricaoParaRevisao.id
        ? {
            ...inscricao,
            documentos: inscricao.documentos.map(doc =>
              doc.nome === documentoNome
                ? { ...doc, status: "reprovado" as const }
                : doc
            ),
          }
        : inscricao
    ));

    // Update the local state for the dialog
    setInscricaoParaRevisao(prev => prev ? {
      ...prev,
      documentos: prev.documentos.map(doc =>
        doc.nome === documentoNome
          ? { ...doc, status: "reprovado" as const }
          : doc
      ),
    } : null);

    toast({
      title: "Documento reprovado",
      description: `${documentoNome} foi reprovado.`,
    });
  };

  const handleAvaliarInscricao = (inscricao: Inscricao) => {
    setInscricaoParaRevisao(inscricao);
    setDocumentReviewDialogOpen(true);
  };

  const handleAprovarDocumentos = () => {
    if (!inscricaoParaRevisao) return;

    // Aprovar automaticamente todos os documentos
    const documentosAprovados = inscricaoParaRevisao.documentos.map(doc => ({
      ...doc,
      status: "aprovado" as const
    }));

    setInscricoes(prev => prev.map(inscricao =>
      inscricao.id === inscricaoParaRevisao.id
        ? {
            ...inscricao,
            documentos: documentosAprovados,
            status: "documentos_validos",
            documentosValidados: true,
          }
        : inscricao
    ));

    // Fechar modal de revisão e abrir modal de email com parecer
    setDocumentReviewDialogOpen(false);
    setEmailParecerDialogOpen(true);
  };

  const handleEnviarEmailParecer = () => {
    if (!inscricaoParaRevisao) return;

    // Simular envio de email
    const assunto = emailParecerForm.status === "aprovado"
      ? "Documentação Aprovada - Processo Seletivo"
      : "Documentação Reprovada - Processo Seletivo";

    const mensagem = emailParecerForm.status === "aprovado"
      ? `Prezado(a) ${inscricaoParaRevisao.candidatoNome},\n\nSua documentação foi aprovada para o processo seletivo.\n\nParecer: ${emailParecerForm.parecer}\n\nAgora você pode aguardar a avaliação por critérios.\n\nAtenciosamente,\nEquipe de Gestão`
      : `Prezado(a) ${inscricaoParaRevisao.candidatoNome},\n\nInfelizmente sua documentação foi reprovada para o processo seletivo.\n\nParecer: ${emailParecerForm.parecer}\n\nAtenciosamente,\nEquipe de Gestão`;

    // Simulação de envio de email
    console.log("Email enviado:", { assunto, mensagem, destinatario: inscricaoParaRevisao.candidatoEmail });

    toast({
      title: "Email enviado",
      description: `Email de ${emailParecerForm.status === "aprovado" ? "aprovação" : "reprovação"} enviado para ${inscricaoParaRevisao.candidatoEmail}`,
    });

    // Se reprovado, finalizar o processo
    if (emailParecerForm.status === "reprovado") {
      setInscricoes(prev => prev.map(inscricao =>
        inscricao.id === inscricaoParaRevisao.id
          ? {
              ...inscricao,
              status: "avaliado",
              avaliacao: {
                status: "reprovado",
                pontuacao: 0,
                parecer: emailParecerForm.parecer,
                motivoReprovacao: emailParecerForm.parecer,
                dataAvaliacao: new Date().toISOString().split('T')[0],
                pontuacaoTotal: 0
              },
              dadosVisiveis: true,
            }
          : inscricao
      ));

      setEmailParecerDialogOpen(false);
      setInscricaoParaRevisao(null);
      setEmailParecerForm({ parecer: "", status: "aprovado" });
      return;
    }

    // Se aprovado, prosseguir para avaliação por checklist
    setEmailParecerDialogOpen(false);
    handleIniciarAvaliacaoChecklist();
  };

  const handleReprovarInscricao = () => {
    if (!inscricaoParaRevisao) return;

    // For rejection, we need a mandatory opinion
    const motivo = prompt("Digite o motivo da reprovação (obrigatório):");
    if (!motivo || !motivo.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "É necessário informar o motivo da reprovação.",
        variant: "destructive",
      });
      return;
    }

    setInscricoes(prev => prev.map(inscricao =>
      inscricao.id === inscricaoParaRevisao.id
        ? {
            ...inscricao,
            status: "avaliado",
            avaliacao: {
              status: "reprovado",
              pontuacao: 0,
              parecer: `Inscrição reprovada na validação documental. ${motivo}`,
              motivoReprovacao: motivo,
              dataAvaliacao: new Date().toISOString().split('T')[0],
              pontuacaoTotal: 0
            },
            dadosVisiveis: true,
          }
        : inscricao
    ));

    // Simular envio de email
    toast({
      title: "Inscrição reprovada",
      description: "Email de reprovação enviado para o candidato.",
    });

    setDocumentReviewDialogOpen(false);
    setInscricaoParaRevisao(null);
  };

  const handleIniciarAvaliacaoChecklist = () => {
    if (!inscricaoParaRevisao) return;
    const processo = processos.find(p => p.id === inscricaoParaRevisao.processoId);
    const checklist = processo?.checklistAvaliacao || [];
    
    // Inicializar checklist de avaliação se não existir
    const checklistAvaliacao: ChecklistAvaliacao[] = checklist.map(item => ({
      criterioId: item.id,
      criterio: item.criterio,
      peso: item.peso,
      pontuacao: inscricaoParaRevisao.avaliacao?.checklistAvaliacao?.find(c => c.criterioId === item.id)?.pontuacao || 0,
      observacao: inscricaoParaRevisao.avaliacao?.checklistAvaliacao?.find(c => c.criterioId === item.id)?.observacao || "",
    }));

    setChecklistAvaliacao(checklistAvaliacao);
    setAvaliacaoForm({
      status: inscricaoParaRevisao.avaliacao?.status || "aprovado",
      pontuacao: inscricaoParaRevisao.avaliacao?.pontuacao || 0,
      parecer: inscricaoParaRevisao.avaliacao?.parecer || "",
      motivoReprovacao: inscricaoParaRevisao.avaliacao?.motivoReprovacao || "",
    });
    setInscricaoAvaliada(inscricaoParaRevisao);
    setAvaliacaoDialogOpen(true);
    setDocumentReviewDialogOpen(false);
  };

  const handleSalvarAvaliacao = () => {
    if (!inscricaoAvaliada) return;

    if (!avaliacaoForm.parecer.trim()) {
      toast({
        title: "Parecer obrigatório",
        description: "É necessário fornecer um parecer para a avaliação.",
        variant: "destructive",
      });
      return;
    }

    if (avaliacaoForm.status === "reprovado" && !avaliacaoForm.motivoReprovacao.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Para reprovar, é necessário informar o motivo.",
        variant: "destructive",
      });
      return;
    }

    // Calcular pontuação total baseada no checklist
    const pontuacaoTotal = checklistAvaliacao.reduce((total, item) => {
      return total + (item.pontuacao * item.peso / 100);
    }, 0);

    setInscricoes(prev => prev.map(inscricao =>
      inscricao.id === inscricaoAvaliada.id
        ? {
            ...inscricao,
            status: "avaliado",
            avaliacao: {
              status: avaliacaoForm.status,
              pontuacao: Math.round(pontuacaoTotal), // Pontuação calculada automaticamente
              pontuacaoTotal: Math.round(pontuacaoTotal * 10) / 10, // Pontuação com uma casa decimal
              parecer: avaliacaoForm.parecer,
              motivoReprovacao: avaliacaoForm.status === "reprovado" ? avaliacaoForm.motivoReprovacao : undefined,
              dataAvaliacao: new Date().toISOString().split('T')[0],
              checklistAvaliacao: checklistAvaliacao,
            },
            dadosVisiveis: true, // Agora os dados ficam visíveis após avaliação
          }
        : inscricao
    ));

    toast({
      title: "Avaliação salva",
      description: `Inscrição ${avaliacaoForm.status === "aprovado" ? "aprovada" : "reprovada"} com sucesso.`,
    });

    setAvaliacaoDialogOpen(false);
    setInscricaoAvaliada(null);
    setDocumentReviewDialogOpen(false);
    setInscricaoParaRevisao(null);
  };

  // Funções de mensagens
  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim() || !mensagemInscricao) return;

    const mensagem: Mensagem = {
      id: Date.now().toString(),
      de: "gestor",
      mensagem: novaMensagem,
      data: new Date().toISOString(),
      lida: false,
    };

    setInscricoes(prev => prev.map(inscricao =>
      inscricao.id === mensagemInscricao.id
        ? {
            ...inscricao,
            mensagens: [...inscricao.mensagens, mensagem],
          }
        : inscricao
    ));

    toast({
      title: "Mensagem enviada",
      description: "Mensagem enviada para o candidato.",
    });

    setNovaMensagem("");
    setMensagemDialogOpen(false);
    setMensagemInscricao(null);
  };

  const handleAbrirMensagens = (inscricao: Inscricao) => {
    setMensagemInscricao(inscricao);
    setMensagemDialogOpen(true);
  };

  const getStatusInscricaoColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-700";
      case "documentos_validos":
        return "bg-blue-100 text-blue-700";
      case "avaliado":
        return inscricaoAvaliada?.avaliacao?.status === "aprovado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusInscricaoLabel = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "documentos_validos":
        return "Documentos Válidos";
      case "avaliado":
        return "Avaliada";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberto":
        return "bg-green-100 text-green-700";
      case "encerrado":
        return "bg-gray-100 text-gray-700";
      case "emAndamento":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aberto":
        return "Inscrições Abertas";
      case "encerrado":
        return "Encerrado";
      case "emAndamento":
        return "Em Andamento";
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestão de Processos Seletivos</h1>
              <p className="text-muted-foreground">
                Crie e gerencie processos seletivos da prefeitura
              </p>
            </div>
          </div>

          <Tabs defaultValue="processos" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="processos">Processos Seletivos</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliação de Inscrições</TabsTrigger>
            </TabsList>

            {/* Aba de Processos */}
            <TabsContent value="processos" className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Processo
                </Button>
              </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{processos.length}</p>
                  <p className="text-xs text-muted-foreground">Total de Processos</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {processos.filter(p => p.status === "aberto").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Em Aberto</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {processos.reduce((acc, p) => acc + p.vagas.reduce((vagaAcc, v) => vagaAcc + v.quantidade, 0), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Vagas Totais</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {processos.filter(p => p.status === "emAndamento").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Em Andamento</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Processos List */}
          <div className="space-y-4">
            {processos.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Nenhum processo seletivo
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crie seu primeiro processo seletivo para começar.
                  </p>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Processo
                  </Button>
                </CardContent>
              </Card>
            ) : (
              processos.map((processo) => (
                <motion.div
                  key={processo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(processo.status)}>
                              {getStatusLabel(processo.status)}
                            </Badge>
                            <Badge variant="outline">
                              {processo.vagas.reduce((acc, v) => acc + v.quantidade, 0)} vagas
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{processo.titulo}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {processo.descricao.substring(0, 100)}...
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Abertura: {new Date(processo.dataAbertura).toLocaleDateString("pt-BR")}</span>
                            <span>Encerramento: {new Date(processo.dataEncerramento).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(processo)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(processo.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {processo.vagas.slice(0, 3).map((vaga) => (
                          <div key={vaga.id} className="p-3 border rounded-lg bg-muted/30">
                            <h5 className="font-medium text-sm">{vaga.cargo}</h5>
                            <p className="text-xs text-muted-foreground">{vaga.secretaria}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                {vaga.quantidade} vaga{vaga.quantidade > 1 ? 's' : ''}
                              </span>
                              <span className="text-xs font-medium">{vaga.salario}</span>
                            </div>
                          </div>
                        ))}
                        {processo.vagas.length > 3 && (
                          <div className="p-3 border rounded-lg bg-muted/30 flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              +{processo.vagas.length - 3} vagas
                            </span>
                          </div>
                        )}
                      </div>
                      {(() => {
                        const processInscricoes = inscricoes.filter(i => i.processoId === processo.id);
                        const allEvaluated = processInscricoes.length > 0 && processInscricoes.every(i => i.status === "avaliado");
                        return allEvaluated && (
                          <div className="mt-4 pt-4 border-t">
                            <Button
                              onClick={() => {
                                setSelectedProcessoForResults(processo);
                                setDetailedResultsDialogOpen(true);
                              }}
                              className="w-full gap-2"
                            >
                              <Star className="h-4 w-4" />
                              Ver Resultados Detalhados
                            </Button>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
            </TabsContent>

            {/* Aba de Avaliações */}
            <TabsContent value="avaliacoes" className="space-y-6">
              {/* Seletor de Processo */}
              <Card>
                <CardHeader>
                  <CardTitle>Selecionar Processo para Avaliação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Processo Seletivo</Label>
                      <Select
                        value={processoSelecionado}
                        onValueChange={setProcessoSelecionado}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um processo para avaliar inscrições" />
                        </SelectTrigger>
                        <SelectContent>
                          {processos.map((processo) => (
                            <SelectItem key={processo.id} value={processo.id}>
                              {processo.titulo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {processoSelecionado && (
                <>
                  {/* Inscrições do Processo Selecionado */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Inscrições - {processos.find(p => p.id === processoSelecionado)?.titulo}
                    </h3>
                    {inscricoes.filter(inscricao => inscricao.processoId === processoSelecionado).length === 0 ? (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-muted-foreground mb-2">
                            Nenhuma inscrição
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Ainda não há inscrições para este processo.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      inscricoes
                        .filter(inscricao => inscricao.processoId === processoSelecionado)
                        .map((inscricao) => {
                          const processo = processos.find(p => p.id === inscricao.processoId);
                          const vaga = processo?.vagas.find(v => v.id === inscricao.vagaId);

                          return (
                            <motion.div
                              key={inscricao.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <Card>
                                <CardHeader>
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge className={getStatusInscricaoColor(inscricao.status)}>
                                          {getStatusInscricaoLabel(inscricao.status)}
                                        </Badge>
                                        {inscricao.avaliacao && (
                                          <Badge variant="outline" className={`gap-1 ${inscricao.avaliacao.status === 'aprovado' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'}`}>
                                            <Star className="h-3 w-3" />
                                            {inscricao.avaliacao.pontuacaoTotal || inscricao.avaliacao.pontuacao} pontos
                                          </Badge>
                                        )}
                                      </div>
                                      <CardTitle className="text-lg">
                                        {vaga?.cargo || "Vaga não especificada"}
                                      </CardTitle>
                                      <p className="text-sm text-muted-foreground">
                                        {vaga?.secretaria}
                                      </p>
                                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span>Inscrição: {new Date(inscricao.dataInscricao).toLocaleDateString("pt-BR")}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAvaliarInscricao(inscricao)}
                                      >
                                        Avaliar
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAbrirMensagens(inscricao)}
                                        className="gap-1"
                                      >
                                        <MessageSquare className="h-3 w-3" />
                                        Mensagens ({inscricao.mensagens.filter(m => !m.lida && m.de === "candidato").length})
                                      </Button>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">Dados do Candidato</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="font-medium">Nome:</span> {inscricao.candidatoNome}</div>
                                    <div><span className="font-medium">CPF:</span> {inscricao.candidatoCPF}</div>
                                    <div><span className="font-medium">Email:</span> {inscricao.candidatoEmail}</div>
                                    <div><span className="font-medium">Telefone:</span> {inscricao.candidatoTelefone}</div>
                                    <div><span className="font-medium">Data de Nascimento:</span> {new Date(inscricao.candidatoDataNascimento).toLocaleDateString("pt-BR")}</div>
                                    <div><span className="font-medium">Endereço:</span> {inscricao.candidatoEndereco}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-3">Documentos</h4>
                                  <div className="space-y-2">
                                    {inscricao.documentos.map((doc, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm">{doc.nome}</span>
                                          <Badge variant="outline" className="text-xs">
                                            {doc.status}
                                          </Badge>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDownloadDocumento(doc)}
                                          className="gap-1"
                                        >
                                          <Download className="h-3 w-3" />
                                          Download
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {inscricao.avaliacao && (
                                <div className="mt-4 p-3 bg-muted rounded-lg">
                                  {inscricao.avaliacao.parecer && (
                                    <>
                                      <h4 className="font-medium mb-2">Parecer</h4>
                                      <p className="text-sm">{inscricao.avaliacao.parecer}</p>
                                    </>
                                  )}
                                  {inscricao.avaliacao.motivoReprovacao && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                      <p className="text-sm text-red-700">
                                        <strong>Motivo da reprovação:</strong> {inscricao.avaliacao.motivoReprovacao}
                                      </p>
                                    </div>
                                  )}
                                  {inscricao.avaliacao.checklistAvaliacao && inscricao.avaliacao.status === "aprovado" && (
                                    <div className="mt-3">
                                      <h5 className="font-medium mb-2">Avaliação por Critérios:</h5>
                                      <div className="space-y-1">
                                        {inscricao.avaliacao.checklistAvaliacao.map((item, index) => (
                                          <div key={index} className="text-sm flex justify-between">
                                            <span>{item.criterio} ({item.peso}%):</span>
                                            <span>{item.pontuacao}/10 pontos</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
                  </div>

                  {/* Ranking das Inscrições Aprovadas */}
                  {(() => {
                    const processInscricoes = inscricoes.filter(inscricao => inscricao.processoId === processoSelecionado);
                    const allEvaluated = processInscricoes.length > 0 && processInscricoes.every(inscricao => inscricao.status === "avaliado");
                    const hasApproved = processInscricoes.some(inscricao => inscricao.avaliacao?.status === 'aprovado');
                    
                    return allEvaluated && hasApproved && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Ranking Final das Inscrições Aprovadas
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Ranking gerado automaticamente após avaliação completa de todos os candidatos.
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button onClick={() => handleExportToExcel(processoSelecionado)} variant="outline" size="sm" className="gap-2">
                              <FileText className="h-4 w-4" />
                              Exportar Excel
                            </Button>
                            <Button onClick={() => handleExportToImage(processoSelecionado)} variant="outline" size="sm" className="gap-2">
                              <Download className="h-4 w-4" />
                              Exportar Imagem
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {inscricoes
                              .filter(inscricao => 
                                inscricao.processoId === processoSelecionado && 
                                inscricao.avaliacao?.status === 'aprovado'
                              )
                              .sort((a, b) => (b.avaliacao?.pontuacaoTotal || b.avaliacao?.pontuacao || 0) - (a.avaliacao?.pontuacaoTotal || a.avaliacao?.pontuacao || 0))
                              .map((inscricao, index) => {
                                const vaga = processos.find(p => p.id === inscricao.processoId)?.vagas.find(v => v.id === inscricao.vagaId);
                                return (
                                  <div key={inscricao.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                        index === 1 ? 'bg-gray-100 text-gray-800' :
                                        index === 2 ? 'bg-orange-100 text-orange-800' :
                                        'bg-muted text-muted-foreground'
                                      }`}>
                                        {index + 1}º
                                      </div>
                                      <div>
                                        <p className="font-medium">{inscricao.candidatoNome}</p>
                                        <p className="text-sm text-muted-foreground">{vaga?.cargo}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-lg">
                                        {inscricao.avaliacao?.pontuacaoTotal || inscricao.avaliacao?.pontuacao} pontos
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Avaliado em {new Date(inscricao.avaliacao?.dataAvaliacao || '').toLocaleDateString("pt-BR")}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingProcesso ? "Editar Processo Seletivo" : "Criar Novo Processo Seletivo"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do processo seletivo
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Básicas</h3>

                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Processo *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Processo Seletivo - Saúde e Educação 2026"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva o processo seletivo..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataAbertura">Data de Abertura *</Label>
                    <Input
                      id="dataAbertura"
                      type="date"
                      value={formData.dataAbertura}
                      onChange={(e) => setFormData({ ...formData, dataAbertura: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataEncerramento">Data de Encerramento *</Label>
                    <Input
                      id="dataEncerramento"
                      type="date"
                      value={formData.dataEncerramento}
                      onChange={(e) => setFormData({ ...formData, dataEncerramento: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "aberto" | "encerrado" | "emAndamento") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Inscrições Abertas</SelectItem>
                      <SelectItem value="emAndamento">Em Andamento</SelectItem>
                      <SelectItem value="encerrado">Encerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vagas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vagas</h3>

                {/* Adicionar Vaga */}
                <Card className="p-4">
                  <h4 className="font-medium mb-4">Adicionar Nova Vaga</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo *</Label>
                      <Input
                        id="cargo"
                        value={novaVaga.cargo}
                        onChange={(e) => setNovaVaga({ ...novaVaga, cargo: e.target.value })}
                        placeholder="Ex: Professor de Educação Infantil"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secretaria">Secretaria *</Label>
                      <Select
                        value={novaVaga.secretaria}
                        onValueChange={(value) => setNovaVaga({ ...novaVaga, secretaria: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a secretaria" />
                        </SelectTrigger>
                        <SelectContent>
                          {secretarias.map((secretaria) => (
                            <SelectItem key={secretaria} value={secretaria}>
                              {secretaria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        value={novaVaga.quantidade}
                        onChange={(e) => setNovaVaga({ ...novaVaga, quantidade: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salario">Salário *</Label>
                      <Input
                        id="salario"
                        value={novaVaga.salario}
                        onChange={(e) => setNovaVaga({ ...novaVaga, salario: e.target.value })}
                        placeholder="Ex: R$ 2.500,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargaHoraria">Carga Horária</Label>
                      <Input
                        id="cargaHoraria"
                        value={novaVaga.cargaHoraria}
                        onChange={(e) => setNovaVaga({ ...novaVaga, cargaHoraria: e.target.value })}
                        placeholder="Ex: 30h semanais"
                      />
                    </div>
                  </div>

                  {/* Requisitos */}
                  <div className="space-y-2 mb-4">
                    <Label>Requisitos</Label>
                    <div className="flex gap-2">
                      <Input
                        value={requisitoTemp}
                        onChange={(e) => setRequisitoTemp(e.target.value)}
                        placeholder="Ex: Licenciatura em Pedagogia"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddRequisito()}
                      />
                      <Button type="button" onClick={handleAddRequisito} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {novaVaga.requisitos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {novaVaga.requisitos.map((req, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {req}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleRemoveRequisito(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button onClick={handleAddVaga} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Vaga
                  </Button>
                </Card>

                {/* Lista de Vagas */}
                {formData.vagas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Vagas Adicionadas</h4>
                    <div className="space-y-2">
                      {formData.vagas.map((vaga) => (
                        <div key={vaga.id} className="p-3 border rounded-lg bg-muted/30 flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">{vaga.cargo}</h5>
                            <p className="text-sm text-muted-foreground">{vaga.secretaria} • {vaga.quantidade} vaga{vaga.quantidade > 1 ? 's' : ''} • {vaga.salario}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveVaga(vaga.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Documentos Necessários */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documentos Necessários</h3>

                <div className="flex gap-2">
                  <Input
                    value={documentoTemp}
                    onChange={(e) => setDocumentoTemp(e.target.value)}
                    placeholder="Ex: RG e CPF"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddDocumento()}
                  />
                  <Button type="button" onClick={handleAddDocumento} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.documentosNecessarios.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.documentosNecessarios.map((doc, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {doc}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveDocumento(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Edital */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Edital</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="editalLink">Link do Edital (opcional)</Label>
                    <div className="flex gap-2">
                      <LinkIcon className="h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        id="editalLink"
                        value={formData.editalLink}
                        onChange={(e) => setFormData({ ...formData, editalLink: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload do Edital (opcional)</Label>
                    <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Clique para fazer upload do edital (PDF)
                      </span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.editalArquivo && (
                      <p className="text-sm text-muted-foreground">
                        📎 {formData.editalArquivo.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                {editingProcesso ? "Salvar Alterações" : "Criar Processo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Avaliação */}
        <Dialog open={avaliacaoDialogOpen} onOpenChange={setAvaliacaoDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Avaliar Inscrição</DialogTitle>
              <DialogDescription>
                {inscricaoAvaliada && (
                  <>
                    Candidato: {inscricaoAvaliada.candidatoNome}<br />
                    Vaga: {processos.find(p => p.id === inscricaoAvaliada.processoId)?.vagas.find(v => v.id === inscricaoAvaliada.vagaId)?.cargo}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Status da Avaliação</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="aprovado"
                      checked={avaliacaoForm.status === "aprovado"}
                      onChange={(e) => setAvaliacaoForm({ ...avaliacaoForm, status: e.target.value as "aprovado" })}
                    />
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Aprovar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="reprovado"
                      checked={avaliacaoForm.status === "reprovado"}
                      onChange={(e) => setAvaliacaoForm({ ...avaliacaoForm, status: e.target.value as "reprovado" })}
                    />
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Reprovar</span>
                  </label>
                </div>
              </div>

              {/* Checklist de Avaliação */}
              {checklistAvaliacao.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Avaliação por Critérios</Label>
                    <div className="text-sm text-muted-foreground">
                      Pontuação Total: <span className="font-bold text-foreground">
                        {Math.round(checklistAvaliacao.reduce((total, item) => total + (item.pontuacao * item.peso / 100), 0) * 10) / 10} pontos
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {checklistAvaliacao.map((item, index) => (
                      <Card key={item.criterioId} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{item.criterio}</h4>
                            <Badge variant="outline">{item.peso}%</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm">Pontuação (0-10)</Label>
                              <Input
                                type="number"
                                min="0"
                                max="10"
                                step="0.5"
                                value={item.pontuacao}
                                onChange={(e) => {
                                  const newChecklist = [...checklistAvaliacao];
                                  newChecklist[index].pontuacao = parseFloat(e.target.value) || 0;
                                  setChecklistAvaliacao(newChecklist);
                                }}
                                className="text-center"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Pontuação Ponderada</Label>
                              <div className="flex items-center justify-center h-10 px-3 border rounded-md bg-muted">
                                <span className="font-medium">
                                  {(item.pontuacao * item.peso / 100).toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">Observações</Label>
                            <Textarea
                              value={item.observacao}
                              onChange={(e) => {
                                const newChecklist = [...checklistAvaliacao];
                                newChecklist[index].observacao = e.target.value;
                                setChecklistAvaliacao(newChecklist);
                              }}
                              placeholder="Observações sobre este critério..."
                              rows={2}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="parecer">Parecer Geral *</Label>
                <Textarea
                  id="parecer"
                  value={avaliacaoForm.parecer}
                  onChange={(e) => setAvaliacaoForm({ ...avaliacaoForm, parecer: e.target.value })}
                  placeholder="Digite o parecer geral da avaliação..."
                  rows={3}
                />
              </div>

              {avaliacaoForm.status === "reprovado" && (
                <div className="space-y-2">
                  <Label htmlFor="motivoReprovacao">Motivo da Reprovação *</Label>
                  <Textarea
                    id="motivoReprovacao"
                    value={avaliacaoForm.motivoReprovacao}
                    onChange={(e) => setAvaliacaoForm({ ...avaliacaoForm, motivoReprovacao: e.target.value })}
                    placeholder="Explique o motivo da reprovação..."
                    rows={2}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAvaliacaoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvarAvaliacao} className="gap-2">
                <Mail className="h-4 w-4" />
                Salvar 
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Email com Parecer */}
        <Dialog open={emailParecerDialogOpen} onOpenChange={setEmailParecerDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enviar Email com Parecer</DialogTitle>
              <DialogDescription>
                {inscricaoParaRevisao && (
                  <>Envie um email para {inscricaoParaRevisao.candidatoNome} informando sobre a validação documental.</>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Status da Avaliação */}
              <div>
                <Label className="text-base font-medium">Status da Avaliação</Label>
                <div className="flex gap-6 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="aprovado"
                      checked={emailParecerForm.status === "aprovado"}
                      onChange={(e) => setEmailParecerForm(prev => ({ ...prev, status: e.target.value as "aprovado" }))}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-green-700 font-medium">Aprovar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="reprovado"
                      checked={emailParecerForm.status === "reprovado"}
                      onChange={(e) => setEmailParecerForm(prev => ({ ...prev, status: e.target.value as "reprovado" }))}
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-red-700 font-medium">Reprovar</span>
                  </label>
                </div>
              </div>

              {/* Parecer */}
              <div>
                <Label htmlFor="parecer" className="text-base font-medium">Parecer</Label>
                <Textarea
                  id="parecer"
                  placeholder="Digite o parecer sobre a documentação..."
                  value={emailParecerForm.parecer}
                  onChange={(e) => setEmailParecerForm(prev => ({ ...prev, parecer: e.target.value }))}
                  className="mt-2 min-h-[120px]"
                  required
                />
              </div>

              {/* Preview do Email */}
              <div>
                <Label className="text-base font-medium">Preview do Email</Label>
                <div className="mt-2 p-4 bg-muted/30 rounded-lg border text-sm">
                  <div className="font-medium mb-2">
                    Assunto: {emailParecerForm.status === "aprovado"
                      ? "Documentação Aprovada - Processo Seletivo"
                      : "Documentação Reprovada - Processo Seletivo"}
                  </div>
                  <div className="whitespace-pre-line text-muted-foreground">
                    {emailParecerForm.status === "aprovado"
                      ? `Prezado(a) ${inscricaoParaRevisao?.candidatoNome},\n\nSua documentação foi aprovada para o processo seletivo.\n\nParecer: ${emailParecerForm.parecer || "[Digite o parecer]"}\n\nAgora você pode aguardar a avaliação por critérios.\n\nAtenciosamente,\nEquipe de Gestão`
                      : `Prezado(a) ${inscricaoParaRevisao?.candidatoNome},\n\nInfelizmente sua documentação foi reprovada para o processo seletivo.\n\nParecer: ${emailParecerForm.parecer || "[Digite o parecer]"}\n\nAtenciosamente,\nEquipe de Gestão`}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEmailParecerDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleEnviarEmailParecer}
                disabled={!emailParecerForm.parecer.trim()}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                Enviar Email com Parecer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Mensagens */}
        <Dialog open={mensagemDialogOpen} onOpenChange={setMensagemDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Comunicação com Candidato</DialogTitle>
              <DialogDescription>
                {mensagemInscricao && (
                  <>Candidato: {mensagemInscricao.candidatoNome}</>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Histórico de mensagens */}
              <div className="max-h-60 overflow-y-auto space-y-3">
                {mensagemInscricao?.mensagens.map((mensagem) => (
                  <div
                    key={mensagem.id}
                    className={`p-3 rounded-lg ${
                      mensagem.de === "gestor"
                        ? "bg-blue-50 ml-8"
                        : "bg-gray-50 mr-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">
                        {mensagem.de === "gestor" ? "Você" : "Candidato"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(mensagem.data).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-sm">{mensagem.mensagem}</p>
                  </div>
                ))}
                {(!mensagemInscricao?.mensagens || mensagemInscricao.mensagens.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma mensagem ainda.
                  </p>
                )}
              </div>

              {/* Enviar nova mensagem */}
              <div className="space-y-2">
                <Label htmlFor="novaMensagem">Nova Mensagem</Label>
                <Textarea
                  id="novaMensagem"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Digite sua mensagem para o candidato..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setMensagemDialogOpen(false)}>
                Fechar
              </Button>
              <Button
                onClick={handleEnviarMensagem}
                disabled={!novaMensagem.trim()}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                Enviar Mensagem
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Revisão de Documentos */}
        <Dialog open={documentReviewDialogOpen} onOpenChange={setDocumentReviewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Revisão de Documentos - {inscricaoParaRevisao?.candidatoNome}</DialogTitle>
              <DialogDescription>
                Revise os documentos enviados pelo candidato antes de prosseguir com a avaliação.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Dados do Candidato */}
              <div>
                <h4 className="font-medium mb-4">Dados do Candidato</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p>{inscricaoParaRevisao?.candidatoNome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CPF</p>
                    <p>{inscricaoParaRevisao?.candidatoCPF}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                    <p>{inscricaoParaRevisao?.candidatoEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p>{inscricaoParaRevisao?.candidatoTelefone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                    <p>{inscricaoParaRevisao?.candidatoDataNascimento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                    <p>{inscricaoParaRevisao?.candidatoEndereco}</p>
                  </div>
                </div>
              </div>

              {/* Lista de Documentos */}
              <div>
                <h4 className="font-medium mb-4">Documentos Enviados</h4>
                <div className="space-y-3">
                  {inscricaoParaRevisao?.documentos.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            Status: <Badge variant={doc.status === "aprovado" ? "default" : doc.status === "reprovado" ? "destructive" : "secondary"}>
                              {doc.status}
                            </Badge>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocumento(doc)}
                          className="gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Baixar
                        </Button>
                        {doc.status !== "aprovado" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAprovarDocumento(doc.nome)}
                            className="gap-1 text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Aprovar
                          </Button>
                        )}
                        {doc.status !== "reprovado" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReprovarDocumento(doc.nome)}
                            className="gap-1 text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-3 w-3" />
                            Reprovar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-center gap-3">
                <Button onClick={handleAprovarDocumentos} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Aprovar Documentos e Iniciar Avaliação
                </Button>
                <Button variant="destructive" onClick={handleReprovarInscricao} className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Reprovar Inscrição
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Resultados Detalhados */}
        <Dialog open={detailedResultsDialogOpen} onOpenChange={setDetailedResultsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Resultados Detalhados - {selectedProcessoForResults?.titulo}</DialogTitle>
              <DialogDescription>
                Classificação final com pontuação detalhada por critério.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {selectedProcessoForResults && (
                <div className="space-y-4">
                  {inscricoes
                    .filter(inscricao => 
                      inscricao.processoId === selectedProcessoForResults.id && 
                      inscricao.status === "avaliado" &&
                      inscricao.avaliacao?.status === "aprovado"
                    )
                    .sort((a, b) => (b.avaliacao?.pontuacaoTotal || 0) - (a.avaliacao?.pontuacaoTotal || 0))
                    .map((inscricao, index) => {
                      const checklist = inscricao.avaliacao?.checklistAvaliacao || [];
                      return (
                        <Card key={inscricao.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                  index === 1 ? 'bg-gray-100 text-gray-800' :
                                  index === 2 ? 'bg-orange-100 text-orange-800' :
                                  'bg-muted text-muted-foreground'
                                }`}>
                                  {index + 1}º
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{inscricao.candidatoNome}</CardTitle>
                                  <p className="text-sm text-muted-foreground">
                                    {processos.find(p => p.id === inscricao.processoId)?.vagas.find(v => v.id === inscricao.vagaId)?.cargo}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold">
                                  {inscricao.avaliacao?.pontuacaoTotal} pontos
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Total
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <h4 className="font-medium">Pontuação por Critério</h4>
                              {checklist.map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                                  <div>
                                    <p className="font-medium">{item.criterio}</p>
                                    <p className="text-sm text-muted-foreground">Peso: {item.peso}%</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">{item.pontuacao} pontos</p>
                                    <p className="text-xs text-muted-foreground">
                                      {(item.pontuacao * item.peso / 100).toFixed(1)} pontos ponderados
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {checklist.length === 0 && (
                                <p className="text-muted-foreground">Nenhuma avaliação por critérios registrada.</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  {inscricoes.filter(inscricao => 
                    inscricao.processoId === selectedProcessoForResults.id && 
                    inscricao.status === "avaliado" &&
                    inscricao.avaliacao?.status === "reprovado"
                  ).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-destructive">Candidatos Reprovados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {inscricoes
                            .filter(inscricao => 
                              inscricao.processoId === selectedProcessoForResults.id && 
                              inscricao.status === "avaliado" &&
                              inscricao.avaliacao?.status === "reprovado"
                            )
                            .map((inscricao) => (
                              <div key={inscricao.id} className="flex justify-between items-center p-2 border rounded">
                                <span>{inscricao.candidatoNome}</span>
                                <Badge variant="destructive">Reprovado</Badge>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}