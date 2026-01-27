import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Tag, ArrowRight, Star, MessageCircle, User, Phone, Mail, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  "Todas",
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

const notificationFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  categories: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  allowProtocolUpdates: z.boolean().optional(),
});

const mockNoticias = [
  {
    id: 1,
    titulo: "Novo sistema de protocolo digital entra em operação",
    resumo:
      "A Prefeitura lança plataforma Cidade Online para modernizar o atendimento ao cidadão com transparência e eficiência.",
    categoria: "Tecnologia",
    data: "2026-01-16",
    destaque: true,
    imagem: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
  },
  {
    id: 2,
    titulo: "Prefeitura amplia horário de atendimento ao cidadão",
    resumo:
      "A partir de fevereiro, o atendimento presencial funcionará das 7h às 19h de segunda a sexta-feira.",
    categoria: "Serviços",
    data: "2026-01-15",
    destaque: true,
    imagem: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop",
  },
  {
    id: 3,
    titulo: "Campanha de conscientização ambiental terá início em fevereiro",
    resumo:
      "Programa 'Cidade Verde' promoverá ações de educação ambiental em todas as escolas municipais.",
    categoria: "Meio Ambiente",
    data: "2026-01-14",
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
  },
  {
    id: 4,
    titulo: "Obras de pavimentação avançam no bairro Centro",
    resumo:
      "Mais de 5km de ruas estão sendo recapeadas como parte do programa de melhoria da infraestrutura urbana.",
    categoria: "Obras",
    data: "2026-01-13",
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop",
  },
  {
    id: 5,
    titulo: "Vacinação contra gripe começa na próxima semana",
    resumo:
      "Campanha atenderá inicialmente grupos prioritários em todas as unidades de saúde do município.",
    categoria: "Saúde",
    data: "2026-01-12",
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800&h=400&fit=crop",
  },
  {
    id: 6,
    titulo: "Festival de Cultura Popular acontece em março",
    resumo:
      "Evento reunirá artistas locais e regionais com shows, exposições e oficinas gratuitas.",
    categoria: "Cultura",
    data: "2026-01-11",
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop",
  },
];

export default function Noticias() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isAuthenticated } = useAuth();

  const form = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      categories: [],
      allowProtocolUpdates: false,
    },
  });

  const onSubmit = (values: z.infer<typeof notificationFormSchema>) => {
    console.log(values);
    // Here you would typically send the data to your backend
    setIsSubmitted(true);
    setTimeout(() => {
      setIsDialogOpen(false);
      setIsSubmitted(false);
      form.reset();
    }, 2000);
  };

  const filteredNoticias = mockNoticias.filter((noticia) => {
    const matchesSearch =
      noticia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      noticia.resumo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas" || noticia.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const destaques = mockNoticias.filter((n) => n.destaque);
  const regulares = filteredNoticias.filter((n) => !n.destaque);

  return (
    <Layout>
      <div className="gov-container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            📰 Notícias
          </h1>
          <p className="text-muted-foreground">
            Fique por dentro das novidades da administração municipal
          </p>
        </motion.div>

        {/* WhatsApp Notifications Section */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500 rounded-full">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Receba notícias no WhatsApp
                      </h3>
                      <p className="text-green-700">
                        Fique por dentro das novidades da prefeitura diretamente no seu WhatsApp
                      </p>
                    </div>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Cadastrar agora
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                        <MessageCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <DialogTitle className="text-xl font-bold">
                        {isSubmitted ? "Cadastro realizado!" : "Receba notícias no WhatsApp"}
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        {isSubmitted 
                          ? "Você será notificado sobre as novidades da prefeitura em seu WhatsApp."
                          : "Preencha os dados abaixo para receber notícias da prefeitura diretamente no seu WhatsApp."
                        }
                      </DialogDescription>
                    </DialogHeader>

                    {isSubmitted ? (
                      <div className="flex flex-col items-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <p className="text-center text-muted-foreground">
                          Obrigado pelo seu interesse! Em breve você começará a receber nossas notificações.
                        </p>
                      </div>
                    ) : (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Nome completo
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Digite seu nome completo" 
                                    {...field}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  Telefone (WhatsApp)
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="(11) 99999-9999" 
                                    {...field}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email"
                                    placeholder="seu@email.com" 
                                    {...field}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-semibold">
                                  Categorias de interesse
                                </FormLabel>
                                <FormDescription className="mb-3">
                                  Selecione as categorias sobre as quais deseja receber notificações
                                </FormDescription>
                                <FormControl>
                                  <div className="grid grid-cols-1 gap-3">
                                    {categories.slice(1).map((category) => (
                                      <div key={category} className="flex items-center space-x-3">
                                        <Checkbox
                                          id={category}
                                          checked={field.value?.includes(category)}
                                          onCheckedChange={(checked) => {
                                            const current = field.value || [];
                                            if (checked) {
                                              field.onChange([...current, category]);
                                            } else {
                                              field.onChange(current.filter((c) => c !== category));
                                            }
                                          }}
                                        />
                                        <label
                                          htmlFor={category}
                                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                          {category}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="allowProtocolUpdates"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value || false}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-medium">
                                    Receber atualizações do protocolo do cidadão
                                  </FormLabel>
                                  <FormDescription className="text-xs">
                                    Permita receber notificações sobre o andamento dos seus protocolos via WhatsApp
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <DialogFooter className="pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsDialogOpen(false)}
                              className="mr-2"
                            >
                              Cancelar
                            </Button>
                            <Button 
                              type="submit" 
                              className="bg-green-600 hover:bg-green-700 min-w-[120px]"
                            >
                              Cadastrar
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured News */}
        {selectedCategory === "Todas" && searchQuery === "" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Destaques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destaques.map((noticia, index) => (
                <motion.div
                  key={noticia.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={noticia.imagem}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-accent-foreground">
                          {noticia.categoria}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(noticia.data).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {noticia.titulo}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {noticia.resumo}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-4 gap-1 p-0">
                        Ler mais
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All News */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {selectedCategory === "Todas" && searchQuery === ""
              ? "Todas as Notícias"
              : `Resultados ${filteredNoticias.length > 0 ? `(${filteredNoticias.length})` : ""}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === "Todas" && searchQuery === ""
              ? regulares
              : filteredNoticias
            ).map((noticia, index) => (
              <motion.div
                key={noticia.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow h-full">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={noticia.imagem}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {noticia.categoria}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(noticia.data).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {noticia.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {noticia.resumo}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredNoticias.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma notícia encontrada
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou termo de busca
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}