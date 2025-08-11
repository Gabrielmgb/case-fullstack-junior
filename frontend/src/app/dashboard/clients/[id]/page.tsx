"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useClient, useClientAlignment } from "@/hooks/use-clients"
import { formatCurrency, formatDate, getAlignmentColor, getAlignmentLabel } from "@/lib/utils"
import { ArrowLeft, Edit, Target, Wallet, Activity, FileText, Shield } from "lucide-react"

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.id as string

  const { data: client, isLoading, error } = useClient(clientId)
  const { data: alignment } = useClientAlignment(clientId)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p>Carregando cliente...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !client) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-destructive">Cliente não encontrado</p>
          <Link href="/dashboard/clients">
            <Button className="mt-4">Voltar para Clientes</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/clients">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{client.name}</h1>
              <p className="text-muted-foreground">{client.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={client.isActive ? "default" : "secondary"}>{client.isActive ? "Ativo" : "Inativo"}</Badge>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Idade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{client.age}</div>
              <p className="text-xs text-muted-foreground">anos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(client.totalWealth)}</div>
              <p className="text-xs text-muted-foreground">valor atual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alinhamento</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${alignment ? getAlignmentColor(alignment.category) : ""}`}>
                {alignment ? `${alignment.alignmentScore.toFixed(1)}%` : "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                {alignment ? getAlignmentLabel(alignment.category) : "Calculando..."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cliente desde</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(client.createdAt)}</div>
              <p className="text-xs text-muted-foreground">data de cadastro</p>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                <p>{client.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Idade</p>
                <p>{client.age} anos</p>
              </div>
              {client.familyProfile && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Perfil Familiar</p>
                  <p>{client.familyProfile}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{client._count?.goals || 0}</p>
                  <p className="text-sm text-muted-foreground">Metas</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Wallet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{client._count?.walletItems || 0}</p>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{client._count?.simulations || 0}</p>
                  <p className="text-sm text-muted-foreground">Simulações</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold">{client._count?.insurances || 0}</p>
                  <p className="text-sm text-muted-foreground">Seguros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Gerencie as informações financeiras do cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start bg-transparent">
                <Target className="mr-2 h-4 w-4" />
                Gerenciar Metas
              </Button>
              <Button variant="outline" className="justify-start bg-transparent">
                <Wallet className="mr-2 h-4 w-4" />
                Carteira de Investimentos
              </Button>
              <Button variant="outline" className="justify-start bg-transparent">
                <Activity className="mr-2 h-4 w-4" />
                Nova Projeção
              </Button>
              <Button variant="outline" className="justify-start bg-transparent">
                <Shield className="mr-2 h-4 w-4" />
                Seguros
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
