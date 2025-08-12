"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";

type Status = "ABERTA" | "FECHADA";

type FechaComandaProps = {
  numeroComanda: number;
  statusAtual: Status;                          // <-- novo: saber o status atual
  onAlterarStatus?: (novo: Status) => void;     // <-- callback com novo status
};

export function FechaComanda({ numeroComanda, statusAtual, onAlterarStatus }: FechaComandaProps) {
  const [loading, setLoading] = useState(false);

  const proximoStatus: Status = useMemo(
    () => (statusAtual === "ABERTA" ? "FECHADA" : "ABERTA"),
    [statusAtual]
  );

  async function alterarStatus() {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/comandas/${numeroComanda}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: proximoStatus }), // <-- define explícito
        }
      );

      if (!res.ok) throw new Error("Erro ao alterar status da comanda");

      onAlterarStatus?.(proximoStatus); // atualiza o estado no pai
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const label = statusAtual === "ABERTA" ? "Fechar comanda" : "Reabrir comanda";
  const variant: "destructive" | "secondary" = statusAtual === "ABERTA" ? "destructive" : "secondary";

  return (
    <Button
      onClick={alterarStatus}
      disabled={!numeroComanda || loading}
      variant={variant}
      className="w-full mt-3"
    >
      <Receipt className="w-4 h-4 mr-2" />
      {loading ? "Atualizando..." : label}
    </Button>
  );
}
