"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useClients, useDeleteClient } from "@/hooks/use-clients"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal, Eye, Edit, Trash2, Search } from "lucide-react"
import type { Client } from "@/types"

interface ClientsTableProps {
  onEdit: (client: Client) => void
}

export function ClientsTable({ onEdit }: ClientsTableProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const { toast } = useToast()

  const { data, isLoading, error } = useClients({
    page,
    limit: 10,
    search: search || undefined,
  })

  const deleteClient = useDeleteClient()

  const handleDelete = async (client: Client) => {
    if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      try {
        await deleteClient.mutateAsync(client.id)
        toast({
          title: "Sucesso",
          description: "Cliente excluído com sucesso",
        })
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.response?.data?.error || "Erro ao excluir cliente",
          variant: "destructive",
        })
      }
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Erro ao carregar clientes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Patrimônio</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.age} anos</TableCell>
                  <TableCell>{formatCurrency(client.totalWealth)}</TableCell>
                  <TableCell>
                    <Badge variant={client.isActive ? "default" : "secondary"}>
                      {client.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(client.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/clients/${client.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(client)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {data.data.length} de {data.pagination.total} clientes
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              Anterior
            </Button>
            <span className="text-sm">
              Página {page} de {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === data.pagination.totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
