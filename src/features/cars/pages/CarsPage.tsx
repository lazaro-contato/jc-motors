import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Car, Eye, Pencil, Plus, Trash2 } from "lucide-react";

import {
  AppDataTable,
  type AppDataTableColumn,
} from "@/components/shared/AppDataTable";
import { AppButton } from "@/components/shared/AppButton";
import { AppPageHeader } from "@/components/shared/AppPageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Tipos ──────────────────────────────────────────────────────────────── */

type FuelType =
  | "Gasolina"
  | "Álcool"
  | "Flex"
  | "Diesel"
  | "Elétrico"
  | "Híbrido";
type VehicleStatus = "available" | "reserved" | "sold" | "preparing";

interface Vehicle extends Record<string, unknown> {
  id: number;
  name: string;
  plate: string;
  year: number;
  color: string;
  fuel: FuelType;
  km: string;
  status: VehicleStatus;
  price: string;
}

/* ── Mock data ───────────────────────────────────────────────────────────── */

const VEHICLES: Vehicle[] = [
  {
    id: 1,
    name: "Chevrolet Onix Plus",
    plate: "BRA-2E19",
    year: 2023,
    color: "Branco",
    fuel: "Flex",
    km: "12.400 km",
    status: "available",
    price: "R$ 89.990",
  },
  {
    id: 2,
    name: "Toyota Corolla XEi",
    plate: "QWE-3F45",
    year: 2022,
    color: "Preto",
    fuel: "Flex",
    km: "28.700 km",
    status: "reserved",
    price: "R$ 142.000",
  },
  {
    id: 3,
    name: "Volkswagen Polo",
    plate: "RTY-4G78",
    year: 2024,
    color: "Prata",
    fuel: "Gasolina",
    km: "4.200 km",
    status: "available",
    price: "R$ 112.500",
  },
  {
    id: 4,
    name: "Hyundai HB20 S",
    plate: "UIO-5H01",
    year: 2023,
    color: "Vermelho",
    fuel: "Flex",
    km: "18.300 km",
    status: "preparing",
    price: "R$ 79.900",
  },
  {
    id: 5,
    name: "Honda HR-V EX",
    plate: "PAS-6J34",
    year: 2024,
    color: "Azul",
    fuel: "Híbrido",
    km: "8.900 km",
    status: "available",
    price: "R$ 195.000",
  },
  {
    id: 6,
    name: "Toyota Hilux CD SRX",
    plate: "DFG-7K67",
    year: 2022,
    color: "Prata",
    fuel: "Diesel",
    km: "42.100 km",
    status: "sold",
    price: "R$ 295.000",
  },
  {
    id: 7,
    name: "Jeep Compass Limited",
    plate: "HJK-8L90",
    year: 2023,
    color: "Branco",
    fuel: "Flex",
    km: "21.600 km",
    status: "available",
    price: "R$ 198.500",
  },
  {
    id: 8,
    name: "Volkswagen T-Cross",
    plate: "LZX-9M23",
    year: 2023,
    color: "Laranja",
    fuel: "Gasolina",
    km: "15.400 km",
    status: "reserved",
    price: "R$ 138.000",
  },
  {
    id: 9,
    name: "Fiat Pulse Impetus",
    plate: "CVB-0N56",
    year: 2024,
    color: "Cinza",
    fuel: "Flex",
    km: "6.700 km",
    status: "available",
    price: "R$ 132.900",
  },
  {
    id: 10,
    name: "BMW 320i M Sport",
    plate: "NMQ-1P89",
    year: 2022,
    color: "Preto",
    fuel: "Gasolina",
    km: "35.200 km",
    status: "preparing",
    price: "R$ 269.900",
  },
];

/* ── Status config ───────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<
  VehicleStatus,
  { label: string; className: string }
> = {
  available: { label: "Disponível", className: "bg-success-bg  text-success" },
  reserved: { label: "Reservado", className: "bg-info-bg     text-info" },
  sold: { label: "Vendido", className: "bg-muted       text-muted-foreground" },
  preparing: { label: "Em prep.", className: "bg-warning-bg  text-warning" },
};

/* ── Column definitions ──────────────────────────────────────────────────── */

const baseVehicleListColumns: AppDataTableColumn<Vehicle>[] = [
  {
    key: "name",
    header: "Veículo",
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
          <Car className="size-4 text-brand-600 dark:text-silver-300" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">
            {row.color} · {row.km}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "plate",
    header: "Placa",
    className: "hidden sm:table-cell",
    render: (_, row) => (
      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-medium text-foreground">
        {row.plate}
      </span>
    ),
  },
  {
    key: "year",
    header: "Ano",
    align: "center",
    className: "hidden md:table-cell text-muted-foreground",
  },
  {
    key: "fuel",
    header: "Combustível",
    className: "hidden lg:table-cell text-muted-foreground text-sm",
  },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const cfg = STATUS_CONFIG[value as VehicleStatus];
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            cfg.className,
          )}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "price",
    header: "Preço",
    align: "right",
    className: "font-semibold text-foreground",
  },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function CarsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const columns = useMemo<AppDataTableColumn<Vehicle>[]>(
    () => [
      ...baseVehicleListColumns,
      {
        key: "_actions",
        header: "",
        align: "right",
        render: (_, row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Eye className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() =>
                navigate({
                  to: "/cars/$id/edit",
                  params: { id: String(row.id) },
                })
              }
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 rounded-lg text-muted-foreground hover:text-danger"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  const filtered = VEHICLES.filter(
    (v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.plate.toLowerCase().includes(query.toLowerCase()),
  );

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="Veículos"
        subtitle="Gerencie o estoque de veículos da concessionária."
        action={
          <AppButton
            intent="default"
            className="gap-2"
            onClick={() => navigate({ to: "/cars/new" })}
          >
            <Plus className="size-4" />
            Novo Veículo
          </AppButton>
        }
      />

      {/* Table */}
      <AppDataTable
        columns={columns}
        data={paginated}
        total={filtered.length}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchPlaceholder="Buscar por nome ou placa..."
        onSearch={(q) => {
          setQuery(q);
          setPage(1);
        }}
        emptyText="Nenhum veículo encontrado."
      />
    </div>
  );
}
