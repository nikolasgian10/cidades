import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Building2,
  Bell,
  User,
  Save,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const [prefeituraForm, setPrefeituraForm] = useState({
    nome: "Prefeitura Municipal de Itajubá",
    endereco: "Praça Theodomiro Santiago, 28 - Centro",
    telefone: "(35) 3629-8000",
    email: "contato@itajuba.mg.gov.br",
    horario: "08:00 às 17:00",
  });

  const [contaForm, setContaForm] = useState({
    nome: "Administrador",
    email: "admin@itajuba.mg.gov.br",
  });

  const [notificacoes, setNotificacoes] = useState({
    emailNovoProtocolo: true,
    emailAtualizacao: true,
    emailConclusao: true,
    whatsappNovoProtocolo: false,
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas!",
      description: "As alterações foram aplicadas com sucesso.",
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
              <h1 className="text-3xl font-bold text-foreground">⚙️ Configurações</h1>
              <p className="text-muted-foreground mt-1">
                Personalize o sistema conforme suas necessidades
              </p>
            </div>
            <Button className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>

          <Tabs defaultValue="geral" className="space-y-6">
            <TabsList>
              <TabsTrigger value="geral" className="gap-2">
                <Settings className="h-4 w-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="notificacoes" className="gap-2">
                <Bell className="h-4 w-4" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="prefeitura" className="gap-2">
                <Building2 className="h-4 w-4" />
                Prefeitura
              </TabsTrigger>
            </TabsList>

            {/* Aba Geral */}
            <TabsContent value="geral">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Sua Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="conta-nome">Nome</Label>
                      <Input
                        id="conta-nome"
                        value={contaForm.nome}
                        onChange={(e) => setContaForm({ ...contaForm, nome: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conta-email">E-mail</Label>
                      <Input
                        id="conta-email"
                        type="email"
                        value={contaForm.email}
                        onChange={(e) => setContaForm({ ...contaForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Perfil</p>
                    <p className="text-sm text-muted-foreground">Admin</p>
                  </div>
                  <Button variant="outline">Alterar Senha</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Notificações */}
            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Preferências de Notificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notificações por E-mail</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Novo Protocolo</Label>
                          <p className="text-sm text-muted-foreground">
                            Receber e-mail quando um novo protocolo for aberto
                          </p>
                        </div>
                        <Switch
                          checked={notificacoes.emailNovoProtocolo}
                          onCheckedChange={(checked) =>
                            setNotificacoes({ ...notificacoes, emailNovoProtocolo: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Atualização de Protocolo</Label>
                          <p className="text-sm text-muted-foreground">
                            Receber e-mail quando houver atualizações
                          </p>
                        </div>
                        <Switch
                          checked={notificacoes.emailAtualizacao}
                          onCheckedChange={(checked) =>
                            setNotificacoes({ ...notificacoes, emailAtualizacao: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Conclusão de Protocolo</Label>
                          <p className="text-sm text-muted-foreground">
                            Receber e-mail quando um protocolo for concluído
                          </p>
                        </div>
                        <Switch
                          checked={notificacoes.emailConclusao}
                          onCheckedChange={(checked) =>
                            setNotificacoes({ ...notificacoes, emailConclusao: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Notificações por WhatsApp</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Novo Protocolo</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber mensagem no WhatsApp para novos protocolos
                        </p>
                      </div>
                      <Switch
                        checked={notificacoes.whatsappNovoProtocolo}
                        onCheckedChange={(checked) =>
                          setNotificacoes({ ...notificacoes, whatsappNovoProtocolo: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Prefeitura */}
            <TabsContent value="prefeitura">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Dados da Prefeitura
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pref-nome">Nome da Prefeitura</Label>
                    <Input
                      id="pref-nome"
                      value={prefeituraForm.nome}
                      onChange={(e) => setPrefeituraForm({ ...prefeituraForm, nome: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pref-endereco">Endereço</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pref-endereco"
                        value={prefeituraForm.endereco}
                        onChange={(e) => setPrefeituraForm({ ...prefeituraForm, endereco: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pref-telefone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pref-telefone"
                          value={prefeituraForm.telefone}
                          onChange={(e) => setPrefeituraForm({ ...prefeituraForm, telefone: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pref-email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pref-email"
                          type="email"
                          value={prefeituraForm.email}
                          onChange={(e) => setPrefeituraForm({ ...prefeituraForm, email: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pref-horario">Horário de Funcionamento</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pref-horario"
                        value={prefeituraForm.horario}
                        onChange={(e) => setPrefeituraForm({ ...prefeituraForm, horario: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
