import type { PaginationParams } from "@/types/pagination"

export const categoriesKeys = {
  all: ["categories"] as const,
  list: (params?: PaginationParams) =>
    [...categoriesKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...categoriesKeys.all, "detail", id] as const,
}
