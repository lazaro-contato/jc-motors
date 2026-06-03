import type { PaginationParams } from "@/types/pagination"

export const customersKeys = {
  all: ["customers"] as const,
  list: (params?: PaginationParams) =>
    [...customersKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...customersKeys.all, "detail", id] as const,
}
