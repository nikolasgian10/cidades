import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  EyeOff,
  Star,
  Search,
  MoreHorizontal,
  Image,
  Calendar,
  Newspaper,
  TrendingUp,
  FileText,
  Eye,
  Clock,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const mockNoticias = [
  {
    id: "1",
    titulo: "Novo sistema de protocolo digital entra em operação",
    resumo: "A Prefeitura lança plataforma Cidade Online para modernizar o atendimento ao cidadão.",
    conteudo: "O novo sistema de protocolo digital foi desenvolvido para otimizar o atendimento aos cidadãos, permitindo solicitações online 24 horas por dia.",
    categoria: "Tecnologia",
    status: "publicado",
    destaque: true,
    data: "2026-01-18",
  },
  {
    id: "2",
    titulo: "Campanha de vacinação contra gripe começa segunda-feira",
    resumo: "Todas as unidades de saúde estarão preparadas para atender a população.",
    conteudo: "A campanha de vacinação contra gripe terá início na próxima segunda-feira em todas as unidades de saúde do município.",
    categoria: "Saúde",
    status: "publicado",
    destaque: false,
    data: "2026-01-17",
  },
  {
    id: "3",
    titulo: "Obras de pavimentação no bairro Centro",
    resumo: "Melhorias na infraestrutura viária terão início nesta semana.",
    conteudo: "As obras de pavimentação no bairro Centro estão programadas para começar nesta semana, melhorando a mobilidade urbana.",
    categoria: "Obras",
    status: "rascunho",
    destaque: false,
    data: "2026-01-16",
  },
];

const categorias = [
  "Geral",
  "Serviços",
  "Eventos",
  "Obras",
  "Saúde",
  "Educação",
  "Meio Ambiente",
  "Cultura",
  "Esporte",
  "Tecnologia",
];

