"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  /** valor controlado - aceita "value" ou "valor" (YYYY-MM-DD) */
  value?: string;
  valor?: string;
  /** callback obrigatório quando o dia muda */
  onChange: (dia: string) => void;
  className?: string;
};

function hojeYYYYMMDD() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function FiltroComandasDia({ value, valor, onChange, className }: Props) {
  const propDia = useMemo(() => value ?? valor, [value, valor]);
  const [dia, setDia] = useState<string>(propDia ?? hojeYYYYMMDD());

  // mantém sincronizado quando o pai mudar o valor controlado
  useEffect(() => {
    if (propDia && propDia !== dia) setDia(propDia);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propDia]);

  // dispara onChange na montagem com hoje (ou prop inicial)
  useEffect(() => {
    onChange(dia);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setHoje() {
    const h = hojeYYYYMMDD();
    setDia(h);
    onChange(h);
  }

  return (
    <div className={cn("flex items-end gap-3", className)}>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Dia</label>
        <input
          type="date"
          className="h-9 rounded border bg-background px-3 text-sm"
          value={dia}
          onChange={(e) => {
            setDia(e.target.value);
            onChange(e.target.value);
          }}
          max={hojeYYYYMMDD()}
        />
      </div>
      <Button size="sm" variant="outline" onClick={setHoje}>
        Hoje
      </Button>
    </div>
  );
}

export default FiltroComandasDia;
export { FiltroComandasDia };
