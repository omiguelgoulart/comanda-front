"use client";

import { useEffect, useMemo, useState } from "react";
import { useCallback, useRef } from "react"
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ListItens } from "../../components/comanda/ListItens";
import { FormItens } from "../../components/comanda/FormItens";
import { AsideComanda } from "../../components/comanda/AsideComanda";
import { ListaProdutosCard } from "../../components/comanda/DialogLista";
import { useComandas } from "@/stores/useComandas";

export default function PageComanda() {
  const params = useParams<{ id: string | string[] }>();
  const numeroComanda = useMemo(() => {
    const raw = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }, [params]);

  const [codigoItem, setCodigoItem] = useState("");
  const [precoItem, setPrecoItem] = useState("");
  const [quantidadeItem, setQuantidadeItem] = useState("1");
  const [showListaProdutos, setShowListaProdutos] = useState(false);


  const {
    comandaSelecionada,
    buscarComanda,
    adicionarItem, // Nome da função corrigido aqui
  } = useComandas();

  useEffect(() => {
    if (numeroComanda !== undefined) {
      buscarComanda(numeroComanda);
    }
  }, [numeroComanda, buscarComanda]);

  const statusComanda = comandaSelecionada?.status ?? "ABERTA";

  const itensComanda =
    comandaSelecionada?.pedidos?.map((p, index) => {
      // Verificações de segurança
      if (!p || !p.item) {
        console.warn('Item inválido encontrado:', p);
        return null;
      }

      let id: string;
      const pid = p.id as string | number | undefined;
      if (typeof pid === "string") {
        id = pid;
      } else if (typeof pid === "number" && Number.isFinite(pid)) {
        id = pid.toString();
      } else {
        id = `item-${index}`;
      }
      return {
        id,
        codigo: p.item.codigo ?? 'N/A',
        nome: p.item.nome ?? 'Item sem nome',
        quantidade: p.quantidade ?? 0,
        preco: p.precoUnitario ?? 0,
        subtotal: p.subtotal ?? 0,
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null) || [];

  const totalComanda = itensComanda.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const addingRef = useRef(false)

const handleAdicionarItem = useCallback(async () => {
  if (!numeroComanda || !codigoItem || !quantidadeItem) return
  if (addingRef.current) return            // <- impede 2ª chamada
  addingRef.current = true
  try {
    const codigoNum = parseInt(codigoItem, 10)
    const qtdNum = parseFloat(quantidadeItem)
    const precoTrim = (precoItem ?? "").trim()
    const precoMaybe =
      precoTrim !== "" && Number.isFinite(Number(precoTrim)) && Number(precoTrim) >= 0
        ? Number(precoTrim)
        : undefined

    await adicionarItem(numeroComanda, codigoNum, qtdNum, precoMaybe)
    await buscarComanda(numeroComanda)
    setCodigoItem("")
    setPrecoItem("")
    setQuantidadeItem("1")
  } catch (e) {
    console.error("Erro ao adicionar item:", e)
  } finally {
    addingRef.current = false
  }
}, [numeroComanda, codigoItem, quantidadeItem, precoItem, adicionarItem, buscarComanda])

  const handleSelecionarProduto = (produto: {
    codigo: string | number;
    preco: number;
  }) => {
    setCodigoItem(produto.codigo.toString());
    setPrecoItem(produto.preco.toFixed(2));
    setShowListaProdutos(false);
  };

 

  return (
    <div className="min-h-screen">
      {/* Topo */}
      <div className="border-b shadow-sm">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex justify-start">
              <Button
                onClick={() => setShowListaProdutos(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Consultar Lista de Produtos
              </Button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={() => window.location.href = "/"} variant="secondary">
                Voltar
                </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex min-h-[calc(100vh-100px)]">
        <div className="flex-1 p-4 pr-0">
          <div className="space-y-4 h-full">
            <ListItens
              numeroComanda={numeroComanda ?? 0}
              itensComanda={itensComanda}
              totalComanda={totalComanda}
            />

            <FormItens
              codigoItem={codigoItem}
              precoItem={precoItem}
              quantidadeItem={quantidadeItem}
              setCodigoItem={setCodigoItem}
              setPrecoItem={setPrecoItem}
              setQuantidadeItem={setQuantidadeItem}
              handleAdicionarItem={handleAdicionarItem}
            />
          </div>
        </div>

        <AsideComanda
          numeroComanda={numeroComanda ?? 0}
          statusComanda={statusComanda}
          itensComanda={itensComanda}
          totalComanda={totalComanda}
        />
      </div>

      {/* Lista de Produtos (Card) */}
      {showListaProdutos && (
        <ListaProdutosCard
          onClose={() => setShowListaProdutos(false)}
          onSelectProduct={handleSelecionarProduto}
        />
      )}
    </div>
  );
}
