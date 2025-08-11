"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProjectionChart } from "@/components/charts/projection-chart"
import { AlignmentOverview } from "@/components/alignment/alignment-overview"
import { SimulationForm } from "@/components/simulations/simulation-form"
import { useCreateSimulation, useTestProjection } from "@/hooks/use-simulations"
import { useToast } from "@/hooks/use-toast"
import { Plus, Calculator } from "lucide-react"
import type { SimulationForm as SimulationFormType } from "@/types"

export default function ProjectionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [testData, setTestData] = useState<any>(null)
  const { toast } = useToast()

  const createSimulation = useCreateSimulation()
  const testProjection = useTestProjection()

  const handleCreateSimulation = async (data: SimulationFormType) => {
    try {
      await createSimulation.mutateAsync(data)
      toast({
        title: "Sucesso",
        description: "Simulação criada com sucesso",
      })
      setIsDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao criar simulação",
        variant: "destructive",
      })
    }
  }

  const handleTestProjection = async () => {
    try {
      const result = await testProjection.mutateAsync({
        initialWealth: 100000,
        events: [
          {
            value: 1000,
            frequency: "MONTHLY",
            startDate: new Date(),
          },
        ],
        projectionRate: 0.04,
        endYear: 2035,
      })
      setTestData(result)
      toast({
        title: "Sucesso",
        description: "Projeção de teste gerada com sucesso",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao gerar projeção de teste",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projeções & Alinhamento</h1>
            <p className="text-muted-foreground">Analise projeções patrimoniais e alinhamento dos clientes</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleTestProjection} disabled={testProjection.isPending}>
              <Calculator className="mr-2 h-4 w-4" />
              {testProjection.isPending ? "Gerando..." : "Teste de Projeção"}
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Simulação
            </Button>
          </div>
        </div>

        {/* Test Projection Chart */}
        {testData && (
          <Card>
            <CardHeader>
              <CardTitle>Projeção de Teste</CardTitle>
              <CardDescription>Exemplo: R$ 100.000 inicial + R$ 1.000/mês a 4% a.a. até 2035</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectionChart data={testData.projectionData} height={300} />
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Valor Inicial</p>
                  <p className="text-lg font-bold">R$ 100.000</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Valor Final</p>
                  <p className="text-lg font-bold">R$ {testData.summary.finalValue.toLocaleString("pt-BR")}</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Crescimento Total</p>
                  <p className="text-lg font-bold text-green-600">
                    R$ {testData.summary.totalGrowth.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alignment Overview */}
        <AlignmentOverview />

        {/* Key Insights */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Motor de Projeção</CardTitle>
              <CardDescription>Como funciona o cálculo das projeções</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Taxa Composta Mensal</p>
                  <p className="text-sm text-muted-foreground">
                    Converte taxa anual para mensal: (1 + taxa)^(1/12) - 1
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Eventos Recorrentes</p>
                  <p className="text-sm text-muted-foreground">
                    Aportes mensais/anuais aplicados no início de cada período
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Projeção até 2060</p>
                  <p className="text-sm text-muted-foreground">Simulação ano a ano com precisão mensal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorias de Alinhamento</CardTitle>
              <CardDescription>Como os clientes são classificados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <div>
                  <p className="font-medium text-green-600">Bem Alinhado &gt;90%</p>
                  <p className="text-sm text-muted-foreground">Patrimônio próximo ou acima da meta</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <div>
                  <p className="font-medium text-yellow-600">Moderado 70-90%</p>
                  <p className="text-sm text-muted-foreground">Pequenos ajustes necessários</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <div>
                  <p className="font-medium text-orange-600">Pouco Alinhado 50-70%</p>
                  <p className="text-sm text-muted-foreground">Requer atenção e ajustes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <div>
                  <p className="font-medium text-red-600">Desalinhado &lt;50%</p>
                  <p className="text-sm text-muted-foreground">Ação urgente necessária</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Simulação</DialogTitle>
            </DialogHeader>
            <SimulationForm
              onSubmit={handleCreateSimulation}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={createSimulation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
