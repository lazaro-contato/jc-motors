import { Eye, Pencil, Trash2, UserSquare } from "lucide-react"

import { type AppDataTableColumn } from "@/components/shared/AppDataTable"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Employee } from "@/types/employees"
import { EMPLOYEE_STATUS_CONFIG } from "../data/employees.mock"

export const employeeColumns: AppDataTableColumn<Employee>[] = [
  {
    key: "fullName",
    header: "Funcionário",
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
          <UserSquare className="size-4 text-brand-600 dark:text-silver-300" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{row.fullName}</p>
          <p className="text-xs text-muted-foreground">{row.role ?? "—"}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Cargo",
    className: "hidden sm:table-cell",
    render: (value) => (
      <span className="text-sm text-muted-foreground">{(value as string | null) ?? "—"}</span>
    ),
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
    key: "isActive",
    header: "Status",
    className: "hidden md:table-cell",
    render: (value) => {
      const key = value ? "active" : "inactive"
      const cfg = EMPLOYEE_STATUS_CONFIG[key]
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
