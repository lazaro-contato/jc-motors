import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { AppSearchSelect } from "@/components/shared/AppSearchSelect"
import { PROVIDERS } from "@/features/providers/data/providers.mock"
import type { ProviderFormData } from "@/features/providers/data/provider.schema"
import { cn } from "@/lib/utils"
import type { Provider } from "@/types/providers"

import { ProviderCreateDialog } from "./ProviderCreateDialog"

interface ProviderSelectFieldProps {
  value?: string
  onChange: (value: string) => void
  error?: string
}

export function ProviderSelectField({
  value,
  onChange,
  error,
}: ProviderSelectFieldProps) {
  const [providers, setProviders] = useState<Provider[]>(PROVIDERS)
  const [dialogOpen, setDialogOpen] = useState(false)

  const options = providers.map((p) => ({ label: p.name, value: String(p.id) }))

  function handleCreate(data: ProviderFormData) {
    const nextId = providers.reduce((max, p) => Math.max(max, p.id), 0) + 1
    const newProvider: Provider = {
      id: nextId,
      ...data,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setProviders((prev) => [newProvider, ...prev])
    onChange(String(nextId))
    setDialogOpen(false)
    toast.success("Fornecedor cadastrado")
  }

  return (
    <>
      <AppSearchSelect
        label="Fornecedor"
        hint="Empresa ou pessoa que está vendendo o veículo."
        options={options}
        value={value}
        onChange={onChange}
        placeholder="Selecione o fornecedor..."
        searchPlaceholder="Buscar fornecedor..."
        emptyText="Nenhum fornecedor encontrado."
        error={error}
        footer={({ close }) => (
          <button
            type="button"
            onClick={() => {
              close()
              setDialogOpen(true)
            }}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-600 dark:text-brand-400",
              "transition-colors hover:bg-brand-50 dark:hover:bg-brand-950",
            )}
          >
            <Plus className="size-4" />
            Cadastrar novo fornecedor
          </button>
        )}
      />

      <ProviderCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreate}
      />
    </>
  )
}
