import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, CheckCircle } from "lucide-react";

// Mock notifications data
const notifications = [
  {
    id: 1,
    title: "Novo protocolo atribuído",
    message: "Protocolo #113-2026-43198 foi atribuído a você",
    time: "5 min atrás",
    unread: true,
    type: "assignment",
  },
  {
    id: 2,
    title: "Prazo se aproximando",
    message: "Protocolo #113-2026-43197 vence em 2 dias",
    time: "1 hora atrás",
    unread: true,
    type: "deadline",
  },
  {
    id: 3,
    title: "Protocolo concluído",
    message: "Protocolo #113-2026-43196 foi finalizado com sucesso",
    time: "3 horas atrás",
    unread: false,
    type: "completed",
  },
  {
    id: 4,
    title: "Atualização de status",
    message: "Protocolo #113-2026-43195 mudou para 'Em análise'",
    time: "1 dia atrás",
    unread: false,
    type: "update",
  },
  {
    id: 5,
    title: "Novo comentário",
    message: "Novo comentário adicionado ao protocolo #113-2026-43194",
    time: "2 dias atrás",
    unread: false,
    type: "comment",
  },
];

export default function Notificacoes() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <Bell className="w-5 h-5 text-blue-600" />;
      case "deadline":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "assignment":
        return "border-l-blue-500";
      case "deadline":
        return "border-l-orange-500";
      case "completed":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <Layout>
      <div className="gov-container py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notificações</h1>
              <p className="text-muted-foreground">
                Acompanhe todas as atualizações dos seus protocolos
              </p>
            </div>
            <Button variant="outline">
              Marcar todas como lidas
            </Button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`border-l-4 ${getNotificationColor(notification.type)} ${
                  notification.unread ? "bg-blue-50/50" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-foreground">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {notification.unread && (
                            <Badge variant="secondary" className="text-xs">
                              Não lida
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            Ver protocolo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {notifications.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhuma notificação
                </h3>
                <p className="text-sm text-muted-foreground">
                  Você não tem notificações no momento.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}