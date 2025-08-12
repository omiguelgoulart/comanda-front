// stores/useComandas.ts
"use client"

import { create } from "zustand"
import { Comanda, NovaComandaInput, Produto, PedidoItem } from "@/types/comanda"

interface ComandaStore {
  pedido?: PedidoItem | null
  comandas: Comanda[]
  produtos: Produto[]
  comandaSelecionada: Comanda | null

  carregarComandas: () => Promise<void>
  buscarComanda: (id: number) => Promise<void>
  criarComanda: (nova: NovaComandaInput) => Promise<Comanda | null>

  adicionarItem: (
    comandaId: number,
    codigo: number,
    quantidade: number,
    precoUnitario?: number
  ) => Promise<void>
  removerPedido: (pedidoId: string) => Promise<void>

  listarProdutos: () => Promise<void>

  // extras
  obterProdutoPorCodigo: (codigo: number) => Promise<Produto | null>
  criarPedidoItem: (input: {
    comandaId: number
    codigo: number
    quantidade: number
    precoUnitario?: number
  }) => Promise<PedidoItem>

  alterarStatus: (id: number, ativa: boolean) => Promise<void>
}

const API_BASE =
  process.env.NEXT_PUBLIC_URL_API ?? process.env.NEXT_PUBLIC_API_ROUTE ?? ""

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`HTTP ${res.status} em ${path}: ${text}`)
  }
  return res.json() as Promise<T>
}

export const useComandas = create<ComandaStore>((set, get) => ({
  pedido: null,
  comandas: [],
  produtos: [],
  comandaSelecionada: null,

  carregarComandas: async () => {
    try {
      const data = await apiFetch<Comanda[]>("/comandas")
      set({ comandas: data })
    } catch (err) {
      console.error("[carregarComandas]", err)
      set({ comandas: [] })
    }
  },

  buscarComanda: async (id: number) => {
    try {
      const data = await apiFetch<Comanda>(`/comandas/${id}`)
      set({ comandaSelecionada: data })
    } catch (err) {
      console.error("[buscarComanda]", err)
      set({ comandaSelecionada: null })
    }
  },

  criarComanda: async (nova: NovaComandaInput) => {
    try {
      const criada = await apiFetch<Comanda>("/comandas", {
        method: "POST",
        body: JSON.stringify(nova),
      })
      set((state) => ({ comandas: [...state.comandas, criada] }))
      return criada
    } catch (error) {
      console.error("[criarComanda]", error)
      return null
    }
  },

  // POST /pedidos – faz merge se o mesmo item já existir na comanda selecionada
  adicionarItem: async (
    comandaId: number,
    codigo: number,
    quantidade: number,
    precoUnitario?: number
  ) => {
    try {
      const bodyBase = { comandaId, codigo, quantidade }
      const body =
        typeof precoUnitario === "number"
          ? { ...bodyBase, precoUnitario }
          : bodyBase

      const pedido = await apiFetch<PedidoItem>("/pedidos", {
        method: "POST",
        body: JSON.stringify(body),
      })

      set((state) => {
        const atual = state.comandaSelecionada
        if (!atual || Number(atual.id) !== comandaId) {
          return { ...state, pedido }
        }

        const idx = atual.pedidos.findIndex((p) => p.itemId === pedido.itemId)
        const pedidosAtualizados =
          idx >= 0
            ? atual.pedidos.map((p, i) => (i === idx ? pedido : p))
            : [...atual.pedidos, pedido]

        return {
          ...state,
          comandaSelecionada: { ...atual, pedidos: pedidosAtualizados },
          pedido,
        }
      })
    } catch (err) {
      console.error("[adicionarItem]", err)
      throw err
    }
  },

  listarProdutos: async () => {
    try {
      const data = await apiFetch<Produto[]>("/itens")
      set({ produtos: data })
    } catch (error) {
      console.error("[listarProdutos]", error)
      set({ produtos: [] })
    }
  },

  obterProdutoPorCodigo: async (codigo: number) => {
    try {
      try {
        const prod = await apiFetch<Produto>(`/itens/${codigo}`)
        return prod
      } catch {
        const lista = await apiFetch<Produto[]>(`/itens?codigo=${codigo}`)
        return lista.find((p) => p.codigo === codigo) ?? null
      }
    } catch (err) {
      console.error("[obterProdutoPorCodigo]", err)
      return null
    }
  },

  // Mantido por compatibilidade – delega para adicionarItem e retorna o pedido criado
  criarPedidoItem: async ({ comandaId, codigo, quantidade, precoUnitario }) => {
    const bodyBase = { comandaId, codigo, quantidade }
    const body =
      typeof precoUnitario === "number"
        ? { ...bodyBase, precoUnitario }
        : bodyBase

    const pedido = await apiFetch<PedidoItem>("/pedidos", {
      method: "POST",
      body: JSON.stringify(body),
    })

    const atual = get().comandaSelecionada
    if (atual && Number(atual.id) === comandaId) {
      const idx = atual.pedidos.findIndex((p) => p.itemId === pedido.itemId)
      const pedidosAtualizados =
        idx >= 0
          ? atual.pedidos.map((p, i) => (i === idx ? pedido : p))
          : [...atual.pedidos, pedido]
      set({ comandaSelecionada: { ...atual, pedidos: pedidosAtualizados } })
    }
    set({ pedido })
    return pedido
  },

  // PATCH /comandas/:id/status { ativa: boolean }
  alterarStatus: async (id: number, ativa: boolean) => {
    try {
      await apiFetch(`/comandas/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ ativa }),
      })

      // atualiza a lista de comandas
      set((state) => ({
        comandas: state.comandas.map((c) =>
          Number(c.id) === id ? { ...c, ativa } : c
        ),
      }))

      // atualiza a selecionada (se for a mesma)
      const atual = get().comandaSelecionada
      if (atual && Number(atual.id) === id) {
        set({ comandaSelecionada: { ...atual, ativa } as Comanda })
      }
    } catch (error) {
      console.error("[alterarStatus]", error)
      throw error
    }
  },

// no store (useComandas)
removerPedido: async (pedidoId: string) => {
  await apiFetch(`/pedidos/${pedidoId}`, { method: "DELETE" })
  set((state) => {
    const atual = state.comandaSelecionada
    if (!atual) return state
    return {
      ...state,
      comandaSelecionada: {
        ...atual,
        pedidos: atual.pedidos.filter(p => p.id !== pedidoId),
      },
    }
  })
}

}))