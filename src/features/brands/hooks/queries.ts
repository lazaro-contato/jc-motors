import type { PaginationParams } from "@/types/pagination"

export const brandsKeys = {
  all: ["brands"] as const,
  list: (params?: PaginationParams) =>
    [...brandsKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...brandsKeys.all, "detail", id] as const,
}
