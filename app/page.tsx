'use client';

import { useEffect } from "react";

import { useComandas } from "@/stores/useComandas";
import { BotaoNovaComanda } from "./components/dashboard/BotaoNovaComanda";
import { DashboardResumo } from "./components/dashboard/DashboardResumo";
import { ListaComandas } from "./components/dashboard/ListaComandas";

export default function DashboardPage() {

  const { comandas, carregarComandas } = useComandas();
  useEffect(() => {
    const fetchComandas = async () => {
      const data = carregarComandas();
      return data;
    }
    fetchComandas();
  }, [carregarComandas]);

  return (
    <main className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Controle de Comandas</h1>
          <p className="text-muted-foreground">Gerencie todas as comandas do sistema</p>
        </div>
        <BotaoNovaComanda />
      </div>

      <DashboardResumo />
      <ListaComandas
        comandas={comandas}
      />
    </main>
  )
}
