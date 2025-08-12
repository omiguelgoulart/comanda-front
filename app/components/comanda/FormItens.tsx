"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useComandas } from "@/stores/useComandas";

interface FormItensProps {
  codigoItem: string;
  precoItem: string;
  quantidadeItem: string;
  setCodigoItem: React.Dispatch<React.SetStateAction<string>>;
  setPrecoItem: React.Dispatch<React.SetStateAction<string>>;
  setQuantidadeItem: React.Dispatch<React.SetStateAction<string>>;
  handleAdicionarItem?: () => void;
}

export function FormItens({
  codigoItem,
  precoItem,
  quantidadeItem,
  setCodigoItem,
  setPrecoItem,
  setQuantidadeItem,
  handleAdicionarItem,
}: FormItensProps) {
  const [statusComanda] = useState<"ABERTA" | "FECHADA">("ABERTA");
  const [nomeDoItem, setNomeDoItem] = useState("");
  // const [produtoEncontrado, setProdutoEncontrado] = useState<Produto | null>(null)
  const [buscando, setBuscando] = useState(false);

  const { comandaSelecionada, obterProdutoPorCodigo, adicionarItem } =
    useComandas();

  // Busca produto por código e ATUALIZA o preço sempre que o código mudar
  useEffect(() => {
    let cancelado = false;

    if (!codigoItem) {
      setNomeDoItem("");
      // setProdutoEncontrado(null)
      setPrecoItem(""); // limpa o preço se limpar o código
      return;
    }

    const codigo = Number(codigoItem);
    if (!Number.isFinite(codigo) || codigo <= 0) return;

    setBuscando(true);
    const id = setTimeout(async () => {
      try {
        const prod = await obterProdutoPorCodigo(codigo);
        if (cancelado) return;

        if (prod) {
          // setProdutoEncontrado(prod)
          setNomeDoItem(prod.nome);
          // **sempre** atualiza o preço quando o código muda
          setPrecoItem(prod.preco.toFixed(2));
        } else {
          // setProdutoEncontrado(null)
          setNomeDoItem("Produto não encontrado");
          // mantém o preço digitado pelo usuário (não força limpar)
        }
      } finally {
        if (!cancelado) setBuscando(false);
      }
    }, 300); // debounce

    return () => {
      cancelado = true;
      clearTimeout(id);
    };
  }, [codigoItem, obterProdutoPorCodigo, setPrecoItem]);

  const [isAdding, setIsAdding] = useState(false);

  async function onAdicionarClick() {
    if (handleAdicionarItem) {
      await handleAdicionarItem();
      return;
    }
    if (!comandaSelecionada) return;
    if (isAdding) return; // <- guarda-chuva extra

    setIsAdding(true);
    try {
      const comandaIdNum = Number(comandaSelecionada.id);
      const codigoNum = Number(codigoItem);
      const qtdNum = Number(quantidadeItem || "1");
      const precoTrim = (precoItem ?? "").trim();
      const precoMaybe =
        precoTrim !== "" &&
        Number.isFinite(Number(precoTrim)) &&
        Number(precoTrim) >= 0
          ? Number(precoTrim)
          : undefined;

      if (
        !Number.isFinite(comandaIdNum) ||
        !Number.isFinite(codigoNum) ||
        codigoNum <= 0
      )
        return;
      if (!Number.isFinite(qtdNum) || qtdNum <= 0) return;

      await adicionarItem(comandaIdNum, codigoNum, qtdNum, precoMaybe);
      setQuantidadeItem("");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div>
      <Card className="shadow-sm">
        <CardTitle className="flex items-center gap-2 p-4">
          Item:
          {codigoItem && (
            <span className="ml-4 text-muted-foreground font-normal text-base">
              {buscando ? "Buscando..." : nomeDoItem}
            </span>
          )}
        </CardTitle>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código do Item</Label>
              <Input
                id="codigo"
                type="number"
                value={codigoItem}
                onChange={(e) => setCodigoItem(e.target.value)}
                placeholder="Digite o código..."
                className="font-mono text-center text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preço</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={precoItem}
                  onChange={(e) => setPrecoItem(e.target.value)}
                  onBlur={() => {
                    // formata ao sair do campo, se houver valor válido
                    const n = Number(precoItem);
                    if (Number.isFinite(n)) setPrecoItem(n.toFixed(2));
                  }}
                  placeholder="0,00"
                  className="pl-8 text-center text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Qtd</Label>
              <Input
                id="quantidade"
                type="number"
                step="0.1"
                min="0.1"
                value={quantidadeItem}
                onChange={(e) => setQuantidadeItem(e.target.value)}
                placeholder="1"
                className="text-center text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                type="button" // <- evita submit implícito
                onClick={onAdicionarClick}
                disabled={
                  statusComanda === "FECHADA" ||
                  !codigoItem ||
                  !quantidadeItem ||
                  isAdding // <- trava durante o POST
                }
                className="w-full h-10"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
