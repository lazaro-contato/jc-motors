import { Sparkles } from "lucide-react"

export function OptionalsTab() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/20">
        <Sparkles className="size-5 text-brand-600" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">Opcionais do veículo</p>
        <p className="max-w-md text-xs text-muted-foreground">
          Em breve você poderá selecionar os opcionais do carro (ar condicionado, teto solar,
          multimídia, etc.) ou aplicar um preset editável.
        </p>
      </div>
    </div>
  )
}