export default function GestaoNoticias() {
  const [noticias, setNoticias] = useState(mockNoticias);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");
  const [noticiaDialogOpen, setNoticiaDialogOpen] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [noticiaForm, setNoticiaForm] = useState({
    titulo: "",
    resumo: "",
    conteudo: "",
    categoria: "Geral",
    destaque: false,
    visivel: true,
    imagem: null,
  });

  const stats = {
    total: noticias.length,
    publicadas: noticias.filter((n) => n.status === "publicado").length,
    destaque: noticias.filter((n) => n.destaque).length,
    rascunhos: noticias.filter((n) => n.status === "rascunho").length,
  };

  const filteredNoticias = noticias.filter(
    (noticia) => {
      // Filtro de busca por texto
      const matchesSearch = noticia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        noticia.categoria.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtro de status
      const matchesStatus = statusFilter === "todas" || 
        (statusFilter === "publicado" && noticia.status === "publicado") ||
        (statusFilter === "rascunho" && noticia.status === "rascunho") ||
        (statusFilter === "destaque" && noticia.destaque);
      
      // Filtro de categoria
      const matchesCategoria = categoriaFilter === "todas" || 
        noticia.categoria.toLowerCase() === categoriaFilter.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesCategoria;
    }
  );

  const handleSaveNoticia = () => {
    if (!noticiaForm.titulo.trim() || !noticiaForm.conteudo.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o título e o conteúdo da notícia.",
        variant: "destructive",
      });
      return;
    }

    if (editingNoticia) {
      // Edit existing news
      setNoticias(prev => prev.map(noticia => 
        noticia.id === editingNoticia.id 
          ? {
              ...noticia,
              titulo: noticiaForm.titulo,
              resumo: noticiaForm.resumo,
              conteudo: noticiaForm.conteudo,
              categoria: noticiaForm.categoria,
              destaque: noticiaForm.destaque,
              status: noticiaForm.visivel ? "publicado" : "rascunho",
            }
          : noticia
      ));
      toast({
        title: "Notícia atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Create new news
      const newNoticia = {
        id: Date.now().toString(),
        titulo: noticiaForm.titulo,
        resumo: noticiaForm.resumo,
        conteudo: noticiaForm.conteudo,
        categoria: noticiaForm.categoria,
        status: noticiaForm.visivel ? "publicado" : "rascunho",
        destaque: noticiaForm.destaque,
        data: new Date().toISOString().split('T')[0],
      };
      setNoticias(prev => [...prev, newNoticia]);
      toast({
        title: noticiaForm.visivel ? "Notícia publicada!" : "Rascunho salvo!",
        description: noticiaForm.visivel 
          ? "A notícia foi publicada e está visível para todos." 
          : "A notícia foi salva como rascunho.",
      });
    }
    
    // Reset form
    setNoticiaForm({
      titulo: "",
      resumo: "",
      conteudo: "",
      categoria: "Geral",
      destaque: false,
      visivel: true,
      imagem: null,
    });
    setSelectedFile(null);
    setEditingNoticia(null);
    setNoticiaDialogOpen(false);
  };

  const handleEditNoticia = (noticia) => {
    setEditingNoticia(noticia);
    setSelectedFile(null);
    setNoticiaForm({
      titulo: noticia.titulo,
      resumo: noticia.resumo || "",
      conteudo: noticia.conteudo || "",
      categoria: noticia.categoria,
      destaque: noticia.destaque,
      visivel: noticia.status === "publicado",
      imagem: null,
    });
    setNoticiaDialogOpen(true);
  };

  const handleDestacar = (id: string) => {
    setNoticias(prev => prev.map(noticia => 
      noticia.id === id 
        ? { ...noticia, destaque: !noticia.destaque }
        : noticia
    ));
    const noticia = noticias.find(n => n.id === id);
    toast({
      title: noticia?.destaque ? "Destaque removido!" : "Notícia destacada!",
      description: noticia?.destaque 
        ? "A notícia não aparecerá mais em destaque." 
        : "A notícia aparecerá em destaque na página inicial.",
    });
  };

  const handleDespublicar = (id: string) => {
    setNoticias(prev => prev.map(noticia => 
      noticia.id === id 
        ? { ...noticia, status: "rascunho" }
        : noticia
    ));
    toast({
      title: "Notícia despublicada!",
      description: "A notícia não está mais visível publicamente.",
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">📰 Gestão de Notícias</h1>
                <p className="text-muted-foreground mt-1">
                  Publique notícias e mantenha a comunidade informada
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => setNoticiaDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nova Notícia
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                    <p className="text-sm text-blue-600/70 dark:text-blue-400/70 font-medium">Total de Notícias</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.publicadas}</p>
                    <p className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">Publicadas</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.destaque}</p>
                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70 font-medium">Em Destaque</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.rascunhos}</p>
                    <p className="text-sm text-gray-600/70 dark:text-gray-400/70 font-medium">Rascunhos</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-500/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar notícias por título ou categoria..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="publicado">Publicadas</SelectItem>
                    <SelectItem value="rascunho">Rascunhos</SelectItem>
                    <SelectItem value="destaque">Em Destaque</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Categorias</SelectItem>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notícias List */}
          <div className="space-y-4">
            {filteredNoticias.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Newspaper className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma notícia encontrada
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery 
                      ? "Tente ajustar os filtros de busca ou criar uma nova notícia."
                      : "Comece criando sua primeira notícia para manter a comunidade informada."
                    }
                  </p>
                  <Button onClick={() => setNoticiaDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Primeira Notícia
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredNoticias.map((noticia, index) => (
                <motion.div
                  key={noticia.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge
                              variant={noticia.status === "publicado" ? "default" : "secondary"}
                              className={noticia.status === "publicado" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                            >
                              {noticia.status === "publicado" ? "✅ Publicado" : "📝 Rascunho"}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              📂 {noticia.categoria}
                            </Badge>
                            {noticia.destaque && (
                              <Badge className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-300">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                ⭐ Destaque
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                            {noticia.titulo}
                          </h3>
                          <p className="text-muted-foreground mb-3 leading-relaxed">
                            {noticia.resumo}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(noticia.data).toLocaleDateString("pt-BR")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {Math.floor(Math.random() * 500) + 100} visualizações
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50 hover:border-blue-300" onClick={() => handleEditNoticia(noticia)}>
                            <Edit className="h-4 w-4" />
                            Editar
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleDespublicar(noticia.id)} className="gap-2">
                                <EyeOff className="h-4 w-4" />
                                Despublicar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDestacar(noticia.id)} className="gap-2">
                                <Star className="h-4 w-4" />
                                {noticia.destaque ? "Remover Destaque" : "Destacar"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 gap-2 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Nova Notícia Dialog */}
      <Dialog open={noticiaDialogOpen} onOpenChange={setNoticiaDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                {editingNoticia ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-xl">{editingNoticia ? "Editar Notícia" : "Criar Nova Notícia"}</DialogTitle>
                <DialogDescription>
                  {editingNoticia ? "Atualize os detalhes da notícia" : "Preencha os detalhes da notícia para publicar"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6 py-4 overflow-y-auto max-h-[60vh] pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="noticia-titulo" className="text-sm font-medium">
                  Título da Notícia *
                </Label>
                <Input
                  id="noticia-titulo"
                  value={noticiaForm.titulo}
                  onChange={(e) => setNoticiaForm({ ...noticiaForm, titulo: e.target.value })}
                  placeholder="Digite um título atrativo"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="noticia-categoria" className="text-sm font-medium">
                  Categoria
                </Label>
                <Select
                  value={noticiaForm.categoria}
                  onValueChange={(value) => setNoticiaForm({ ...noticiaForm, categoria: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        📂 {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="noticia-resumo" className="text-sm font-medium">
                Resumo da Notícia
              </Label>
              <Textarea
                id="noticia-resumo"
                value={noticiaForm.resumo}
                onChange={(e) => setNoticiaForm({ ...noticiaForm, resumo: e.target.value })}
                placeholder="Breve descrição que aparecerá nas listagens..."
                className="min-h-20 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {noticiaForm.resumo.length}/200 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="noticia-conteudo" className="text-sm font-medium">
                Conteúdo Completo *
              </Label>
              <Textarea
                id="noticia-conteudo"
                value={noticiaForm.conteudo}
                onChange={(e) => setNoticiaForm({ ...noticiaForm, conteudo: e.target.value })}
                placeholder="Digite o conteúdo completo da notícia..."
                className="min-h-40 resize-none"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Imagem de Destaque</Label>
              <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Image className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                    {selectedFile ? selectedFile.name : "Clique para enviar imagem"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG até 5MB
                  </p>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setNoticiaForm({ ...noticiaForm, imagem: file });
                    }
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-amber-500" />
                  <div>
                    <Label htmlFor="noticia-destaque" className="text-sm font-medium cursor-pointer">
                      Notícia em Destaque
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Aparecerá na página inicial
                    </p>
                  </div>
                </div>
                <Switch
                  id="noticia-destaque"
                  checked={noticiaForm.destaque}
                  onCheckedChange={(checked) => setNoticiaForm({ ...noticiaForm, destaque: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-green-500" />
                  <div>
                    <Label htmlFor="noticia-visivel" className="text-sm font-medium cursor-pointer">
                      Publicar Imediatamente
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Visível para todos os usuários
                    </p>
                  </div>
                </div>
                <Switch
                  id="noticia-visivel"
                  checked={noticiaForm.visivel}
                  onCheckedChange={(checked) => setNoticiaForm({ ...noticiaForm, visivel: checked })}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => { 
              setNoticiaDialogOpen(false); 
              setEditingNoticia(null);
              setSelectedFile(null);
              setNoticiaForm({
                titulo: "",
                resumo: "",
                conteudo: "",
                categoria: "Geral",
                destaque: false,
                visivel: true,
                imagem: null,
              });
            }} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSaveNoticia} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              {editingNoticia ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingNoticia ? "Salvar Alterações" : (noticiaForm.visivel ? "Publicar Notícia" : "Salvar Rascunho")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
