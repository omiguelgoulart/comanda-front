"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

type Props = {
  /** valor controlado - aceita "value" ou "valor" (YYYY-MM-DD) */
  value?: string;
  valor?: string;
  /** callback obrigatório quando o dia muda (YYYY-MM-DD) */
  onChange: (dia: string) => void;
  className?: string;
};

function hojeYMD() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function toYMD(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function fromYMD(s?: string): Date {
  if (!s) return new Date();
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return isNaN(dt.getTime()) ? new Date() : dt;
}

export default function FiltroComandasDia({ value, valor, onChange, className }: Props) {
  const propStr = useMemo(() => value ?? valor, [value, valor]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date>(fromYMD(propStr ?? hojeYMD()));

  // sincroniza quando pai muda
  useEffect(() => {
    if (propStr) {
      const d = fromYMD(propStr);
      if (toYMD(d) !== toYMD(selected)) setSelected(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propStr]);

  // dispara hoje na montagem (ou valor inicial)
  useEffect(() => {
    onChange(toYMD(selected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(d?: Date) {
    if (!d) return;
    setSelected(d);
    onChange(toYMD(d));
    setOpen(false);
  }

  const label = toYMD(selected).split("-").reverse().join("/"); // dd/mm/yyyy

  return (
    <div className={["flex items-end gap-3", className].filter(Boolean).join(" ")}>
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Dia</label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 justify-start gap-2 w-[220px]"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">{label}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto" align="start">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              initialFocus
              // desabilita datas futuras
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d > today;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          const h = new Date();
          setSelected(h);
          onChange(toYMD(h));
        }}
      >
        Hoje
      </Button>
    </div>
  );
}

export { FiltroComandasDia };
