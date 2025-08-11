import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Simulation, SimulationForm } from "@/types"

export function useSimulations(clientId?: string) {
  return useQuery({
    queryKey: ["simulations", clientId],
    queryFn: async (): Promise<Simulation[]> => {
      const url = clientId ? `/simulations/client/${clientId}` : "/simulations"
      const response = await api.get(url)
      return response.data
    },
  })
}

export function useSimulation(id: string) {
  return useQuery({
    queryKey: ["simulations", id],
    queryFn: async (): Promise<Simulation> => {
      const response = await api.get(`/simulations/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateSimulation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SimulationForm): Promise<Simulation> => {
      const response = await api.post("/simulations", data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] })
      queryClient.invalidateQueries({ queryKey: ["simulations", variables.clientId] })
    },
  })
}

export function useTestProjection() {
  return useMutation({
    mutationFn: async (data: {
      initialWealth: number
      events: any[]
      projectionRate: number
      endYear?: number
    }) => {
      const response = await api.post("/simulations/test", data)
      return response.data
    },
  })
}
