"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Users, Target, TrendingUp, FileText, Shield, Menu, LogOut, User } from "lucide-react"

const navigation = [
  { name: "Clientes", href: "/dashboard/clients", icon: Users },
  { name: "Metas", href: "/dashboard/goals", icon: Target },
  { name: "Projeções", href: "/dashboard/projections", icon: TrendingUp },
  { name: "Simulações", href: "/dashboard/simulations", icon: FileText },
  { name: "Seguros", href: "/dashboard/insurance", icon: Shield },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="fixed top-4 left-4 z-40 md:hidden" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent pathname={pathname} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <SidebarContent pathname={pathname} />
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center gap-x-2">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-2">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-xl font-bold">Financial Planner</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname.startsWith(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
