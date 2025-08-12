'use client';

import { useEffect, useMemo, useState } from "react";
import { useComandas } from "@/stores/useComandas";
import { BotaoNovaComanda } from "./components/dashboard/BotaoNovaComanda";
import { DashboardResumo } from "./components/dashboard/DashboardResumo";
import { ListaComandas } from "./components/dashboard/ListaComandas";
import FiltroComandasDia from "./components/dashboard/FiltroComandasPorData";

function dateOnlyYYYYMMDD(input: string | Date) {
  const d = input instanceof Date ? input : new Date(input);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function DashboardPage() {
  const { comandas, carregarComandas } = useComandas();
  const [diaSelecionado, setDiaSelecionado] = useState<string>("");

  useEffect(() => {
    carregarComandas();
  }, [carregarComandas]);

  interface Comanda {
    data: string | Date;
    // adicione outros campos conforme necessário
    // Exemplo de campos adicionais:
    id?: number;
    nomeCliente?: string;
    valorTotal?: number;
  }

  const comandasFiltradas = useMemo(() => {
    if (!diaSelecionado) return comandas;
    return comandas.filter((c: Comanda) => dateOnlyYYYYMMDD(c.data) === diaSelecionado);
  }, [comandas, diaSelecionado]);

  return (
    <main className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Controle de Comandas</h1>
          <p className="text-muted-foreground">Gerencie todas as comandas do sistema</p>
        </div>
        <BotaoNovaComanda />
      </div>

      <FiltroComandasDia
        /** pode usar tanto "value" quanto "valor" */
        value={diaSelecionado}
        onChange={setDiaSelecionado}
      />

      <DashboardResumo />
      <ListaComandas comandas={comandasFiltradas} />
    </main>
  );
}
