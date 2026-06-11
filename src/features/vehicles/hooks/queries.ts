import type { PaginationParams } from "@/types/pagination"

export const vehiclesKeys = {
  all: ["vehicles"] as const,
  list: (params?: PaginationParams) =>
    [...vehiclesKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...vehiclesKeys.all, "detail", id] as const,
}
