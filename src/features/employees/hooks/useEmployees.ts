import { useQuery } from "@tanstack/react-query"

import { employeesKeys } from "./queries"
import { employeesService } from "../services/employees.service"

import type { PaginationParams } from "@/types/pagination"

export function useEmployees(params: PaginationParams = {}) {
  return useQuery({
    queryKey: employeesKeys.list(params),
    queryFn: () => employeesService.list(params),
  })
}
