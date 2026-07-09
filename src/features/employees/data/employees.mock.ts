import type { Employee } from "@/types/employees"

/* ── Status config ───────────────────────────────────────────────────────── */

export const EMPLOYEE_STATUS_CONFIG = {
  active:   { label: "Ativo",   className: "bg-success-bg text-success" },
  inactive: { label: "Inativo", className: "bg-muted text-muted-foreground" },
} as const

/* ── Mock data ───────────────────────────────────────────────────────────── */

export const EMPLOYEES: Employee[] = [
  {
    id: 1,
    user: { id: 1, email: "carlos.silva@jcmotors.com.br", is_active: true, is_staff: true, date_joined: "2023-01-10" },
    full_name: "Carlos Eduardo Silva",
    phone: "(11) 99876-5432",
    role: "Gerente de Vendas",
    is_active: true,
    created_at: "2023-01-10",
    updated_at: "2023-01-10",
  },
  {
    id: 2,
    user: { id: 2, email: "ana.souza@jcmotors.com.br", is_active: true, is_staff: false, date_joined: "2023-03-15" },
    full_name: "Ana Paula Souza",
    phone: "(11) 98765-4321",
    role: "Vendedora",
    is_active: true,
    created_at: "2023-03-15",
    updated_at: "2023-03-15",
  },
  {
    id: 3,
    user: { id: 3, email: "marcos.lima@jcmotors.com.br", is_active: true, is_staff: false, date_joined: "2023-06-01" },
    full_name: "Marcos Antônio Lima",
    phone: "(11) 97654-3210",
    role: "Vendedor",
    is_active: true,
    created_at: "2023-06-01",
    updated_at: "2023-06-01",
  },
  {
    id: 4,
    user: { id: 4, email: "fernanda.costa@jcmotors.com.br", is_active: true, is_staff: false, date_joined: "2023-08-20" },
    full_name: "Fernanda Costa Alves",
    phone: "(11) 96543-2109",
    role: "Financeiro",
    is_active: true,
    created_at: "2023-08-20",
    updated_at: "2023-08-20",
  },
  {
    id: 5,
    user: { id: 5, email: "roberto.nunes@jcmotors.com.br", is_active: false, is_staff: false, date_joined: "2022-11-05" },
    full_name: "Roberto Nunes Pinto",
    phone: "(11) 95432-1098",
    role: "Vendedor",
    is_active: false,
    created_at: "2022-11-05",
    updated_at: "2024-01-15",
  },
  {
    id: 6,
    user: { id: 6, email: "patricia.mendes@jcmotors.com.br", is_active: true, is_staff: false, date_joined: "2024-01-08" },
    full_name: "Patrícia Mendes Rocha",
    phone: "(11) 94321-0987",
    role: "Administrativa",
    is_active: true,
    created_at: "2024-01-08",
    updated_at: "2024-01-08",
  },
  {
    id: 7,
    user: { id: 7, email: "joao.ferreira@jcmotors.com.br", is_active: true, is_staff: false, date_joined: "2024-02-12" },
    full_name: "João Ferreira Melo",
    phone: null,
    role: "Preparador de Veículos",
    is_active: true,
    created_at: "2024-02-12",
    updated_at: "2024-02-12",
  },
  {
    id: 8,
    user: { id: 8, email: "lucia.barbosa@jcmotors.com.br", is_active: true, is_staff: true, date_joined: "2022-05-20" },
    full_name: "Lúcia Barbosa Teixeira",
    phone: "(11) 93210-9876",
    role: "Diretora Administrativa",
    is_active: true,
    created_at: "2022-05-20",
    updated_at: "2022-05-20",
  },
]
