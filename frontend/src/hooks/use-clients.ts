import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Client, ClientForm, PaginatedResponse, AlignmentResult } from "@/types"

interface ClientsQueryParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export function useClients(params: ClientsQueryParams = {}) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: async (): Promise<PaginatedResponse<Client>> => {
      const response = await api.get("/clients", { params })
      return response.data
    },
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: async (): Promise<Client> => {
      const response = await api.get(`/clients/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ClientForm): Promise<Client> => {
      const response = await api.post("/clients", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClientForm> }): Promise<Client> => {
      const response = await api.put(`/clients/${id}`, data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["clients", id] })
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/clients/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}

export function useClientAlignment(id: string) {
  return useQuery({
    queryKey: ["clients", id, "alignment"],
    queryFn: async (): Promise<AlignmentResult> => {
      const response = await api.get(`/clients/${id}/alignment`)
      return response.data
    },
    enabled: !!id,
  })
}
