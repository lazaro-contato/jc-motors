import type { PaginationParams } from "@/types/pagination"

export const financialKeys = {
  all: ["financial"] as const,
  list: (params?: PaginationParams) =>
    [...financialKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...financialKeys.all, "detail", id] as const,
}
