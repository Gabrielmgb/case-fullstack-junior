"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Target, DollarSign } from "lucide-react"

// Mock data para demonstração
const mockClients = [
  { id: 1, name: "João Silva", email: "joao@email.com", alignment: 95, status: "active" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", alignment: 75, status: "active" },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", alignment: 45, status: "active" },
  { id: 4, name: "Ana Oliveira", email: "ana@email.com", alignment: 85, status: "active" },
]

const getAlignmentColor = (alignment: number) => {
  if (alignment > 90) return "bg-green-500"
  if (alignment >= 70) return "bg-yellow-400"
  if (alignment >= 50) return "bg-yellow-600"
  return "bg-red-500"
}

const getAlignmentLabel = (alignment: number) => {
  if (alignment > 90) return "Excelente"
  if (alignment >= 70) return "Bom"
  if (alignment >= 50) return "Regular"
  return "Crítico"
}

export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState<number | null>(null)

  const alignmentStats = {
    excellent: mockClients.filter((c) => c.alignment > 90).length,
    good: mockClients.filter((c) => c.alignment >= 70 && c.alignment <= 90).length,
    regular: mockClients.filter((c) => c.alignment >= 50 && c.alignment < 70).length,
    critical: mockClients.filter((c) => c.alignment < 50).length,
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Planejamento</h1>
            <p className="text-muted-foreground">Visão geral do alinhamento patrimonial dos clientes</p>
          </div>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockClients.length}</div>
              <p className="text-xs text-muted-foreground">+2 novos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alinhamento Médio</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(mockClients.reduce((acc, c) => acc + c.alignment, 0) / mockClients.length)}%
              </div>
              <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 2.4M</div>
              <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projeção 2060</CardTitle>
              <CardDescription>Taxa real 4% a.a.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 8.7M</div>
            </CardContent>
          </Card>
        </div>

        {/* Alignment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Alinhamento</CardTitle>
            <CardDescription>Categorização dos clientes por nível de alinhamento patrimonial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-2xl font-bold text-green-600">{alignmentStats.excellent}</div>
                <div className="text-sm text-green-600">Excelente &gt;90%</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                <div className="text-2xl font-bold text-yellow-600">{alignmentStats.good}</div>
                <div className="text-sm text-yellow-600">Bom 70-90%</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-600/10 border border-yellow-600/20">
                <div className="text-2xl font-bold text-yellow-700">{alignmentStats.regular}</div>
                <div className="text-sm text-yellow-700">Regular 50-70%</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-2xl font-bold text-red-600">{alignmentStats.critical}</div>
                <div className="text-sm text-red-600">Crítico &lt;50%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes por Alinhamento</CardTitle>
            <CardDescription>Lista de clientes ordenada por nível de alinhamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockClients
                .sort((a, b) => b.alignment - a.alignment)
                .map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{client.alignment}%</div>
                        <Badge variant="secondary" className={`${getAlignmentColor(client.alignment)} text-white`}>
                          {getAlignmentLabel(client.alignment)}
                        </Badge>
                      </div>
                      <Progress value={client.alignment} className="w-24" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
