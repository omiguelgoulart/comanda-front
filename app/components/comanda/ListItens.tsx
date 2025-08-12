'use client'

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from '@/components/ui/card'
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { List, Trash2 } from 'lucide-react'
import { useComandas } from '@/stores/useComandas'

type Item = {
  id: string            // <- UUID do PedidoItem
  codigo: string | number
  nome: string
  quantidade: number
  preco: number
  subtotal: number
}

type ListItensProps = {
  numeroComanda: string | number
  itensComanda: Item[]
  totalComanda: number
}

const LIST_FIXED = "min-h-[266px] max-h-[266px]"

export function ListItens({
  numeroComanda,
  itensComanda,
}: ListItensProps) {
  const { removerPedido } = useComandas() // <- store deve fazer DELETE /pedidos/:id

  const onRemoverClick = async (id: string) => {
    try {
      await removerPedido(id)
    } catch (error) {
      console.error('Erro ao remover item:', error)
    }
  }

  return (
    <div>
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            Lista de Itens - Comanda #{numeroComanda}
          </CardTitle>
          <CardDescription>Itens adicionados à comanda atual</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {itensComanda.length === 0 ? (
            <div className={`flex items-center justify-center ${LIST_FIXED} text-muted-foreground`}>
              <div className="text-center">
                <List className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhum item adicionado</p>
                <p className="text-sm">Use os campos abaixo para adicionar itens à comanda</p>
              </div>
            </div>
          ) : (
            <div className={`overflow-y-auto ${LIST_FIXED}`}>
              <Table className="min-w-full">
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow>
                    <TableHead className="w-20">Código</TableHead>
                    <TableHead>Nome do Item</TableHead>
                    <TableHead className="w-24 text-center">Qtd</TableHead>
                    <TableHead className="w-32 text-right">Preço Unit.</TableHead>
                    <TableHead className="w-32 text-right">Subtotal</TableHead>
                    <TableHead className="w-20 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itensComanda.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-center">{item.quantidade}</TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {item.preco.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        R$ {item.subtotal.toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoverClick(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
