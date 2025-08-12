export interface PedidoItem {
  id: string
  itemId: string
  quantidade: number
  precoUnitario: number
  subtotal: number
  item: {
    nome: string
    preco: number
    codigo: number
  }
}

export type StatusComanda = 'ABERTA' | 'FECHADA'

export interface Comanda {
  id: number
  numero: number
  data: string
  status: StatusComanda
  pedidos: PedidoItem[]
}

export interface NovaComandaInput {
  numero: number
  data: string
  status: StatusComanda
  pedidos: {
    codigo: number
    quantidade: number
    precoUnitario: number
  }[]
}

export type Produto = {
  id: string | number
  codigo: string | number
  nome: string
  tipo: string
  preco: number
  ativo: boolean
}

export interface Pedido {
  id: string | number
  itemId: number
  quantidade: number
  precoUnitario: number
  subtotal: number
  item: Produto
}
