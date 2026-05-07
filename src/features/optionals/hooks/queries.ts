import type { PaginationParams } from "@/types/pagination"

export const optionalsKeys = {
  all: ["optionals"] as const,
  list: (params?: PaginationParams) =>
    [...optionalsKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...optionalsKeys.all, "detail", id] as const,
}

export const optionalProfilesKeys = {
  all: ["optional-profiles"] as const,
  list: (params?: PaginationParams) =>
    [...optionalProfilesKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...optionalProfilesKeys.all, "detail", id] as const,
}
