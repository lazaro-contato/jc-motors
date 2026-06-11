import { useQuery } from "@tanstack/react-query"

import type { PaginationParams } from "@/types/pagination"

import { optionalsKeys } from "@/features/optionals/hooks/queries"
import { optionalsService } from "@/features/optionals/services/optionals.service"

export function useGetOptionals(params: PaginationParams = {}) {
  return useQuery({
    queryKey: optionalsKeys.list(params),
    queryFn: () => optionalsService.list(params),
  })
}
