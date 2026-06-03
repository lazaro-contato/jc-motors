import { useQuery } from "@tanstack/react-query"

import { categoriesKeys } from "./queries"
import { categoriesService } from "../services/categories.service"

import type { PaginationParams } from "@/types/pagination"

export function useCategories(params: PaginationParams = {}) {
  return useQuery({
    queryKey: categoriesKeys.list(params),
    queryFn: () => categoriesService.list(params),
  })
}
