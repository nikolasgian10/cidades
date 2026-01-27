import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Mail, ArrowRight, User, CreditCard, AlertCircle, Building2, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function Cadastro() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tipoCadastro, setTipoCadastro] = useState<"pf" | "pj">("pf");
  
  const [formPF, setFormPF] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    categoriaInteresse: "",
  });

  const [formPJ, setFormPJ] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    responsavel: "",
    categoriaInteresse: "",
  });

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
      .slice(0, 18);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3").slice(0, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock cadastro - em produção, integrar com Lovable Cloud
    setTimeout(() => {
      setIsLoading(false);
      const senhaInfo = tipoCadastro === "pf" 
        ? "Sua senha inicial é o seu CPF (apenas números)."
        : "Sua senha inicial é o seu CNPJ (apenas números).";
      
      toast({
        title: "Cadastro realizado!",
        description: `${senhaInfo} Você pode alterá-la após o login.`,
      });
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-primary block">Cidade Online</span>
              <span className="text-sm text-muted-foreground">Sistema de Protocolo Digital</span>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Cadastre-se para acessar os serviços municipais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tipoCadastro} onValueChange={(v) => setTipoCadastro(v as "pf" | "pj")} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pf" className="gap-2">
                  <User className="h-4 w-4" />
                  Pessoa Física
                </TabsTrigger>
                <TabsTrigger value="pj" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresa
                </TabsTrigger>
              </TabsList>

              <Alert className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {tipoCadastro === "pf" 
                    ? "Sua senha inicial será o seu CPF (apenas números)."
                    : "Sua senha inicial será o seu CNPJ (apenas números)."
                  }
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Pessoa Física */}
                <TabsContent value="pf" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pf-nome">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pf-nome"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formPF.nome}
                        onChange={(e) => setFormPF({ ...formPF, nome: e.target.value })}
                        className="pl-9"
                        required={tipoCadastro === "pf"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pf-cpf">CPF</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pf-cpf"
                        type="text"
                        placeholder="000.000.000-00"
                        value={formPF.cpf}
                        onChange={(e) => setFormPF({ ...formPF, cpf: formatCPF(e.target.value) })}
                        className="pl-9"
                        required={tipoCadastro === "pf"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pf-email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pf-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formPF.email}
                          onChange={(e) => setFormPF({ ...formPF, email: e.target.value })}
                          className="pl-9"
                          required={tipoCadastro === "pf"}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pf-telefone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pf-telefone"
                          type="text"
                          placeholder="(00) 00000-0000"
                          value={formPF.telefone}
                          onChange={(e) => setFormPF({ ...formPF, telefone: formatPhone(e.target.value) })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pessoa Jurídica */}
                <TabsContent value="pj" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pj-razao">Razão Social</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pj-razao"
                        type="text"
                        placeholder="Razão social da empresa"
                        value={formPJ.razaoSocial}
                        onChange={(e) => setFormPJ({ ...formPJ, razaoSocial: e.target.value })}
                        className="pl-9"
                        required={tipoCadastro === "pj"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pj-fantasia">Nome Fantasia</Label>
                    <Input
                      id="pj-fantasia"
                      type="text"
                      placeholder="Nome fantasia (opcional)"
                      value={formPJ.nomeFantasia}
                      onChange={(e) => setFormPJ({ ...formPJ, nomeFantasia: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pj-cnpj">CNPJ</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pj-cnpj"
                        type="text"
                        placeholder="00.000.000/0000-00"
                        value={formPJ.cnpj}
                        onChange={(e) => setFormPJ({ ...formPJ, cnpj: formatCNPJ(e.target.value) })}
                        className="pl-9"
                        required={tipoCadastro === "pj"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pj-email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pj-email"
                          type="email"
                          placeholder="empresa@email.com"
                          value={formPJ.email}
                          onChange={(e) => setFormPJ({ ...formPJ, email: e.target.value })}
                          className="pl-9"
                          required={tipoCadastro === "pj"}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pj-telefone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pj-telefone"
                          type="text"
                          placeholder="(00) 0000-0000"
                          value={formPJ.telefone}
                          onChange={(e) => setFormPJ({ ...formPJ, telefone: formatPhone(e.target.value) })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pj-endereco">Endereço</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pj-endereco"
                        type="text"
                        placeholder="Rua, número, bairro"
                        value={formPJ.endereco}
                        onChange={(e) => setFormPJ({ ...formPJ, endereco: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pj-responsavel">Responsável Legal</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pj-responsavel"
                        type="text"
                        placeholder="Nome do responsável legal"
                        value={formPJ.responsavel}
                        onChange={(e) => setFormPJ({ ...formPJ, responsavel: e.target.value })}
                        className="pl-9"
                        required={tipoCadastro === "pj"}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Campo comum para ambos os tipos */}
                <div className="space-y-2">
                  <Label htmlFor="categoria-interesse">Categoria de Interesse</Label>
                  <Select 
                    value={tipoCadastro === "pf" ? formPF.categoriaInteresse : formPJ.categoriaInteresse}
                    onValueChange={(value) => {
                      if (tipoCadastro === "pf") {
                        setFormPF({ ...formPF, categoriaInteresse: value });
                      } else {
                        setFormPJ({ ...formPJ, categoriaInteresse: value });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="protocolos">Protocolos Gerais</SelectItem>
                      <SelectItem value="processo-seletivo">Processo Seletivo</SelectItem>
                      <SelectItem value="licitacoes">Licitações</SelectItem>
                      <SelectItem value="certidoes">Certidões</SelectItem>
                      <SelectItem value="alvaras">Alvarás</SelectItem>
                      <SelectItem value="outros">Outros Serviços</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Criar Conta"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao cadastrar, você concorda com nossos{" "}
          <Link to="/termos" className="text-primary hover:underline">Termos de Uso</Link>
          {" "}e{" "}
          <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
        </p>
      </motion.div>
    </div>
  );
}
