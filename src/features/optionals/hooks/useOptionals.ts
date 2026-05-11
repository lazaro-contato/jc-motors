import { useQuery } from "@tanstack/react-query"

import { optionalsKeys } from "./queries"
import { optionalsService } from "../services/optionals.service"

import type { PaginationParams } from "@/types/pagination"


export function useOptionals(params: PaginationParams = {}) {
  return useQuery({
    queryKey: optionalsKeys.list(params),
    queryFn: () => optionalsService.list(params),
  })
}
