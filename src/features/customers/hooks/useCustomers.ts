import { useQuery } from "@tanstack/react-query"

import { customersKeys } from "./queries"
import { customersService } from "../services/customers.service"

import type { PaginationParams } from "@/types/pagination"

export function useCustomers(params: PaginationParams = {}) {
  return useQuery({
    queryKey: customersKeys.list(params),
    queryFn: () => customersService.list(params),
  })
}
