import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date))
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100)
}

export function getAlignmentColor(category: string): string {
  switch (category) {
    case "green":
      return "text-green-500"
    case "yellow-light":
      return "text-yellow-400"
    case "yellow-dark":
      return "text-yellow-600"
    case "red":
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

export function getAlignmentLabel(category: string): string {
  switch (category) {
    case "green":
      return "Bem alinhado"
    case "yellow-light":
      return "Moderadamente alinhado"
    case "yellow-dark":
      return "Pouco alinhado"
    case "red":
      return "Desalinhado"
    default:
      return "Não avaliado"
  }
}
