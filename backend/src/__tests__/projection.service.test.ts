import { ProjectionService } from "../services/projection.service"
import type { WealthProjectionParams } from "../types"
import { jest } from "@jest/globals"

// Mock do Prisma para testes unitários
const mockPrisma = {
  client: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
  },
  simulation: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
} as any

describe("ProjectionService", () => {
  let projectionService: ProjectionService

  beforeEach(() => {
    projectionService = new ProjectionService(mockPrisma)
    jest.clearAllMocks()
  })

  describe("simulateWealthCurve", () => {
    it("deve calcular projeção simples sem eventos", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000,
        events: [],
        projectionRate: 0.04, // 4% ao ano
        endYear: 2025,
      }

      const result = projectionService.simulateWealthCurve(params)

      expect(result).toHaveLength(2) // 2024 e 2025
      expect(result[0].year).toBe(2024)
      expect(result[0].projectedValue).toBeCloseTo(104074.12, 2) // ~4% composto mensalmente
      expect(result[1].projectedValue).toBeGreaterThan(result[0].projectedValue)
    })

    it("deve aplicar evento único corretamente", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000,
        events: [
          {
            value: 12000, // Aporte de R$ 12.000
            frequency: "ONCE",
            startDate: new Date(2024, 0, 1), // Janeiro 2024
          },
        ],
        projectionRate: 0.04,
        endYear: 2025,
      }

      const result = projectionService.simulateWealthCurve(params)

      // O valor deve ser maior que sem o evento
      expect(result[0].projectedValue).toBeGreaterThan(104074.12)
      expect(result[0].projectedValue).toBeCloseTo(116563.47, 2) // 112k + crescimento
    })

    it("deve aplicar eventos mensais corretamente", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000,
        events: [
          {
            value: 1000, // R$ 1.000 por mês
            frequency: "MONTHLY",
            startDate: new Date(2024, 0, 1),
          },
        ],
        projectionRate: 0.04,
        endYear: 2025,
      }

      const result = projectionService.simulateWealthCurve(params)

      // Com aportes mensais, o crescimento deve ser significativo
      expect(result[0].projectedValue).toBeGreaterThan(116000) // 100k + 12k aportes + crescimento
      expect(result[1].projectedValue).toBeGreaterThan(140000) // Mais um ano de aportes
    })

    it("deve aplicar eventos anuais corretamente", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000,
        events: [
          {
            value: 10000, // R$ 10.000 por ano em janeiro
            frequency: "YEARLY",
            startDate: new Date(2024, 0, 1), // Janeiro
          },
        ],
        projectionRate: 0.04,
        endYear: 2026,
      }

      const result = projectionService.simulateWealthCurve(params)

      expect(result).toHaveLength(3) // 2024, 2025, 2026
      // Cada ano deve ter o aporte aplicado
      expect(result[0].projectedValue).toBeCloseTo(114481.57, 2) // 110k + crescimento
      expect(result[1].projectedValue).toBeCloseTo(129461.24, 2) // Valor anterior + 10k + crescimento
    })

    it("deve respeitar data de fim dos eventos", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000,
        events: [
          {
            value: 1000,
            frequency: "MONTHLY",
            startDate: new Date(2024, 0, 1),
            endDate: new Date(2024, 5, 30), // Apenas 6 meses
          },
        ],
        projectionRate: 0.04,
        endYear: 2025,
      }

      const result = projectionService.simulateWealthCurve(params)

      // O crescimento deve ser menor que se fosse o ano todo
      expect(result[0].projectedValue).toBeLessThan(116000) // Menos que 12 meses de aportes
      expect(result[0].projectedValue).toBeGreaterThan(104000) // Mais que sem aportes
    })

    it("deve calcular taxa mensal corretamente", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000,
        events: [],
        projectionRate: 0.12, // 12% ao ano
        endYear: 2025,
      }

      const result = projectionService.simulateWealthCurve(params)

      // 12% ao ano = ~0.9489% ao mês
      // Após 1 ano: 100000 * (1.009489)^12 ≈ 112683
      expect(result[0].projectedValue).toBeCloseTo(112683, 0)
    })

    it("deve lidar com eventos negativos (retiradas)", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000,
        events: [
          {
            value: -5000, // Retirada de R$ 5.000
            frequency: "ONCE",
            startDate: new Date(2024, 5, 1), // Junho 2024
          },
        ],
        projectionRate: 0.04,
        endYear: 2025,
      }

      const result = projectionService.simulateWealthCurve(params)

      // O valor final deve ser menor que sem a retirada
      expect(result[0].projectedValue).toBeLessThan(104074.12)
      expect(result[0].projectedValue).toBeCloseTo(98874.12, 2) // Aproximadamente 95k + crescimento
    })

    it("deve projetar até 2060 por padrão", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000,
        events: [],
        projectionRate: 0.04,
      }

      const result = projectionService.simulateWealthCurve(params)

      expect(result[result.length - 1].year).toBe(2060)
      expect(result).toHaveLength(37) // 2024 até 2060
    })
  })

  describe("Edge Cases", () => {
    it("deve lidar com patrimônio inicial zero", () => {
      const params: WealthProjectionParams = {
        initialWealth: 0,
        events: [
          {
            value: 1000,
            frequency: "MONTHLY",
            startDate: new Date(2024, 0, 1),
          },
        ],
        projectionRate: 0.04,
        endYear: 2025,
      }

      const result = projectionService.simulateWealthCurve(params)

      expect(result[0].projectedValue).toBeGreaterThan(12000) // Aportes + crescimento
    })

    it("deve lidar com taxa de crescimento zero", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000,
        events: [],
        projectionRate: 0,
        endYear: 2025,
      }

      const result = projectionService.simulateWealthCurve(params)

      expect(result[0].projectedValue).toBe(100000) // Sem crescimento
      expect(result[1].projectedValue).toBe(100000)
    })

    it("deve arredondar valores para 2 casas decimais", () => {
      const params: WealthProjectionParams = {
        initialWealth: 100000.123456,
        events: [],
        projectionRate: 0.04,
        endYear: 2025,
      }

      const result = projectionService.simulateWealthCurve(params)

      result.forEach((projection) => {
        expect(projection.projectedValue).toBe(Math.round(projection.projectedValue * 100) / 100)
      })
    })
  })
})
