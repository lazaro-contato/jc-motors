/**
 * StatCard — card de métrica com ícone, valor principal e tendência.
 *
 * Uso:
 *   <StatCard
 *     label="Faturamento"
 *     value="R$ 350,4K"
 *     trend="+2,45%"
 *     trendDirection="up"
 *     icon={<BarChart2 className="size-5" />}
 *     intent="brand"
 *   />
 *
 * Props:
 *   label          — rótulo da métrica
 *   value          — valor principal
 *   icon           — ícone (ReactNode)
 *   intent         — cor do ícone: 'brand' | 'success' | 'warning' | 'danger' | 'info'
 *   trend          — texto de tendência (ex: "+2,45% este mês")
 *   trendDirection — 'up' | 'down' (define a cor e ícone da tendência)
 *   className      — classes extras no Card
 */
import type { ReactNode } from "react";

import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Intent = "brand" | "success" | "warning" | "danger" | "info";

const iconWrapperStyles: Record<Intent, string> = {
  brand: "bg-brand-100 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
};

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  intent?: Intent;
  trend?: string;
  trendDirection?: "up" | "down";
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  intent = "brand",
  trend,
  trendDirection = "up",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("flex-1 min-w-0", className)}>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">
              {label}
            </p>
            <p className="mt-1.5 text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {value}
            </p>
            {trend && (
              <p
                className={cn(
                  "mt-1 text-xs font-medium flex items-center gap-0.5",
                  trendDirection === "up" ? "text-success" : "text-danger",
                )}
              >
                {trendDirection === "up" ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {trend}
              </p>
            )}
          </div>

          <div
            className={cn(
              "shrink-0 flex size-11 items-center justify-center rounded-full",
              iconWrapperStyles[intent],
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
