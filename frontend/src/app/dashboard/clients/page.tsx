"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ClientsTable } from "@/components/clients/clients-table"
import { ClientForm } from "@/components/clients/client-form"
import { useCreateClient, useUpdateClient } from "@/hooks/use-clients"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"
import type { Client, ClientForm as ClientFormType } from "@/types"

export default function ClientsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const { toast } = useToast()

  const createClient = useCreateClient()
  const updateClient = useUpdateClient()

  const handleCreate = async (data: ClientFormType) => {
    try {
      await createClient.mutateAsync(data)
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso",
      })
      setIsDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao criar cliente",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: ClientFormType) => {
    if (!editingClient) return

    try {
      await updateClient.mutateAsync({ id: editingClient.id, data })
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso",
      })
      setEditingClient(null)
      setIsDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao atualizar cliente",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingClient(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">Gerencie seus clientes e suas informações</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <ClientsTable onEdit={handleEdit} />

        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            </DialogHeader>
            <ClientForm
              client={editingClient || undefined}
              onSubmit={editingClient ? handleUpdate : handleCreate}
              onCancel={handleCloseDialog}
              isLoading={createClient.isPending || updateClient.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
