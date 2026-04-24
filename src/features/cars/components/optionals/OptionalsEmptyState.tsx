import { Sparkles } from "lucide-react"

interface OptionalsEmptyStateProps {
  title?: string
  description?: string
}

export function OptionalsEmptyState({
  title = "Nenhum opcional disponível",
  description = "Não há opcionais cadastrados no sistema. Quando existirem, você poderá selecioná-los, aplicar presets e associá-los a este veículo.",
}: OptionalsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/20">
        <Sparkles className="size-5 text-brand-600" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="max-w-md text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
