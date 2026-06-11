import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface OptionalsLoadingSkeletonProps {
  className?: string
}

export function OptionalsLoadingSkeleton({ className }: OptionalsLoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr]",
        className,
      )}
    >
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="space-y-3 pb-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardHeader>
        <CardContent className="space-y-2 px-3 pb-3 pt-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-center md:flex-col">
        <Skeleton className="size-10 shrink-0 rounded-full" />
      </div>

      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-44" />
        </CardHeader>
        <CardContent className="space-y-2 px-3 pb-3 pt-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
