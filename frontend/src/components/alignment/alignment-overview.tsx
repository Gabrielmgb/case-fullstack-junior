"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useClients } from "@/hooks/use-clients"
import { getAlignmentColor, getAlignmentLabel } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function AlignmentOverview() {
  const { data: clientsData } = useClients({ limit: 100 })

  if (!clientsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral do Alinhamento</CardTitle>
          <CardDescription>Carregando dados dos clientes...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Simular dados de alinhamento (em produção viria da API)
  const alignmentData = clientsData.data.map((client) => {
    const score = Math.random() * 100
    let category: "green" | "yellow-light" | "yellow-dark" | "red"

    if (score > 90) category = "green"
    else if (score > 70) category = "yellow-light"
    else if (score > 50) category = "yellow-dark"
    else category = "red"

    return {
      ...client,
      alignmentScore: score,
      category,
    }
  })

  const categoryStats = {
    green: alignmentData.filter((c) => c.category === "green").length,
    "yellow-light": alignmentData.filter((c) => c.category === "yellow-light").length,
    "yellow-dark": alignmentData.filter((c) => c.category === "yellow-dark").length,
    red: alignmentData.filter((c) => c.category === "red").length,
  }

  const totalClients = alignmentData.length
  const averageAlignment = alignmentData.reduce((sum, c) => sum + c.alignmentScore, 0) / totalClients

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral do Alinhamento</CardTitle>
          <CardDescription>Distribuição do alinhamento entre todos os clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-950">
              <div className="text-2xl font-bold text-green-600">{categoryStats.green}</div>
              <p className="text-sm text-green-600">Bem Alinhados &gt;90%</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <div className="text-2xl font-bold text-yellow-600">{categoryStats["yellow-light"]}</div>
              <p className="text-sm text-yellow-600">Moderados 70-90%</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
              <div className="text-2xl font-bold text-orange-600">{categoryStats["yellow-dark"]}</div>
              <p className="text-sm text-orange-600">Pouco Alinhados 50-70%</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-red-50 dark:bg-red-950">
              <div className="text-2xl font-bold text-red-600">{categoryStats.red}</div>
              <p className="text-sm text-red-600">Desalinhados &lt;50%</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Alinhamento Médio</span>
              <span className="font-medium">{averageAlignment.toFixed(1)}%</span>
            </div>
            <Progress value={averageAlignment} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes por Alinhamento</CardTitle>
          <CardDescription>Lista detalhada do alinhamento de cada cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alignmentData.slice(0, 10).map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`font-medium ${getAlignmentColor(client.category)}`}>
                      {client.alignmentScore.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">{getAlignmentLabel(client.category)}</p>
                  </div>
                  <Badge variant={client.category === "green" ? "default" : "secondary"}>
                    {client.category === "green" && <TrendingUp className="w-3 h-3 mr-1" />}
                    {client.category === "red" && <TrendingDown className="w-3 h-3 mr-1" />}
                    {(client.category === "yellow-light" || client.category === "yellow-dark") && (
                      <Minus className="w-3 h-3 mr-1" />
                    )}
                    {getAlignmentLabel(client.category)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
