import type { Sale, SaleStatus } from "@/types/sales"

/* ── Status config ───────────────────────────────────────────────────────── */

export const SALE_STATUS_CONFIG: Record<SaleStatus, { label: string; className: string }> = {
  open:      { label: "Em andamento", className: "bg-info-bg text-info" },
  completed: { label: "Concluída",    className: "bg-success-bg text-success" },
  canceled:  { label: "Cancelada",    className: "bg-danger-bg text-danger" },
}

export const SALE_STATUS_OPTIONS = [
  { label: "Todos",        value: "all" },
  { label: "Em andamento", value: "open" },
  { label: "Concluídas",   value: "completed" },
  { label: "Canceladas",   value: "canceled" },
]

/* ── Mock data — carros disponíveis para seleção no formulário ─────────── */

export const AVAILABLE_CARS_OPTIONS = [
  { label: "Honda HR-V EX 2024 · ABC-1234",           value: "1" },
  { label: "Jeep Compass Limited 2023 · DEF-5678",    value: "2" },
  { label: "Toyota Corolla XEi 2024 · GHI-9012",      value: "3" },
  { label: "Volkswagen T-Cross 1.4 2023 · JKL-3456",  value: "4" },
  { label: "Fiat Pulse Impetus 2024 · MNO-7890",       value: "5" },
  { label: "BMW 320i M Sport 2023 · PQR-2345",         value: "6" },
]

export const CUSTOMERS_OPTIONS = [
  { label: "Lucas Ferreira da Silva",       value: "1" },
  { label: "Mariana Oliveira Santos",       value: "2" },
  { label: "Auto Center Brasil Ltda.",      value: "3" },
  { label: "Rafael Mendes Costa",           value: "4" },
  { label: "Ana Paula Ramos",               value: "5" },
  { label: "Ricardo Oliveira Neto",         value: "6" },
]

export const EMPLOYEES_OPTIONS = [
  { label: "Carlos Eduardo Silva",   value: "1" },
  { label: "Ana Paula Souza",        value: "2" },
  { label: "Marcos Antônio Lima",    value: "3" },
  { label: "Fernanda Costa Alves",   value: "4" },
  { label: "Patrícia Mendes Rocha",  value: "6" },
]

/* ── Mock data — listagem de vendas ──────────────────────────────────────── */

export const SALES: Sale[] = [
  {
    id: 1,
    car: { id: 1, brand: "Honda", model: "HR-V EX", plate: "ABC-1234", year_model: 2024 },
    customer: { id: 1, full_name: "Lucas Ferreira da Silva", document: "123.456.789-00" },
    employee: { id: 2, full_name: "Ana Paula Souza", role: "Vendedora" },
    sale_price: "195000.00",
    status: "completed",
    notes: null,
    sold_at: "2026-03-10",
    created_at: "2026-03-08",
    updated_at: "2026-03-10",
  },
  {
    id: 2,
    car: { id: 2, brand: "Jeep", model: "Compass Limited", plate: "DEF-5678", year_model: 2023 },
    customer: { id: 2, full_name: "Mariana Oliveira Santos", document: "987.654.321-00" },
    employee: { id: 3, full_name: "Marcos Antônio Lima", role: "Vendedor" },
    sale_price: "198500.00",
    status: "open",
    notes: "Cliente aguarda financiamento",
    sold_at: null,
    created_at: "2026-03-10",
    updated_at: "2026-03-10",
  },
  {
    id: 3,
    car: { id: 6, brand: "BMW", model: "320i M Sport", plate: "PQR-2345", year_model: 2023 },
    customer: { id: 4, full_name: "Rafael Mendes Costa", document: "456.789.123-00" },
    employee: { id: 2, full_name: "Ana Paula Souza", role: "Vendedora" },
    sale_price: "269900.00",
    status: "open",
    notes: null,
    sold_at: null,
    created_at: "2026-03-09",
    updated_at: "2026-03-09",
  },
  {
    id: 4,
    car: { id: 3, brand: "Toyota", model: "Corolla XEi", plate: "GHI-9012", year_model: 2024 },
    customer: { id: 5, full_name: "Ana Paula Ramos", document: "789.123.456-00" },
    employee: { id: 3, full_name: "Marcos Antônio Lima", role: "Vendedor" },
    sale_price: "142000.00",
    status: "completed",
    notes: null,
    sold_at: "2026-03-08",
    created_at: "2026-03-06",
    updated_at: "2026-03-08",
  },
  {
    id: 5,
    car: { id: 4, brand: "Volkswagen", model: "T-Cross 1.4", plate: "JKL-3456", year_model: 2023 },
    customer: { id: 6, full_name: "Ricardo Oliveira Neto", document: "147.258.369-00" },
    employee: { id: 3, full_name: "Marcos Antônio Lima", role: "Vendedor" },
    sale_price: "138000.00",
    status: "canceled",
    notes: "Cliente desistiu da compra",
    sold_at: null,
    created_at: "2026-03-07",
    updated_at: "2026-03-07",
  },
  {
    id: 6,
    car: { id: 5, brand: "Fiat", model: "Pulse Impetus", plate: "MNO-7890", year_model: 2024 },
    customer: { id: 3, full_name: "Auto Center Brasil Ltda.", document: "12.345.678/0001-90" },
    employee: { id: 4, full_name: "Fernanda Costa Alves", role: "Financeiro" },
    sale_price: "111900.00",
    status: "completed",
    notes: null,
    sold_at: "2026-02-28",
    created_at: "2026-02-26",
    updated_at: "2026-02-28",
  },
  {
    id: 7,
    car: { id: 7, brand: "Hyundai", model: "Creta Platinum", plate: "STU-6789", year_model: 2024 },
    customer: { id: 2, full_name: "Mariana Oliveira Santos", document: "987.654.321-00" },
    employee: { id: 2, full_name: "Ana Paula Souza", role: "Vendedora" },
    sale_price: "152900.00",
    status: "open",
    notes: "Aguarda avaliação de seminovo",
    sold_at: null,
    created_at: "2026-03-12",
    updated_at: "2026-03-12",
  },
  {
    id: 8,
    car: { id: 8, brand: "Chevrolet", model: "Onix Plus LTZ", plate: "VWX-0123", year_model: 2023 },
    customer: { id: 1, full_name: "Lucas Ferreira da Silva", document: "123.456.789-00" },
    employee: { id: 6, full_name: "Patrícia Mendes Rocha", role: "Administrativa" },
    sale_price: "89990.00",
    status: "canceled",
    notes: "Reprovado no crédito",
    sold_at: null,
    created_at: "2026-02-20",
    updated_at: "2026-02-22",
  },
]
