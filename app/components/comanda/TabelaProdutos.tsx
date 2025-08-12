import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Produto } from "@/types/comanda"


type ListaProdutosProps = {
  produtosFiltrados: Produto[]
  tipoColors: Record<string, string>
  tipoLabels: Record<string, string>
  handleSelect: (produto: Produto) => void
}

export function TabelaProdutos({
  produtosFiltrados,
  tipoColors,
  tipoLabels,
  handleSelect,
}: ListaProdutosProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead className="text-center">Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {produtosFiltrados.map((produto) => (
          <TableRow key={`${produto.id}-${produto.codigo}`}>
            <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
              #{produto.codigo}
            </TableCell>
            <TableCell>{produto.nome}</TableCell>
            <TableCell>
              <Badge
                variant={
                  ['default', 'secondary', 'destructive', 'outline'].includes(
                    tipoColors[produto.tipo]
                  )
                    ? (tipoColors[produto.tipo] as
                        | 'default'
                        | 'secondary'
                        | 'destructive'
                        | 'outline')
                    : 'default'
                }
              >
                {tipoLabels[produto.tipo]}
              </Badge>
            </TableCell>
            <TableCell>
              R$ {produto.preco.toFixed(2).replace('.', ',')}
              {produto.tipo === 'REFEICAO_PESO' && (
                <span className="text-xs text-muted-foreground">/kg</span>
              )}
            </TableCell>
            <TableCell className="text-center">
              <Button size="sm" onClick={() => handleSelect(produto)}>
                Selecionar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}