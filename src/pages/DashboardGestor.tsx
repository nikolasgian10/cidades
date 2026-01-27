import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  Users,
  Building2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Download,
  FileImage,
  FileSpreadsheet,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Mock data para gráficos
const evolucaoProtocolos = [
  { dia: "12/01", abertos: 12, concluidos: 8 },
  { dia: "13/01", abertos: 15, concluidos: 10 },
  { dia: "14/01", abertos: 8, concluidos: 12 },
  { dia: "15/01", abertos: 20, concluidos: 15 },
  { dia: "16/01", abertos: 18, concluidos: 14 },
  { dia: "17/01", abertos: 25, concluidos: 18 },
  { dia: "18/01", abertos: 22, concluidos: 20 },
];

const protocolosPorSecretaria = [
  { secretaria: "Obras", quantidade: 45, concluidos: 32 },
  { secretaria: "Saúde", quantidade: 38, concluidos: 28 },
  { secretaria: "Educação", quantidade: 25, concluidos: 20 },
  { secretaria: "Meio Ambiente", quantidade: 30, concluidos: 22 },
  { secretaria: "Fazenda", quantidade: 18, concluidos: 15 },
  { secretaria: "Assistência Social", quantidade: 22, concluidos: 18 },
];

const protocolosPorStatus = [
  { name: "Abertos", value: 35, color: "#f59e0b" },
  { name: "Em Andamento", value: 48, color: "#3b82f6" },
  { name: "Concluídos", value: 120, color: "#22c55e" },
  { name: "Cancelados", value: 12, color: "#ef4444" },
];

const protocolosPorTipo = [
  { tipo: "Iluminação", quantidade: 28 },
  { tipo: "Limpeza", quantidade: 22 },
  { tipo: "Buracos", quantidade: 35 },
  { tipo: "Poda", quantidade: 15 },
  { tipo: "Fiscalização", quantidade: 18 },
  { tipo: "Certidões", quantidade: 12 },
  { tipo: "Alvarás", quantidade: 8 },
  { tipo: "Outros", quantidade: 20 },
];

const comparacaoSecretarias = [
  { secretaria: "Obras", abertos: 15, emAndamento: 18, concluidos: 32 },
  { secretaria: "Saúde", abertos: 10, emAndamento: 12, concluidos: 28 },
  { secretaria: "Educação", abertos: 8, emAndamento: 6, concluidos: 20 },
  { secretaria: "Meio Ambiente", abertos: 12, emAndamento: 10, concluidos: 22 },
  { secretaria: "Fazenda", abertos: 5, emAndamento: 4, concluidos: 15 },
];

const finalizadosPorSecretaria = [
  { secretaria: "Obras", total: 32 },
  { secretaria: "Saúde", total: 28 },
  { secretaria: "Meio Ambiente", total: 22 },
  { secretaria: "Educação", total: 20 },
  { secretaria: "Assistência Social", total: 18 },
  { secretaria: "Fazenda", total: 15 },
];

const protocolosPorRegiao = [
  { regiao: "Centro", quantidade: 45, lat: -23.5505, lng: -46.6333 },
  { regiao: "Zona Norte", quantidade: 38, lat: -23.5205, lng: -46.6333 },
  { regiao: "Zona Sul", quantidade: 52, lat: -23.5805, lng: -46.6333 },
  { regiao: "Zona Leste", quantidade: 41, lat: -23.5505, lng: -46.5833 },
  { regiao: "Zona Oeste", quantidade: 39, lat: -23.5505, lng: -46.6833 },
];

const taxaResolucaoPrazo = [
  { periodo: "Dentro do Prazo", quantidade: 145, color: "#22c55e" },
  { periodo: "Fora do Prazo", quantidade: 35, color: "#ef4444" },
];

const protocolosPorPeriodo = [
  { periodo: "Seg", quantidade: 12 },
  { periodo: "Ter", quantidade: 18 },
  { periodo: "Qua", quantidade: 15 },
  { periodo: "Qui", quantidade: 22 },
  { periodo: "Sex", quantidade: 28 },
  { periodo: "Sáb", quantidade: 8 },
  { periodo: "Dom", quantidade: 3 },
];

const COLORS = ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444"];

