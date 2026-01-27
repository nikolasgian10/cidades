import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  KeyRound,
  Mail,
  Building2,
  User,
  Shield,
  MoreHorizontal,
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
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockUsers = [
  { id: "1", nome: "João Silva", email: "joao@email.com", cpf: "123.456.789-00", role: "cidadao", secretaria: null, status: "ativo" },
  { id: "2", nome: "Maria Santos", email: "maria@prefeitura.gov", cpf: "987.654.321-00", role: "gestor", secretaria: "Obras", status: "ativo" },
  { id: "3", nome: "Carlos Oliveira", email: "carlos@prefeitura.gov", cpf: "456.789.123-00", role: "admin", secretaria: null, status: "ativo" },
  { id: "4", nome: "Ana Costa", email: "ana@prefeitura.gov", cpf: "789.123.456-00", role: "gestor", secretaria: "Saúde", status: "ativo" },
  { id: "5", nome: "Pedro Ferreira", email: "pedro@email.com", cpf: "321.654.987-00", role: "cidadao", secretaria: null, status: "inativo" },
];

const secretarias = [
  "Obras",
  "Saúde",
  "Educação",
  "Meio Ambiente",
  "Fazenda",
  "Assistência Social",
  "Cultura",
  "Esporte",
];

const roleConfig: Record<string, { label: string; color: string }> = {
  cidadao: { label: "Cidadão", color: "bg-gray-100 text-gray-700" },
  atendente: { label: "Atendente", color: "bg-green-100 text-green-700" },
  gestor: { label: "Gestor", color: "bg-blue-100 text-blue-700" },
  admin: { label: "Administrador", color: "bg-purple-100 text-purple-700" },
};

