import { BarChart2, Car, DollarSign, ShoppingCart, TrendingUp } from "lucide-react"

import { StatCard } from "@/components/shared/StatCard"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth.store"

import { InventoryCard } from "../components/InventoryCard"
import { RecentSalesTable } from "../components/RecentSalesTable"
import { SecondaryMetrics } from "../components/SecondaryMetrics"
import { TaskList } from "../components/TaskList"
import { TopSellersCard } from "../components/TopSellersCard"

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.employee?.full_name?.split(" ")[0] ?? "Usuário"

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"
  const dateLabel = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {greeting}, {firstName}!
          </h1>
          <p className="mt-0.5 text-sm capitalize text-muted-foreground">{dateLabel}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <TrendingUp className="size-3.5" />
          Relatório do mês
        </Button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Veículos Disponíveis"
          value="6"
          icon={<Car className="size-5" />}
          intent="brand"
          trend="+2 esta semana"
          trendDirection="up"
        />
        <StatCard
          label="Vendas no Mês"
          value="R$ 605.400"
          icon={<ShoppingCart className="size-5" />}
          intent="success"
          trend="+18,3% vs. mês ant."
          trendDirection="up"
        />
        <StatCard
          label="Lucro Estimado"
          value="R$ 94.200"
          icon={<DollarSign className="size-5" />}
          intent="info"
          trend="+5,2% de margem"
          trendDirection="up"
        />
        <StatCard
          label="Tarefas Pendentes"
          value="8"
          icon={<BarChart2 className="size-5" />}
          intent="warning"
          trend="3 vencem hoje"
          trendDirection="down"
        />
      </div>

      {/* Secondary metrics */}
      <SecondaryMetrics />

      {/* Sales table + Tasks */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentSalesTable />
        </div>
        <TaskList />
      </div>

      {/* Inventory + Top sellers */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <InventoryCard />
        <TopSellersCard />
      </div>
    </div>
  )
}
