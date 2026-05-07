import { useQuery } from "@tanstack/react-query"

import type { PaginationParams } from "@/types/pagination"

import { optionalsService } from "../services/optionals.service"
import { optionalsKeys } from "./queries"

export function useOptionals(params: PaginationParams = {}) {
  return useQuery({
    queryKey: optionalsKeys.list(params),
    queryFn: () => optionalsService.list(params),
  })
}
