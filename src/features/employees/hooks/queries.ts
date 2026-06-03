import type { PaginationParams } from "@/types/pagination"

export const employeesKeys = {
  all: ["employees"] as const,
  list: (params?: PaginationParams) =>
    [...employeesKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...employeesKeys.all, "detail", id] as const,
}