export default function DashboardGestor() {
  const { user } = useAuth();
  const [periodoSelecionado, setPeriodoSelecionado] = useState("7dias");

  const produtividadeAtendentes = [
    { atendente: user?.nome || "João Silva", protocolos: 45, eficiencia: 92 },
    { atendente: "Maria Santos", protocolos: 38, eficiencia: 88 },
    { atendente: "Carlos Oliveira", protocolos: 52, eficiencia: 95 },
    { atendente: "Ana Costa", protocolos: 29, eficiencia: 85 },
    { atendente: "Pedro Lima", protocolos: 41, eficiencia: 90 },
  ];

  const getChartData = (chartType: string) => {
    switch (chartType) {
      case 'evolucao':
        return evolucaoProtocolos;
      case 'status':
        return protocolosPorStatus;
      case 'secretaria':
        return protocolosPorSecretaria;
      case 'tipo':
        return protocolosPorTipo;
      case 'comparacao':
        return comparacaoSecretarias;
      case 'finalizados':
        return finalizadosPorSecretaria;
      case 'produtividade':
        return produtividadeAtendentes;
      case 'resolucao':
        return taxaResolucaoPrazo;
      case 'periodo':
        return protocolosPorPeriodo;
      case 'regiao':
        return protocolosPorRegiao;
      default:
        return [];
    }
  };

  const exportToExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportToImage = async (chartId: string, filename: string) => {
    const element = document.getElementById(chartId);
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL();
        link.click();
        toast({
          title: "Imagem exportada!",
          description: `O gráfico foi salvo como ${filename}.png`,
        });
      } catch (error) {
        toast({
          title: "Erro na exportação",
          description: "Não foi possível exportar a imagem.",
          variant: "destructive",
        });
      }
    }
  };

  const exportChart = (chartType: string, format: 'excel' | 'image') => {
    const data = getChartData(chartType);
    const chartNames: { [key: string]: string } = {
      'evolucao': 'Evolução de Protocolos',
      'status': 'Protocolos por Status',
      'secretaria': 'Protocolos por Secretaria',
      'tipo': 'Protocolos por Tipo',
      'comparacao': 'Comparação por Secretaria',
      'finalizados': 'Finalizados por Secretaria',
      'produtividade': 'Produtividade dos Atendentes',
      'resolucao': 'Taxa de Resolução no Prazo',
      'periodo': 'Protocolos por Período',
      'regiao': 'Protocolos por Região'
    };

    const filename = chartNames[chartType] || chartType;

    if (format === 'excel') {
      exportToExcel(data, filename);
      toast({
        title: "Excel exportado!",
        description: `Os dados foram salvos como ${filename}.xlsx`,
      });
    } else {
      exportToImage(`chart-${chartType}`, filename);
    }
  };

  const exportAllCharts = (format: 'excel' | 'image') => {
    const allCharts = ['evolucao', 'status', 'secretaria', 'tipo', 'comparacao', 'finalizados', 'produtividade', 'resolucao', 'periodo', 'regiao'];

    if (format === 'excel') {
      // Criar um workbook com múltiplas sheets
      const wb = XLSX.utils.book_new();

      allCharts.forEach(chartType => {
        const data = getChartData(chartType);
        const ws = XLSX.utils.json_to_sheet(data);
        const chartNames: { [key: string]: string } = {
          'evolucao': 'Evolução',
          'status': 'Status',
          'secretaria': 'Secretaria',
          'tipo': 'Tipo',
          'comparacao': 'Comparação',
          'finalizados': 'Finalizados',
          'produtividade': 'Produtividade',
          'resolucao': 'Resolução',
          'periodo': 'Período',
          'regiao': 'Região'
        };
        XLSX.utils.book_append_sheet(wb, ws, chartNames[chartType] || chartType);
      });

      XLSX.writeFile(wb, 'Dashboard_Completo.xlsx');
      toast({
        title: "Excel completo exportado!",
        description: "Todos os dados foram salvos em Dashboard_Completo.xlsx",
      });
    } else {
      // Para imagens, exportar uma por uma com delay
      allCharts.forEach((chartType, index) => {
        setTimeout(() => {
          exportChart(chartType, 'image');
        }, index * 1000); // 1 segundo de delay entre cada exportação
      });
    }
  };

  const stats = {
    totalProtocolos: 215,
    protocolosAbertos: 35,
    protocolosAndamento: 48,
    protocolosConcluidos: 120,
    tempoMedioResposta: "2.5 dias",
    taxaConclusao: "85%",
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
              <h1 className="text-3xl font-bold text-foreground">📊 Dashboard Gestor</h1>
              <p className="text-muted-foreground mt-1">
                Olá, {user?.nome || "Gestor"}! Aqui está a visão geral dos protocolos e indicadores
              </p>
            </div>
            <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="15dias">Últimos 15 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProtocolos}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.protocolosAbertos}</p>
                  <p className="text-xs text-muted-foreground">Abertos</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.protocolosAndamento}</p>
                  <p className="text-xs text-muted-foreground">Andamento</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.protocolosConcluidos}</p>
                  <p className="text-xs text-muted-foreground">Concluídos</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.tempoMedioResposta}</p>
                  <p className="text-xs text-muted-foreground">Tempo Médio</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.taxaConclusao}</p>
                  <p className="text-xs text-muted-foreground">Taxa Conclusão</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Gráficos - Primeira Linha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Evolução de Protocolos - Últimos 7 dias */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Evolução de Protocolos - Últimos 7 dias
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('evolucao', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('evolucao', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-evolucao">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolucaoProtocolos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="abertos" stroke="#f59e0b" name="Abertos" strokeWidth={2} />
                    <Line type="monotone" dataKey="concluidos" stroke="#22c55e" name="Concluídos" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Protocolos por Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Protocolos por Status
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('status', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('status', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-status">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={protocolosPorStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {protocolosPorStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos - Segunda Linha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Protocolos por Secretaria */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Protocolos por Secretaria
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('secretaria', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('secretaria', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-secretaria">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={protocolosPorSecretaria} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="secretaria" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#3b82f6" name="Total" />
                    <Bar dataKey="concluidos" fill="#22c55e" name="Concluídos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Protocolos por Tipo de Serviço */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Protocolos por Tipo de Serviço
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('tipo', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('tipo', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-tipo">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={protocolosPorTipo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#8b5cf6" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos - Terceira Linha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Comparação Abertos vs Andamento por Secretaria */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Abertos vs Em Andamento por Secretaria
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('comparacao', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('comparacao', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-comparacao">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparacaoSecretarias}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="secretaria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="abertos" fill="#f59e0b" name="Abertos" />
                    <Bar dataKey="emAndamento" fill="#3b82f6" name="Em Andamento" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Finalizados por Secretaria */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Finalizados por Secretaria
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('finalizados', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('finalizados', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-finalizados">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={finalizadosPorSecretaria} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="secretaria" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#22c55e" name="Finalizados" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Novos Gráficos Solicitados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Produtividade Individual dos Atendentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Produtividade dos Atendentes
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('produtividade', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('produtividade', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-produtividade">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={produtividadeAtendentes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="atendente" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, name === 'protocolos' ? 'Protocolos' : 'Eficiência (%)']} />
                    <Bar dataKey="protocolos" fill="#3b82f6" name="Protocolos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Taxa de Resolução no Prazo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Taxa de Resolução no Prazo
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('resolucao', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('resolucao', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-resolucao">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taxaResolucaoPrazo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {taxaResolucaoPrazo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Protocolos por Período */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Protocolos por Período (Semana)
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('periodo', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('periodo', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-periodo">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={protocolosPorPeriodo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="quantidade" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Protocolos por Região/Bairro - Mapa Simulado */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Protocolos por Região
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportChart('regiao', 'excel')}>
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportChart('regiao', 'image')}>
                      <FileImage className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent id="chart-regiao">
                <div className="space-y-4">
                  {protocolosPorRegiao.map((regiao, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">{regiao.regiao}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{regiao.quantidade} protocolos</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(regiao.quantidade / 52) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  * Mapa geográfico completo disponível em versão premium
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Botões de Export Geral */}
          <div className="flex justify-center gap-4 mb-8">
            <Button variant="outline" onClick={() => exportAllCharts('excel')} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Todos (Excel)
            </Button>
            <Button variant="outline" onClick={() => exportAllCharts('image')} className="gap-2">
              <FileImage className="h-4 w-4" />
              Exportar Todos (Imagem)
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
