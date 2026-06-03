import { useQuery } from "@tanstack/react-query"

import { financialKeys } from "./queries"
import { financialService } from "../services/financial.service"

import type { PaginationParams } from "@/types/pagination"

export function useTransactions(params: PaginationParams = {}) {
  return useQuery({
    queryKey: financialKeys.list(params),
    queryFn: () => financialService.list(params),
  })
}
