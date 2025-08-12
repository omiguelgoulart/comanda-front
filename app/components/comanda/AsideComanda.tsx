import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Receipt, Clock, DollarSign, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { FechaComanda } from "./FechaComanda";

type ItemComanda = {
  id: string | number;
  nome: string;
  quantidade: number;
  preco: number;
  // Adicione outros campos conforme necessário
};

type AsideComandaProps = {
  numeroComanda: number;
  statusComanda: "ABERTA" | "FECHADA";
  itensComanda: ItemComanda[];
  totalComanda: number;
};

export function AsideComanda({
  numeroComanda,
  statusComanda,
  itensComanda,
  totalComanda,
}: AsideComandaProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setCurrentDate(now.toLocaleDateString("pt-BR"));
    setMounted(true);
  }, []);


  // Renderização condicional para evitar hidratação mismatch
  if (!mounted) {
    return (
      <div className="w-80 p-4 space-y-4 rounded">
        {/* Informações Básicas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="w-5 h-5" />
              Comanda #{numeroComanda}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  variant={statusComanda === "ABERTA" ? "default" : "secondary"}
                  className="text-sm"
                >
                  {statusComanda === "ABERTA" ? "Aberta" : "Fechada"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Abertura:
                </span>
                <span className="text-sm">--:--</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Data:</span>
                <span className="text-sm">--/--/----</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" />
                  Quantidade de itens:
                </span>
                <span className="font-medium">{itensComanda.length}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">
                  R$ {totalComanda.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total da Comanda:</span>
                <span className="text-xl font-bold text-green-600">
                  R$ {totalComanda.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status da Sessão */}
        <div className="text-xs text-muted-foreground text-center p-2 rounded">
          <p>Sessão ativa desde --:--</p>
          <p>ID da Comanda: {numeroComanda}</p>
        </div>
      </div>
    );
  }

  return (
    // Aside - Informações da Comanda (Direita)
    <div className="w-80 p-4 space-y-4  rounded">
      {/* Informações Básicas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="w-5 h-5" />
            Comanda #{numeroComanda}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <Badge
                variant={statusComanda === "ABERTA" ? "default" : "secondary"}
                className="text-sm"
              >
                {statusComanda === "ABERTA" ? "Aberta" : "Fechada"}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Abertura:
              </span>
              <span className="text-sm">{currentTime}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Data:</span>
              <span className="text-sm">{currentDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="w-5 h-5" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" />
                Quantidade de itens:
              </span>
              <span className="font-medium">{itensComanda.length}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">
                R$ {totalComanda.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="font-semibold">Total da Comanda:</span>
              <span className="text-xl font-bold text-green-600">
                R$ {totalComanda.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Botão para fechar a comanda */}
        <FechaComanda numeroComanda={numeroComanda} />

      {/* Status da Sessão */}
      <div className="text-xs text-muted-foreground text-center p-2  rounded">
        <p>Sessão ativa desde {currentTime}</p>
        <p>ID da Comanda: {numeroComanda}</p>
      </div>
    </div>
  );
}
