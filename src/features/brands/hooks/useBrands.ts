import { useQuery } from "@tanstack/react-query"

import { brandsKeys } from "./queries"
import { brandsService } from "../services/brands.service"

import type { PaginationParams } from "@/types/pagination"

export function useBrands(params: PaginationParams = {}) {
  return useQuery({
    queryKey: brandsKeys.list(params),
    queryFn: () => brandsService.list(params),
  })
}
