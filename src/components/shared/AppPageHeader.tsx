import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AppPageHeaderProps {
  title: string
  subtitle?: string
  /** Renderiza botão de voltar à esquerda do título */
  onBack?: () => void
  /** Conteúdo à direita do header (botões, badges, etc.) */
  action?: React.ReactNode
  /** Classes adicionais no container */
  className?: string
}

export function AppPageHeader({
  title,
  subtitle,
  onBack,
  action,
  className,
}: AppPageHeaderProps) {
  return (
    <div
      className={cn(
        onBack
          ? "flex items-center gap-4"
          : "flex items-start justify-between",
        className,
      )}
    >
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 rounded-xl text-muted-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
        </Button>
      )}

      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
