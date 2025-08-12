import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";
import { useComandas } from "@/stores/useComandas";

interface FechaComandaProps {
  numeroComanda: number;
}

export function FechaComanda({ numeroComanda }: FechaComandaProps) {
  const { alterarStatus } = useComandas();

  const comandaAtiva = async () => {
    if (!numeroComanda) return;
    await alterarStatus(numeroComanda, false);
  };

  return (
    <Button
      onClick={comandaAtiva}
      disabled={!numeroComanda}
      variant="destructive"
      className="w-full mt-3"
    >
      <Receipt className="w-4 h-4 mr-2" />
      Fechar comanda
    </Button>
  );
}
