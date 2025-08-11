"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"
import type { ProjectionData } from "@/types"

interface ProjectionChartProps {
  data: ProjectionData[]
  title?: string
  height?: number
}

export function ProjectionChart({ data, title = "Projeção Patrimonial", height = 400 }: ProjectionChartProps) {
  const formatTooltip = (value: number, name: string) => {
    if (name === "projectedValue") {
      return [formatCurrency(value), "Valor Projetado"]
    }
    return [value, name]
  }

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="year" className="text-muted-foreground" tick={{ fontSize: 12 }} />
          <YAxis
            className="text-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value).replace("R$", "R$").slice(0, -3) + "k"}
          />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(label) => `Ano: ${label}`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="projectedValue"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
