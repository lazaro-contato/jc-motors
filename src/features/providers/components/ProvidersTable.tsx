import { Building2, Eye, Trash2 } from "lucide-react"

import { type AppDataTableColumn } from "@/components/shared/AppDataTable"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Provider, ProviderStatus } from "@/types/providers"
import { PROVIDER_STATUS_CONFIG } from "../data/providers.mock"

interface ProviderColumnHandlers {
  onView: (id: number) => void
  onDelete: (provider: Provider) => void
}

export function createProviderColumns({
  onView,
  onDelete,
}: ProviderColumnHandlers): AppDataTableColumn<Provider>[] {
  return [
  {
    key: "name",
    header: "Fornecedor",
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
          <Building2 className="size-4 text-brand-600 dark:text-silver-300" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.cnpj}</p>
        </div>
      </div>
    ),
  },
  {
    key: "contact",
    header: "Responsável",
    render: (_, row) => (
      <div>
        <p className="text-sm text-foreground">{row.contact}</p>
        <p className="text-xs text-muted-foreground">{row.email}</p>
      </div>
    ),
  },
  {
    key: "phone",
    header: "Telefone",
    className: "hidden md:table-cell text-sm text-muted-foreground",
  },
  {
    key: "city",
    header: "Localidade",
    className: "hidden lg:table-cell",
    render: (_, row) => (
      <span className="text-sm text-muted-foreground">
        {row.city}, {row.state}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const cfg = PROVIDER_STATUS_CONFIG[value as ProviderStatus]
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            cfg.className,
          )}
        >
          {cfg.label}
        </span>
      )
    },
  },
  {
    key: "_actions",
    header: "",
    align: "right",
    render: (_, row) => (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => onView(row.id)}
        >
          <Eye className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-lg text-muted-foreground hover:text-danger"
          onClick={() => onDelete(row)}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    ),
  },
  ]
}
