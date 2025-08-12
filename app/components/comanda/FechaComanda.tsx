"use client";

import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";

type FechaComandaProps = {
  numeroComanda: number;
  onFechar?: () => void;
};

export function FechaComanda({ numeroComanda, onFechar }: FechaComandaProps) {

  const comandaAtiva = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comandas/${numeroComanda}/fechar`,
        { method: "PATCH" }
      );

      if (!res.ok) throw new Error("Erro ao fechar comanda");

      if (onFechar) onFechar(); // atualiza status no AsideComanda
    } catch (err) {
      console.error(err);
    }
  }

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
