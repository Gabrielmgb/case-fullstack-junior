"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { User, LoginForm, RegisterForm } from "@/types"

interface AuthContextType {
  user: User | null
  login: (data: LoginForm) => Promise<void>
  register: (data: RegisterForm) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const savedUser = localStorage.getItem("user")

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (data: LoginForm) => {
    try {
      const response = await api.post("/auth/login", data)
      const { user, token } = response.data

      localStorage.setItem("auth_token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)

      router.push("/dashboard")
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao fazer login")
    }
  }

  const register = async (data: RegisterForm) => {
    try {
      const response = await api.post("/auth/register", data)
      const { user, token } = response.data

      localStorage.setItem("auth_token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)

      router.push("/dashboard")
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao criar conta")
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
