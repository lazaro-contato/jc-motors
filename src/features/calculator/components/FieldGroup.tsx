import type { ReactNode } from "react"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface FieldGroupProps {
  title: string
  description?: string
  columns?: 2 | 3
  children: ReactNode
}

export function FieldGroup({
  title,
  description,
  columns = 3,
  children,
}: FieldGroupProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Separator />
      <div
        className={cn(
          "grid gap-4 md:gap-5",
          columns === 3 && "md:grid-cols-3",
          columns === 2 && "md:grid-cols-2",
        )}
      >
        {children}
      </div>
    </section>
  )
}
