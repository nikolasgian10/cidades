import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  FileText,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  Clock,
  Settings,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockSecretarias = [
  {
    id: "1",
    nome: "Secretaria de Obras",
    sigla: "SEMOB",
    responsavel: "João Silva",
    email: "obras@prefeitura.gov",
    telefone: "(11) 9999-8888",
    horario: "Seg-Sex: 8h às 17h",
    tiposServico: [
      { id: "1", nome: "Iluminação Pública", prioridade: "media", descricao: "Problemas com iluminação em vias públicas" },
      { id: "2", nome: "Buracos e Vias", prioridade: "alta", descricao: "Reparos de buracos, rachaduras e danos nas ruas" },
      { id: "3", nome: "Calçamento", prioridade: "media", descricao: "Problemas com calçamento e acessibilidade" },
    ],
  },
  {
    id: "2",
    nome: "Secretaria de Meio Ambiente",
    sigla: "SEMMA",
    responsavel: "Maria Santos",
    email: "meioambiente@prefeitura.gov",
    telefone: "(11) 8888-7777",
    horario: "Seg-Sex: 8h às 17h",
    tiposServico: [
      { id: "4", nome: "Poda de Árvores", prioridade: "baixa", descricao: "Solicitação de poda e manutenção de árvores" },
      { id: "5", nome: "Limpeza Urbana", prioridade: "media", descricao: "Limpeza de ruas, logradouros e espaços públicos" },
      { id: "6", nome: "Denúncia Ambiental", prioridade: "alta", descricao: "Denúncias de agressão ambiental e poluição" },
    ],
  },
  {
    id: "3",
    nome: "Secretaria de Fazenda",
    sigla: "SEFAZ",
    responsavel: "Carlos Oliveira",
    email: "fazenda@prefeitura.gov",
    telefone: "(11) 7777-6666",
    horario: "Seg-Sex: 8h às 17h",
    tiposServico: [
      { id: "7", nome: "Certidões", prioridade: "baixa", descricao: "Solicitação de certidões municipais" },
      { id: "8", nome: "IPTU", prioridade: "media", descricao: "Questões relacionadas a Imposto Predial Territorial Urbano" },
      { id: "9", nome: "ISS", prioridade: "media", descricao: "Questões relacionadas a Imposto Sobre Serviços" },
    ],
  },
];

const prioridadeConfig: Record<string, { label: string; color: string }> = {
  baixa: { label: "Baixa", color: "bg-gray-100 text-gray-700" },
  media: { label: "Média", color: "bg-blue-100 text-blue-700" },
  alta: { label: "Alta", color: "bg-orange-100 text-orange-700" },
  urgente: { label: "Urgente", color: "bg-red-100 text-red-700" },
};

