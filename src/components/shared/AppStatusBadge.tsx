import { labelVariantClasses, type LabelVariant } from "@/lib/labels"
import { cn } from "@/lib/utils"

interface AppStatusBadgeProps {
  label: string
  variant?: LabelVariant
  className?: string
}

export function AppStatusBadge({
  label,
  variant = "default",
  className,
}: AppStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        labelVariantClasses[variant],
        className,
      )}
    >
      {label}
    </span>
  )
}
