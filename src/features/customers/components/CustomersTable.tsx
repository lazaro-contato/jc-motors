import { Eye, Pencil, Trash2, Users } from "lucide-react"

import { type AppDataTableColumn } from "@/components/shared/AppDataTable"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Customer } from "@/types/customers"
import { CUSTOMER_STATUS_CONFIG, PERSON_TYPE_CONFIG } from "../data/customers.mock"

export const customerColumns: AppDataTableColumn<Customer>[] = [
  {
    key: "full_name",
    header: "Cliente",
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
          <Users className="size-4 text-brand-600 dark:text-silver-300" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{row.full_name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "person_type",
    header: "Tipo",
    className: "hidden sm:table-cell",
    render: (value) => {
      const cfg = PERSON_TYPE_CONFIG[value as "PF" | "PJ"]
      const isPF = value === "PF"
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            isPF ? "bg-silver-100 text-brand-600 dark:bg-silver-800 dark:text-silver-300" : "bg-info-bg text-info",
          )}
        >
          {cfg.short}
        </span>
      )
    },
  },
  {
    key: "document",
    header: "Documento",
    className: "hidden md:table-cell font-mono text-sm text-muted-foreground",
  },
  {
    key: "phone",
    header: "Telefone",
    className: "hidden lg:table-cell",
    render: (value) => (
      <span className="text-sm text-muted-foreground">{(value as string | null) ?? "—"}</span>
    ),
  },
  {
    key: "is_active",
    header: "Status",
    render: (value) => {
      const key = value ? "active" : "inactive"
      const cfg = CUSTOMER_STATUS_CONFIG[key]
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
    render: () => (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <Eye className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 rounded-lg text-muted-foreground hover:text-danger"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    ),
  },
]