export default function Secretarias() {
  console.log('Componente Secretarias renderizado');
  
  const [secretarias, setSecretarias] = useState(mockSecretarias);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSecretaria, setEditingSecretaria] = useState<typeof mockSecretarias[0] | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewSecretariaDialogOpen, setIsNewSecretariaDialogOpen] = useState(false);
  const [isTiposDialogOpen, setIsTiposDialogOpen] = useState(false);
  const [selectedSecretariaTipos, setSelectedSecretariaTipos] = useState<typeof mockSecretarias[0] | null>(null);
  const [newSecretaria, setNewSecretaria] = useState({
    nome: "",
    sigla: "",
    responsavel: "",
    email: "",
    telefone: "",
    horario: "",
  });
  
  // Estados para gerenciamento de tipos de protocolo
  const [allTiposProtocolo, setAllTiposProtocolo] = useState(() => {
    // Extrair todos os tipos das secretarias mock
    const tipos: Array<{id: string, nome: string, prioridade: string, descricao: string, secretariaId: string}> = [];
    mockSecretarias.forEach(sec => {
      sec.tiposServico.forEach(tipo => {
        tipos.push({
          id: tipo.id,
          nome: tipo.nome,
          prioridade: tipo.prioridade,
          descricao: tipo.descricao || "",
          secretariaId: sec.id
        });
      });
    });
    return tipos;
  });
  
  const [isNewTipoDialogOpen, setIsNewTipoDialogOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<typeof allTiposProtocolo[0] | null>(null);
  const [newTipo, setNewTipo] = useState({
    nome: "",
    prioridade: "media" as keyof typeof prioridadeConfig,
    descricao: "",
    secretariaId: "",
  });
  
  const filteredSecretarias = secretarias.filter((sec) =>
    sec.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.sigla.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEdit = (secretaria: typeof mockSecretarias[0]) => {
    setEditingSecretaria(secretaria);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (editingSecretaria) {
      setSecretarias(prev => prev.map(sec => 
        sec.id === editingSecretaria.id ? editingSecretaria : sec
      ));
      setIsEditDialogOpen(false);
      setEditingSecretaria(null);
      toast({
        title: "Sucesso",
        description: "Secretaria atualizada com sucesso!",
      });
    }
  };
  
  const handleNewSecretaria = () => {
    setIsNewSecretariaDialogOpen(true);
  };
  
  const handleSaveNewSecretaria = () => {
    if (newSecretaria.nome && newSecretaria.sigla) {
      const novaSecretaria = {
        id: Date.now().toString(),
        ...newSecretaria,
        tiposServico: [],
      };
      setSecretarias(prev => [...prev, novaSecretaria]);
      setIsNewSecretariaDialogOpen(false);
      setNewSecretaria({
        nome: "",
        sigla: "",
        responsavel: "",
        email: "",
        telefone: "",
        horario: "",
      });
      toast({
        title: "Sucesso",
        description: "Secretaria criada com sucesso!",
      });
    }
  };
  
  const handleTiposClick = () => {
    setSelectedSecretariaTipos(null); // Garante que seja null para mostrar gerenciamento completo
    setIsTiposDialogOpen(true);
  };
  
  const handleTiposSecretaria = (secretaria: typeof mockSecretarias[0]) => {
    setSelectedSecretariaTipos(secretaria);
    setIsTiposDialogOpen(true);
  };
  
  // Funções para gerenciamento de tipos de protocolo
  const handleNewTipo = () => {
    setNewTipo({
      nome: "",
      prioridade: "media",
      descricao: "",
      secretariaId: secretarias[0]?.id || "",
    });
    setIsNewTipoDialogOpen(true);
  };
  
  const handleEditTipo = (tipo: typeof allTiposProtocolo[0]) => {
    setEditingTipo(tipo);
    setNewTipo({
      nome: tipo.nome,
      prioridade: tipo.prioridade as keyof typeof prioridadeConfig,
      descricao: tipo.descricao,
      secretariaId: tipo.secretariaId,
    });
    setIsNewTipoDialogOpen(true);
  };
  
  const handleSaveTipo = () => {
    if (!newTipo.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome do tipo é obrigatório!",
        variant: "destructive",
      });
      return;
    }
    
    if (editingTipo) {
      // Editando tipo existente
      setAllTiposProtocolo(prev => prev.map(tipo => 
        tipo.id === editingTipo.id 
          ? { ...tipo, nome: newTipo.nome, prioridade: newTipo.prioridade, descricao: newTipo.descricao, secretariaId: newTipo.secretariaId }
          : tipo
      ));
      toast({
        title: "Sucesso",
        description: "Tipo de protocolo atualizado com sucesso!",
      });
    } else {
      // Criando novo tipo
      const novoTipo = {
        id: Date.now().toString(),
        nome: newTipo.nome,
        prioridade: newTipo.prioridade,
        descricao: newTipo.descricao,
        secretariaId: newTipo.secretariaId,
      };
      setAllTiposProtocolo(prev => [...prev, novoTipo]);
      toast({
        title: "Sucesso",
        description: "Tipo de protocolo criado com sucesso!",
      });
    }
    
    // Atualizar secretarias com os novos tipos
    updateSecretariasWithTipos();
    
    setIsNewTipoDialogOpen(false);
    setEditingTipo(null);
    setNewTipo({
      nome: "",
      prioridade: "media",
      descricao: "",
      secretariaId: secretarias[0]?.id || "",
    });
  };
  
  const handleDeleteTipo = (tipoId: string) => {
    setAllTiposProtocolo(prev => prev.filter(tipo => tipo.id !== tipoId));
    updateSecretariasWithTipos();
    toast({
      title: "Sucesso",
      description: "Tipo de protocolo removido com sucesso!",
    });
  };
  
  const updateSecretariasWithTipos = () => {
    setSecretarias(prev => prev.map(secretaria => ({
      ...secretaria,
      tiposServico: allTiposProtocolo
        .filter(tipo => tipo.secretariaId === secretaria.id)
        .map(tipo => ({
          id: tipo.id,
          nome: tipo.nome,
          prioridade: tipo.prioridade,
          descricao: tipo.descricao,
        }))
    })));
  };
  
  // Atualizar secretarias quando tipos mudam
  React.useEffect(() => {
    updateSecretariasWithTipos();
  }, [allTiposProtocolo]);
  
  return (
    <Layout>
      <div className="gov-container py-8">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">🏛️ Secretarias</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie secretarias e tipos de protocolo
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2" onClick={handleTiposClick}>
                <Settings className="h-4 w-4" />
                Tipos
              </Button>
              <Button className="gap-2" onClick={handleNewSecretaria}>
                <Plus className="h-4 w-4" />
                Nova Secretaria
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar secretaria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 max-w-md"
            />
          </div>

          <div className="mt-8">
            <h2>Secretarias encontradas: {filteredSecretarias.length}</h2>
            
            {/* Secretarias Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredSecretarias.map((secretaria) => (
                <div
                  key={secretaria.id}
                  className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{secretaria.nome}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{secretaria.sigla}</p>
                      </div>
                    </div>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleEdit(secretaria)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{secretaria.responsavel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{secretaria.email}</span>
                    </div>
                    {secretaria.telefone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{secretaria.telefone}</span>
                      </div>
                    )}
                    {secretaria.horario && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{secretaria.horario}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        {secretaria.tiposServico.length} tipos de protocolo
                      </span>
                    </div>
                    <button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded text-sm font-medium flex items-center justify-center gap-2"
                      onClick={() => handleTiposSecretaria(secretaria)}
                    >
                      <FileText className="h-4 w-4" />
                      Tipos de Protocolo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Secretaria</DialogTitle>
            <DialogDescription>
              Atualize as informações da secretaria selecionada.
            </DialogDescription>
          </DialogHeader>
          
          {editingSecretaria && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nome" className="text-right">
                  Nome
                </Label>
                <Input
                  id="nome"
                  value={editingSecretaria.nome}
                  onChange={(e) => setEditingSecretaria({...editingSecretaria, nome: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sigla" className="text-right">
                  Sigla
                </Label>
                <Input
                  id="sigla"
                  value={editingSecretaria.sigla}
                  onChange={(e) => setEditingSecretaria({...editingSecretaria, sigla: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsavel" className="text-right">
                  Responsável
                </Label>
                <Input
                  id="responsavel"
                  value={editingSecretaria.responsavel}
                  onChange={(e) => setEditingSecretaria({...editingSecretaria, responsavel: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editingSecretaria.email}
                  onChange={(e) => setEditingSecretaria({...editingSecretaria, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefone" className="text-right">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  value={editingSecretaria.telefone}
                  onChange={(e) => setEditingSecretaria({...editingSecretaria, telefone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="horario" className="text-right">
                  Horário
                </Label>
                <Input
                  id="horario"
                  value={editingSecretaria.horario}
                  onChange={(e) => setEditingSecretaria({...editingSecretaria, horario: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Secretaria Dialog */}
      <Dialog open={isNewSecretariaDialogOpen} onOpenChange={setIsNewSecretariaDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Secretaria</DialogTitle>
            <DialogDescription>
              Adicione uma nova secretaria ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-nome" className="text-right">
                Nome *
              </Label>
              <Input
                id="new-nome"
                value={newSecretaria.nome}
                onChange={(e) => setNewSecretaria({...newSecretaria, nome: e.target.value})}
                className="col-span-3"
                placeholder="Nome da secretaria"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-sigla" className="text-right">
                Sigla *
              </Label>
              <Input
                id="new-sigla"
                value={newSecretaria.sigla}
                onChange={(e) => setNewSecretaria({...newSecretaria, sigla: e.target.value})}
                className="col-span-3"
                placeholder="Ex: SEMOB"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-responsavel" className="text-right">
                Responsável
              </Label>
              <Input
                id="new-responsavel"
                value={newSecretaria.responsavel}
                onChange={(e) => setNewSecretaria({...newSecretaria, responsavel: e.target.value})}
                className="col-span-3"
                placeholder="Nome do responsável"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-email" className="text-right">
                Email
              </Label>
              <Input
                id="new-email"
                value={newSecretaria.email}
                onChange={(e) => setNewSecretaria({...newSecretaria, email: e.target.value})}
                className="col-span-3"
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-telefone" className="text-right">
                Telefone
              </Label>
              <Input
                id="new-telefone"
                value={newSecretaria.telefone}
                onChange={(e) => setNewSecretaria({...newSecretaria, telefone: e.target.value})}
                className="col-span-3"
                placeholder="(11) 9999-8888"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-horario" className="text-right">
                Horário
              </Label>
              <Input
                id="new-horario"
                value={newSecretaria.horario}
                onChange={(e) => setNewSecretaria({...newSecretaria, horario: e.target.value})}
                className="col-span-3"
                placeholder="Seg-Sex: 8h às 17h"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewSecretariaDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNewSecretaria}>
              Criar Secretaria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tipos Dialog */}
      <Dialog open={isTiposDialogOpen} onOpenChange={setIsTiposDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSecretariaTipos ? `Tipos de Protocolo - ${selectedSecretariaTipos.nome}` : 'Gerenciar Tipos de Protocolo'}
            </DialogTitle>
            <DialogDescription>
              {selectedSecretariaTipos 
                ? `Visualize os tipos de protocolo disponíveis para esta secretaria.`
                : 'Gerencie todos os tipos de protocolo do sistema - crie, edite e mova entre secretarias.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedSecretariaTipos ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Tipos de Serviço</h3>
                  <Badge variant="secondary">
                    {selectedSecretariaTipos.tiposServico.length} tipos
                  </Badge>
                </div>
                
                {selectedSecretariaTipos.tiposServico.length > 0 ? (
                  <div className="grid gap-3">
                    {selectedSecretariaTipos.tiposServico.map((tipo) => (
                      <div key={tipo.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{tipo.nome}</span>
                        </div>
                        <Badge className={prioridadeConfig[tipo.prioridade]?.color || "bg-gray-100"}>
                          {prioridadeConfig[tipo.prioridade]?.label || tipo.prioridade}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum tipo de protocolo cadastrado para esta secretaria.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Todos os Tipos de Protocolo</h3>
                  <Badge variant="secondary">
                    {allTiposProtocolo.length} tipos
                  </Badge>
                </div>
                
                {allTiposProtocolo.length > 0 ? (
                  <div className="space-y-4">
                    {secretarias.map((secretaria) => {
                      const tiposDaSecretaria = allTiposProtocolo.filter(tipo => tipo.secretariaId === secretaria.id);
                      if (tiposDaSecretaria.length === 0) return null;
                      
                      return (
                        <div key={secretaria.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">{secretaria.nome}</h4>
                            <Badge variant="outline">{tiposDaSecretaria.length}</Badge>
                          </div>
                          
                          <div className="grid gap-2">
                            {tiposDaSecretaria.map((tipo) => (
                              <div key={tipo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <span className="font-medium block">{tipo.nome}</span>
                                    <span className="text-xs text-muted-foreground">{tipo.descricao}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={prioridadeConfig[tipo.prioridade]?.color || "bg-gray-100"}>
                                    {prioridadeConfig[tipo.prioridade]?.label || tipo.prioridade}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditTipo(tipo)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteTipo(tipo.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum tipo de protocolo cadastrado no sistema.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsTiposDialogOpen(false);
              setSelectedSecretariaTipos(null);
            }}>
              Fechar
            </Button>
            {!selectedSecretariaTipos && (
              <Button onClick={handleNewTipo}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Tipo
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New/Edit Tipo Dialog */}
      <Dialog open={isNewTipoDialogOpen} onOpenChange={setIsNewTipoDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTipo ? 'Editar Tipo de Protocolo' : 'Novo Tipo de Protocolo'}
            </DialogTitle>
            <DialogDescription>
              {editingTipo 
                ? 'Atualize as informações do tipo de protocolo.'
                : 'Crie um novo tipo de protocolo e associe a uma secretaria.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo-nome" className="text-right">
                Nome *
              </Label>
              <Input
                id="tipo-nome"
                value={newTipo.nome}
                onChange={(e) => setNewTipo({...newTipo, nome: e.target.value})}
                className="col-span-3"
                placeholder="Ex: Iluminação Pública"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="tipo-descricao" className="text-right pt-2">
                Descrição
              </Label>
              <Textarea
                id="tipo-descricao"
                value={newTipo.descricao}
                onChange={(e) => setNewTipo({...newTipo, descricao: e.target.value})}
                className="col-span-3"
                placeholder="Descreva brevemente este tipo de protocolo..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo-prioridade" className="text-right">
                Prioridade
              </Label>
              <Select
                value={newTipo.prioridade}
                onValueChange={(value: keyof typeof prioridadeConfig) => setNewTipo({...newTipo, prioridade: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo-secretaria" className="text-right">
                Secretaria
              </Label>
              <Select
                value={newTipo.secretariaId}
                onValueChange={(value) => setNewTipo({...newTipo, secretariaId: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma secretaria" />
                </SelectTrigger>
                <SelectContent>
                  {secretarias.map((secretaria) => (
                    <SelectItem key={secretaria.id} value={secretaria.id}>
                      {secretaria.nome} ({secretaria.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsNewTipoDialogOpen(false);
              setEditingTipo(null);
              setNewTipo({
                nome: "",
                prioridade: "media",
                descricao: "",
                secretariaId: secretarias[0]?.id || "",
              });
            }}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTipo}>
              {editingTipo ? 'Salvar Alterações' : 'Criar Tipo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