export default function GestaoUsuarios() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [editForm, setEditForm] = useState({
    email: "",
    secretaria: "",
    role: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [createForm, setCreateForm] = useState({
    nome: "",
    cpfCnpj: "",
    tipoPessoa: "pessoa_fisica",
    endereco: "",
    telefone: "",
    email: "",
    role: "cidadao",
    secretaria: "",
  });

  // Quando mudar para pessoa jurídica, definir role como cidadão automaticamente
  useEffect(() => {
    if (createForm.tipoPessoa === "pessoa_juridica" && createForm.role !== "cidadao") {
      setCreateForm(prev => ({ ...prev, role: "cidadao" }));
    }
  }, [createForm.tipoPessoa]);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.cpf.includes(searchQuery);

    if (roleFilter === "todos") return matchesSearch;
    return matchesSearch && user.role === roleFilter;
  });

  const handleEditUser = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email,
      secretaria: user.secretaria || "",
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  const handleResetPassword = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setNewPassword("");
    setPasswordDialogOpen(true);
  };

  const handleSaveEdit = () => {
    toast({
      title: "Usuário atualizado!",
      description: `Os dados de ${selectedUser?.nome} foram atualizados.`,
    });
    setEditDialogOpen(false);
  };

  const handleSavePassword = () => {
    toast({
      title: "Senha alterada!",
      description: `A senha de ${selectedUser?.nome} foi alterada com sucesso.`,
    });
    setPasswordDialogOpen(false);
  };

  const handleCreateUser = () => {
    toast({
      title: "Usuário criado!",
      description: `${createForm.nome} foi adicionado com sucesso.`,
    });
    setCreateDialogOpen(false);
    setCreateForm({
      nome: "",
      cpfCnpj: "",
      tipoPessoa: "pessoa_fisica",
      endereco: "",
      telefone: "",
      email: "",
      role: "cidadao",
      secretaria: "",
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">👥 Gestão de Usuários</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie usuários, permissões e secretarias
              </p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou CPF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="cidadao">Cidadãos</SelectItem>
                <SelectItem value="atendente">Atendentes</SelectItem>
                <SelectItem value="gestor">Gestores</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{user.nome}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                          <span>📄 CPF: {user.cpf}</span>
                          {user.secretaria && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {user.secretaria}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Badges and Actions */}
                      <div className="flex items-center gap-3">
                        <Badge className={roleConfig[user.role].color}>
                          <Shield className="h-3 w-3 mr-1" />
                          {roleConfig[user.role].label}
                        </Badge>
                        <Badge variant={user.status === "ativo" ? "default" : "secondary"}>
                          {user.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                              <KeyRound className="h-4 w-4 mr-2" />
                              Alterar Senha
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <User className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros de busca.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Cadastre um novo usuário no sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-tipoPessoa">Tipo de Pessoa *</Label>
              <Select value={createForm.tipoPessoa} onValueChange={(value) => setCreateForm({ ...createForm, tipoPessoa: value, cpfCnpj: "" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de pessoa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                  <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-nome">
                  {createForm.tipoPessoa === "pessoa_juridica" ? "Razão Social *" : "Nome Completo *"}
                </Label>
                <Input
                  id="create-nome"
                  value={createForm.nome}
                  onChange={(e) => setCreateForm({ ...createForm, nome: e.target.value })}
                  placeholder={createForm.tipoPessoa === "pessoa_juridica" ? "Digite a razão social" : "Digite o nome completo"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-cpfCnpj">
                  {createForm.tipoPessoa === "pessoa_juridica" ? "CNPJ *" : "CPF *"}
                </Label>
                <Input
                  id="create-cpfCnpj"
                  value={createForm.cpfCnpj}
                  onChange={(e) => setCreateForm({ ...createForm, cpfCnpj: e.target.value })}
                  placeholder={createForm.tipoPessoa === "pessoa_juridica" ? "00.000.000/0000-00" : "000.000.000-00"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-endereco">Endereço *</Label>
              <Input
                id="create-endereco"
                value={createForm.endereco}
                onChange={(e) => setCreateForm({ ...createForm, endereco: e.target.value })}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-telefone">Telefone *</Label>
                <Input
                  id="create-telefone"
                  value={createForm.telefone}
                  onChange={(e) => setCreateForm({ ...createForm, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="create-email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="usuario@email.com"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-role">Tipo de Usuário *</Label>
              <Select 
                value={createForm.role} 
                onValueChange={(value) => setCreateForm({ ...createForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  {createForm.tipoPessoa === "pessoa_juridica" ? (
                    <SelectItem value="cidadao">Cidadão (Empresa)</SelectItem>
                  ) : (
                    <>
                      <SelectItem value="cidadao">Cidadão</SelectItem>
                      <SelectItem value="atendente">Atendente</SelectItem>
                      <SelectItem value="gestor">Gestor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {(createForm.role === "gestor" || createForm.role === "atendente") && (
              <div className="space-y-2">
                <Label htmlFor="create-secretaria">Secretaria *</Label>
                <Select value={createForm.secretaria} onValueChange={(value) => setCreateForm({ ...createForm, secretaria: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a secretaria" />
                  </SelectTrigger>
                  <SelectContent>
                    {secretarias.map((sec) => (
                      <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser}>
              Criar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Alterar dados de {selectedUser?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Tipo de Usuário</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cidadao">Cidadão</SelectItem>
                  <SelectItem value="atendente">Atendente</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(editForm.role === "gestor" || editForm.role === "atendente") && (
              <div className="space-y-2">
                <Label htmlFor="edit-secretaria">Secretaria</Label>
                <Select value={editForm.secretaria} onValueChange={(value) => setEditForm({ ...editForm, secretaria: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a secretaria" />
                  </SelectTrigger>
                  <SelectContent>
                    {secretarias.map((sec) => (
                      <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>
              Definir nova senha para {selectedUser?.nome}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
              />
              <p className="text-xs text-muted-foreground">
                A senha será informada ao usuário por e-mail.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePassword}>
              Alterar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
