import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  BarChart2,
  Bell,
  Car,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  DollarSign,
  Eye,
  Mail,
  Search,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import { AppTextarea } from "@/components/shared/AppTextarea";
import { AppMultiSelect } from "@/components/shared/AppMultiSelect";
import { AppSearchSelect } from "@/components/shared/AppSearchSelect";
import { AppSelect } from "@/components/shared/AppSelect";
import { AppTable, type AppTableColumn } from "@/components/shared/AppTable";
import {
  AppDataTable,
  type AppDataTableColumn,
} from "@/components/shared/AppDataTable";
import { StatCard } from "@/components/shared/StatCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-foreground">{children}</h2>
      <div className="mt-1 h-0.5 w-10 rounded-full bg-primary" />
    </div>
  );
}

function ColorSwatch({
  name,
  hex,
  dark = false,
}: {
  name: string;
  hex: string;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-14 w-full rounded-md border border-border/30 shadow-sm"
        style={{ backgroundColor: hex }}
      />
      <p
        className={`text-[11px] font-semibold ${dark ? "text-foreground" : "text-muted-foreground"}`}
      >
        {name}
      </p>
      <p className="font-mono text-[11px] text-muted-foreground">{hex}</p>
    </div>
  );
}

function ProgressBar({
  value,
  gradient,
  color,
}: {
  value: number;
  gradient?: string;
  color?: string;
}) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${value}%`,
          background:
            gradient ??
            (color
              ? color
              : "linear-gradient(90deg, #3F3F46 0%, #A1A1AA 100%)"),
        }}
      />
    </div>
  );
}

/* ─── Data ────────────────────────────────────────────────────────────────── */

const brandPalette = [
  { name: "50", hex: "#F7F7F8" },
  { name: "100", hex: "#EBEBED" },
  { name: "200", hex: "#D4D4D8" },
  { name: "300", hex: "#A1A1AA" },
  { name: "400", hex: "#71717A" },
  { name: "500", hex: "#3F3F46" },
  { name: "600", hex: "#2E2E33" },
  { name: "700", hex: "#27272A" },
  { name: "800", hex: "#1C1C1F" },
  { name: "900", hex: "#131316" },
];

const silverPalette = [
  { name: "50", hex: "#FAFAFA" },
  { name: "100", hex: "#F4F4F5" },
  { name: "200", hex: "#E4E4E7" },
  { name: "300", hex: "#D4D4D8" },
  { name: "400", hex: "#A1A1AA" },
  { name: "500", hex: "#71717A" },
  { name: "600", hex: "#52525B" },
  { name: "700", hex: "#3F3F46" },
  { name: "800", hex: "#27272A" },
  { name: "900", hex: "#18181B" },
];

const navyPalette = [
  { name: "50", hex: "#FAFAFA" },
  { name: "100", hex: "#F4F4F5" },
  { name: "200", hex: "#E4E4E7" },
  { name: "300", hex: "#A1A1AA" },
  { name: "400", hex: "#71717A" },
  { name: "500", hex: "#52525B" },
  { name: "600", hex: "#3F3F46" },
  { name: "700", hex: "#27272A" },
  { name: "800", hex: "#1C1C1F" },
  { name: "900", hex: "#0F0F12" },
];

const semanticColors = [
  { name: "Success", hex: "#22C55E", bg: "#DCFCE7", label: "success" },
  { name: "Warning", hex: "#F59E0B", bg: "#FEF9C3", label: "warning" },
  { name: "Danger", hex: "#EF4444", bg: "#FEE2E2", label: "danger" },
  { name: "Info", hex: "#3B82F6", bg: "#DBEAFE", label: "info" },
];

const tableData = [
  {
    name: "Honda Civic 2022",
    plate: "ABC-1234",
    price: "R$ 85.000",
    status: "available",
  },
  {
    name: "Toyota Corolla 2021",
    plate: "DEF-5678",
    price: "R$ 78.000",
    status: "preparing",
  },
  {
    name: "VW Golf 2023",
    plate: "GHI-9012",
    price: "R$ 112.000",
    status: "sold",
  },
  {
    name: "Ford Ranger 2020",
    plate: "JKL-3456",
    price: "R$ 145.000",
    status: "reserved",
  },
];

const statusConfig: Record<
  string,
  { label: string; className: string; bg: string; text: string }
> = {
  available: { label: "Disponível", className: "bg-success-bg text-success", bg: "#c9f7e6", text: "#01b574" },
  preparing: { label: "Em preparação", className: "bg-warning-bg text-warning", bg: "#fff5dc", text: "#b97a1a" },
  sold: { label: "Vendido", className: "bg-muted text-muted-foreground", bg: "#e9effd", text: "#4a5b8c" },
  reserved: { label: "Reservado", className: "bg-info-bg text-info", bg: "#e1f5ff", text: "#1a6fa8" },
};

type TableRow = { name: string; plate: string; price: string; status: string };

const tableDataColumns: AppDataTableColumn<TableRow>[] = [
  {
    key: "name",
    header: "Veículo",
    render: (_, row) => (
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-silver-100 dark:bg-silver-800">
          <Car className="size-4 text-brand-600 dark:text-silver-300" />
        </div>
        <span className="font-medium text-foreground">{row.name}</span>
      </div>
    ),
  },
  {
    key: "plate",
    header: "Placa",
    className: "font-mono text-muted-foreground",
  },
  {
    key: "price",
    header: "Preço de Venda",
    className: "font-semibold text-foreground",
  },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const cfg = statusConfig[value as string]!;
      return (
        <span
          className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", cfg.className)}
        >
          {cfg.label}
        </span>
      );
    },
  },
  {
    key: "_actions",
    header: "Ações",
    align: "right",
    render: () => (
      <div className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon" className="size-7">
          <Eye className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7">
          <Settings className="size-3.5" />
        </Button>
      </div>
    ),
  },
];

/* ─── Select Showcase (needs state) ─────────────────────────────────────── */

const vehicleOptions = [
  { label: "Honda Civic 2022", value: "civic" },
  { label: "Toyota Corolla 2021", value: "corolla" },
  { label: "VW Golf 2023", value: "golf" },
  { label: "Ford Ranger 2020", value: "ranger" },
  { label: "Toyota Hilux 2022", value: "hilux" },
  { label: "Honda HR-V 2023", value: "hrv" },
  { label: "Toyota RAV4 2021", value: "rav4" },
  { label: "Chevrolet Onix 2023", value: "onix", disabled: true },
];

const statusOptions = [
  { label: "Disponível", value: "available" },
  { label: "Em preparação", value: "preparing" },
  { label: "Reservado", value: "reserved" },
  { label: "Vendido", value: "sold" },
];

/* ─── Table data ─────────────────────────────────────────────────────────── */

type VehicleRow = {
  placa: string;
  modelo: string;
  ano: string;
  combustivel: string;
  status: string;
  preco: string;
};

const tableVehicles: VehicleRow[] = [
  {
    placa: "ABC-1234",
    modelo: "Chevrolet Onix",
    ano: "2023",
    combustivel: "Gasolina",
    status: "Disponível",
    preco: "R$ 82.000",
  },
  {
    placa: "DEF-5678",
    modelo: "Toyota Hilux",
    ano: "2022",
    combustivel: "Diesel",
    status: "Reservado",
    preco: "R$ 290.000",
  },
  {
    placa: "GHI-9012",
    modelo: "VW Polo",
    ano: "2024",
    combustivel: "Gasolina",
    status: "Disponível",
    preco: "R$ 110.000",
  },
  {
    placa: "JKL-3456",
    modelo: "Hyundai HB20",
    ano: "2023",
    combustivel: "Gasolina",
    status: "Vendido",
    preco: "R$ 75.000",
  },
  {
    placa: "MNO-7890",
    modelo: "Honda HR-V",
    ano: "2024",
    combustivel: "Híbrido",
    status: "Disponível",
    preco: "R$ 195.000",
  },
];

const statusColors: Record<string, string> = {
  Disponível:
    "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
  Reservado: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  Vendido: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950",
};

const vehicleColumns: AppTableColumn<VehicleRow>[] = [
  { key: "placa", header: "Placa" },
  { key: "modelo", header: "Modelo" },
  { key: "ano", header: "Ano", align: "center" },
  { key: "combustivel", header: "Combustível" },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const label = value as string;
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[label] ?? ""}`}
        >
          {label}
        </span>
      );
    },
  },
  { key: "preco", header: "Preço", align: "right" },
];

function TableShowcase() {
  return (
    <section>
      <SectionTitle>AppTable</SectionTitle>
      <div className="space-y-6">
        {/* Variante padrão */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Padrão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppTable columns={vehicleColumns} data={tableVehicles} />
          </CardContent>
        </Card>

        {/* Variante listrada */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Listrada (striped)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppTable
              columns={vehicleColumns}
              data={tableVehicles}
              variant="striped"
            />
          </CardContent>
        </Card>

        {/* Variante com bordas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Com bordas (bordered)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AppTable
              columns={vehicleColumns}
              data={tableVehicles}
              variant="bordered"
            />
          </CardContent>
        </Card>

        {/* Loading e vazio */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Carregando (skeleton)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AppTable
                columns={vehicleColumns}
                data={[]}
                isLoading
                loadingRows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estado vazio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AppTable
                columns={vehicleColumns}
                data={[]}
                emptyText="Nenhum veículo encontrado."
              />
            </CardContent>
          </Card>
        </div>

        {/* Código de uso */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-navy-800 dark:bg-muted p-4 text-xs leading-relaxed text-navy-100 dark:text-foreground/80">
              {`import { AppTable } from '@/components/shared/AppTable'

const columns = [
  { key: 'placa', header: 'Placa' },
  { key: 'modelo', header: 'Modelo' },
  { key: 'preco', header: 'Preço', align: 'right' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <Badge>{value}</Badge>,
  },
]

// Padrão
<AppTable columns={columns} data={rows} />

// Listrada
<AppTable columns={columns} data={rows} variant="striped" />

// Com bordas
<AppTable columns={columns} data={rows} variant="bordered" />

// Carregando
<AppTable columns={columns} data={[]} isLoading loadingRows={5} />

// Estado vazio customizado
<AppTable columns={columns} data={[]} emptyText="Sem registros." />`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function SelectShowcase() {
  const [selectVal, setSelectVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [multiVal, setMultiVal] = useState<string[]>([]);

  return (
    <section>
      <SectionTitle>Select Components</SectionTitle>
      <div className="space-y-6">
        {/* AppSelect */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <code className="font-mono text-xs">AppSelect</code> — Select
              padrão com API de opções
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Padrão</Label>
              <AppSelect
                options={statusOptions}
                value={selectVal}
                onValueChange={setSelectVal}
                placeholder="Selecione o status"
              />
              {selectVal && (
                <p className="text-xs text-muted-foreground">
                  Selecionado: <strong>{selectVal}</strong>
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Tamanho sm</Label>
              <AppSelect
                options={statusOptions}
                placeholder="Selecione"
                size="sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Desabilitado</Label>
              <AppSelect
                options={statusOptions}
                placeholder="Não disponível"
                isDisabled
              />
            </div>
            <div className="space-y-1.5">
              <Label>Com erro</Label>
              <AppSelect
                options={statusOptions}
                placeholder="Selecione o status"
                error="Campo obrigatório."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Item desabilitado</Label>
              <AppSelect
                options={vehicleOptions}
                placeholder="Selecione o veículo"
              />
            </div>
          </CardContent>
        </Card>

        {/* AppSearchSelect */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <code className="font-mono text-xs">AppSearchSelect</code> —
              Seleção única com busca
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Padrão</Label>
              <AppSearchSelect
                options={vehicleOptions}
                value={searchVal}
                onChange={setSearchVal}
                placeholder="Selecione o veículo"
                searchPlaceholder="Buscar veículo..."
              />
              {searchVal && (
                <p className="text-xs text-muted-foreground">
                  Selecionado: <strong>{searchVal}</strong>
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Desabilitado</Label>
              <AppSearchSelect
                options={vehicleOptions}
                placeholder="Não disponível"
                isDisabled
              />
            </div>
            <div className="space-y-1.5">
              <Label>Com erro</Label>
              <AppSearchSelect
                options={vehicleOptions}
                placeholder="Selecione o veículo"
                error="Selecione ao menos um veículo."
              />
            </div>
          </CardContent>
        </Card>

        {/* AppMultiSelect */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              <code className="font-mono text-xs">AppMultiSelect</code> —
              Seleção múltipla com busca
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Padrão</Label>
              <AppMultiSelect
                options={vehicleOptions}
                value={multiVal}
                onChange={setMultiVal}
                placeholder="Selecione os veículos"
                searchPlaceholder="Buscar veículo..."
              />
              {multiVal.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {multiVal.length} selecionado(s)
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Desabilitado</Label>
              <AppMultiSelect
                options={vehicleOptions}
                placeholder="Não disponível"
                isDisabled
              />
            </div>
            <div className="space-y-1.5">
              <Label>Com erro</Label>
              <AppMultiSelect
                options={vehicleOptions}
                placeholder="Selecione os responsáveis"
                error="Selecione ao menos um responsável."
              />
            </div>
          </CardContent>
        </Card>

        {/* Código de uso */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-navy-800 dark:bg-muted p-4 text-xs leading-relaxed text-navy-100 dark:text-foreground/80">
              {`import { AppSelect } from '@/components/shared/AppSelect'
import { AppSearchSelect } from '@/components/shared/AppSearchSelect'
import { AppMultiSelect } from '@/components/shared/AppMultiSelect'

const options = [
  { label: 'Honda Civic', value: 'civic' },
  { label: 'Toyota Corolla', value: 'corolla' },
  { label: 'VW Golf', value: 'golf', disabled: true },
]

// Select simples
<AppSelect
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Selecione"
/>

// Com busca (single)
<AppSearchSelect
  options={options}
  value={value}
  onChange={setValue}
  searchPlaceholder="Buscar..."
/>

// Multi-seleção com busca
<AppMultiSelect
  options={options}
  value={values}     // string[]
  onChange={setValues}
  maxBadges={2}
/>

// Com erro e desabilitado
<AppSelect options={options} error="Campo obrigatório." />
<AppSelect options={options} isDisabled />`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-14 pb-16">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          JG Motors
        </p>
        <h1 className="mt-1 text-4xl font-bold text-foreground">
          Design System
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Tokens de cor, tipografia e componentes reutilizáveis da plataforma.
        </p>
      </div>

      {/* ── Cores ──────────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Paleta de Cores</SectionTitle>

        {/* Brand */}
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Brand — Charcoal / Graphite
            </p>
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
              {brandPalette.map((c) => (
                <ColorSwatch
                  key={c.name}
                  name={c.name}
                  hex={c.hex}
                  dark={["50", "100", "200", "300"].includes(c.name)}
                />
              ))}
            </div>
          </div>

          {/* Silver */}
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Silver — Metallic
            </p>
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
              {silverPalette.map((c) => (
                <ColorSwatch
                  key={c.name}
                  name={c.name}
                  hex={c.hex}
                  dark={["50", "100", "200", "300"].includes(c.name)}
                />
              ))}
            </div>
          </div>

          {/* Navy */}
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Navy — Dark UI
            </p>
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
              {navyPalette.map((c) => (
                <ColorSwatch
                  key={c.name}
                  name={c.name}
                  hex={c.hex}
                  dark={["50", "100", "200"].includes(c.name)}
                />
              ))}
            </div>
          </div>

          {/* Semantic */}
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              Semânticas — Status
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {semanticColors.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div
                      className="h-8 w-8 rounded-lg"
                      style={{ backgroundColor: c.bg }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {c.name}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {c.hex}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    bg: {c.bg}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tipografia ─────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Tipografia</SectionTitle>
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-baseline gap-4">
              <span className="w-20 shrink-0 text-xs text-muted-foreground">
                5xl / 48px
              </span>
              <p className="text-5xl font-bold text-foreground">JG Motors</p>
            </div>
            <Separator />
            <div className="flex items-baseline gap-4">
              <span className="w-20 shrink-0 text-xs text-muted-foreground">
                4xl / 36px
              </span>
              <p className="text-4xl font-bold text-foreground">
                Dashboard Principal
              </p>
            </div>
            <Separator />
            <div className="flex items-baseline gap-4">
              <span className="w-20 shrink-0 text-xs text-muted-foreground">
                3xl / 30px
              </span>
              <p className="text-3xl font-semibold text-foreground">
                Lista de Veículos
              </p>
            </div>
            <Separator />
            <div className="flex items-baseline gap-4">
              <span className="w-20 shrink-0 text-xs text-muted-foreground">
                2xl / 24px
              </span>
              <p className="text-2xl font-semibold text-foreground">
                Detalhes da Venda
              </p>
            </div>
            <Separator />
            <div className="flex items-baseline gap-4">
              <span className="w-20 shrink-0 text-xs text-muted-foreground">
                xl / 20px
              </span>
              <p className="text-xl font-medium text-foreground">
                Cadastro de Cliente
              </p>
            </div>
            <Separator />
            <div className="flex items-baseline gap-4">
              <span className="w-20 shrink-0 text-xs text-muted-foreground">
                base / 16px
              </span>
              <p className="text-base text-foreground">
                Texto base para parágrafos e descrições gerais da plataforma.
              </p>
            </div>
            <Separator />
            <div className="flex items-baseline gap-4">
              <span className="w-20 shrink-0 text-xs text-muted-foreground">
                sm / 14px
              </span>
              <p className="text-sm text-muted-foreground">
                Labels de formulário, metadados e informações secundárias.
              </p>
            </div>
            <Separator />
            <div className="flex items-baseline gap-4">
              <span className="w-20 shrink-0 text-xs text-muted-foreground">
                xs / 12px
              </span>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Captions, breadcrumbs e rótulos de seção
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Botões ─────────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Botões</SectionTitle>

        {/* AppButton — variantes de intent */}
        <div className="mt-6 space-y-4">
          <p className="text-sm font-semibold text-foreground">
            AppButton —{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              intent
            </code>{" "}
            prop
          </p>

          {/* Sólido */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sólido (padrão)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <AppButton>Default</AppButton>
              <AppButton intent="success">
                <CheckCircle2 className="size-4" />
                Confirmar
              </AppButton>
              <AppButton intent="warning">
                <Bell className="size-4" />
                Atenção
              </AppButton>
              <AppButton intent="danger">
                <XCircle className="size-4" />
                Excluir
              </AppButton>
              <AppButton intent="info">
                <TrendingUp className="size-4" />
                Relatório
              </AppButton>
            </CardContent>
          </Card>

          {/* Statuses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status (padrão)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <AppButton isLoading>Default</AppButton>
              <AppButton intent="default" disabled>
                <CheckCircle2 className="size-4" />
                Confirmar
              </AppButton>
            </CardContent>
          </Card>

          {/* Soft */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Soft (<code className="font-mono text-xs">soft</code> prop)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <AppButton soft intent="success">
                <CheckCircle2 className="size-4" />
                Aprovado
              </AppButton>
              <AppButton soft intent="warning">
                <Bell className="size-4" />
                Pendente
              </AppButton>
              <AppButton soft intent="danger">
                <XCircle className="size-4" />
                Cancelar
              </AppButton>
              <AppButton soft intent="info">
                <TrendingUp className="size-4" />
                Ver mais
              </AppButton>
            </CardContent>
          </Card>

          {/* Tamanhos com intent */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tamanhos com intent
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <AppButton intent="success" size="sm">
                Pequeno
              </AppButton>
              <AppButton intent="success">Padrão</AppButton>
              <AppButton intent="success" size="lg">
                Grande
              </AppButton>
              <AppButton intent="success" size="full" className="max-w-[200px]">
                Full Width
              </AppButton>
              <AppButton intent="success" size="icon">
                <CheckCircle2 className="size-4" />
              </AppButton>
            </CardContent>
          </Card>

          {/* Variantes shadcn via AppButton */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Variantes shadcn via{" "}
                <code className="font-mono text-xs">AppButton</code>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <AppButton>Primário</AppButton>
              <AppButton variant="secondary">Secundário</AppButton>
              <AppButton variant="outline">Outline</AppButton>
              <AppButton variant="ghost">Ghost</AppButton>
              <AppButton variant="destructive">Destrutivo</AppButton>
              <AppButton variant="link">Link</AppButton>
            </CardContent>
          </Card>

          {/* Código de uso */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-navy-800 dark:bg-muted p-4 text-xs leading-relaxed text-navy-100 dark:text-foreground/80">
                {`import { AppButton } from '@/components/shared/AppButton'

// Variantes shadcn (variant prop)
<AppButton>Primário</AppButton>
<AppButton variant="secondary">Secundário</AppButton>
<AppButton variant="outline">Outline</AppButton>
<AppButton variant="ghost">Ghost</AppButton>
<AppButton variant="destructive">Destrutivo</AppButton>
<AppButton variant="link">Link</AppButton>

// Intent colors (intent prop)
<AppButton intent="success">Confirmar</AppButton>
<AppButton intent="danger">Excluir</AppButton>
<AppButton intent="warning">Atenção</AppButton>
<AppButton intent="info">Relatório</AppButton>

// Soft (fundo claro + texto colorido)
<AppButton intent="success" soft>Aprovado</AppButton>
<AppButton intent="danger" soft>Cancelar</AppButton>

// Com tamanho e ícone
<AppButton intent="success" size="lg">
  <CheckCircle2 />
  Salvar alterações
</AppButton>`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Badges ─────────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Badges & Status</SectionTitle>
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* shadcn variants */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Variantes shadcn
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destrutivo</Badge>
              </div>
            </div>

            <Separator />

            {/* Status customizados */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status de Veículo
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([key, cfg]) => (
                  <span
                    key={key}
                    className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", cfg.className)}
                  >
                    {cfg.label}
                  </span>
                ))}
              </div>
            </div>

            <Separator />

            {/* Status de Venda */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status de Venda / Tarefa
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-info-bg px-3 py-1 text-xs font-semibold text-info">
                  <span className="size-1.5 rounded-full bg-info inline-block" />
                  Em andamento
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success">
                  <CheckCircle2 className="size-3" />
                  Concluída
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-danger-bg px-3 py-1 text-xs font-semibold text-danger">
                  <XCircle className="size-3" />
                  Cancelada
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-bg px-3 py-1 text-xs font-semibold text-warning">
                  <span className="size-1.5 rounded-full bg-warning inline-block" />
                  Pendente
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Stat Cards</SectionTitle>

        {/* Intents */}
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Variantes de intent
          </p>
          <div className="flex flex-wrap gap-4">
            <StatCard
              icon={<BarChart2 className="size-5" />}
              label="Faturamento"
              value="R$ 350,4K"
              trend="+2,45% este mês"
              intent="brand"
            />
            <StatCard
              icon={<DollarSign className="size-5" />}
              label="Vendas este mês"
              value="R$ 682,5K"
              trend="+23% vs. mês anterior"
              intent="success"
            />
            <StatCard
              icon={<Car className="size-5" />}
              label="Veículos disponíveis"
              value="24"
              intent="info"
            />
            <StatCard
              icon={<Users className="size-5" />}
              label="Clientes ativos"
              value="1.048"
              trend="+8% este mês"
              intent="warning"
            />
            <StatCard
              icon={<ShoppingCart className="size-5" />}
              label="Vendas canceladas"
              value="12"
              trend="-3 vs. mês anterior"
              trendDirection="down"
              intent="danger"
            />
            <StatCard
              icon={<CreditCard className="size-5" />}
              label="Lucro médio"
              value="R$ 18,7K"
              trend="+5,1% este mês"
              intent="brand"
            />
          </div>
        </div>

        {/* Código de uso */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-navy-800 dark:bg-muted p-4 text-xs leading-relaxed text-navy-100 dark:text-foreground/80">
              {`import { StatCard } from '@/components/shared/StatCard'

// Com tendência positiva
<StatCard
  label="Faturamento"
  value="R$ 350,4K"
  trend="+2,45% este mês"
  trendDirection="up"
  icon={<BarChart2 className="size-5" />}
  intent="brand"
/>

// Com tendência negativa
<StatCard
  label="Cancelamentos"
  value="12"
  trend="-3 vs. mês anterior"
  trendDirection="down"
  icon={<XCircle className="size-5" />}
  intent="danger"
/>

// Sem tendência
<StatCard
  label="Veículos disponíveis"
  value="24"
  icon={<Car className="size-5" />}
  intent="info"
/>`}
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* ── AppInput ──────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>AppInput</SectionTitle>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Estados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AppInput label="Padrão" placeholder="Ex: João Silva" />
              <AppInput
                label="Com dica"
                placeholder="Ex: João Silva"
                hint="Nome completo conforme documento."
              />
              <AppInput
                label="Com erro"
                placeholder="Placa inválida"
                error="Formato de placa inválido."
              />
              <AppInput
                label="Desabilitado"
                placeholder="Campo desabilitado"
                isDisabled
              />
            </CardContent>
          </Card>

          {/* Ícones e tipos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ícones & Tipos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AppInput
                label="Com ícone à esquerda"
                placeholder="Buscar veículo ou cliente..."
                leftIcon={<Search className="size-4" />}
              />
              <AppInput
                label="Email"
                type="email"
                placeholder="exemplo@jgmotors.com"
                leftIcon={<Mail className="size-4" />}
              />
              <AppInput label="Senha" type="password" placeholder="••••••••" />
              <AppInput
                label="Com ícone e erro"
                placeholder="Email inválido"
                leftIcon={<Mail className="size-4" />}
                error="Endereço de e-mail inválido."
              />
            </CardContent>
          </Card>
        </div>

        {/* Código de uso */}
        <Card className="border-dashed mt-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-navy-800 dark:bg-muted p-4 text-xs leading-relaxed text-navy-100 dark:text-foreground/80">
              {`import { AppInput } from '@/components/shared/AppInput'

// Básico com label e dica
<AppInput
  label="Nome completo"
  placeholder="Ex: João Silva"
  hint="Conforme documento."
/>

// Com ícone à esquerda
<AppInput
  label="Busca"
  placeholder="Buscar veículo..."
  leftIcon={<Search className="size-4" />}
/>

// Com dois ícones
<AppInput
  label="Senha"
  type="password"
  leftIcon={<Lock className="size-4" />}
  rightIcon={<Eye className="size-4" />}
/>

// Com erro
<AppInput
  label="Email"
  error="Endereço de e-mail inválido."
  leftIcon={<Mail className="size-4" />}
/>

// Desabilitado
<AppInput label="Campo" isDisabled />`}
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* ── AppTextarea ───────────────────────────────────────────────── */}
      <section>
        <SectionTitle>AppTextarea</SectionTitle>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AppTextarea label="Observações" placeholder="Descreva..." />
              <AppTextarea
                label="Com dica"
                placeholder="Descreva..."
                hint="Máximo 500 caracteres."
              />
              <AppTextarea
                label="Com erro"
                placeholder="Campo obrigatório"
                error="Campo obrigatório."
              />
              <AppTextarea
                label="Desabilitado"
                placeholder="Campo desabilitado"
                isDisabled
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Linhas e resize
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AppTextarea
                label="3 linhas (padrão, sem resize)"
                placeholder="Sem resize..."
                rows={3}
              />
              <AppTextarea
                label="5 linhas redimensionável"
                placeholder="Arraste para redimensionar..."
                rows={5}
                resizable
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Select Components ─────────────────────────────────────────── */}
      <SelectShowcase />

      {/* ── AppTable ──────────────────────────────────────────────────── */}
      <TableShowcase />

      {/* ── Progress Bars ─────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Progresso & Indicadores</SectionTitle>
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">
                  Vendas — Meta Mensal
                </span>
                <span className="text-muted-foreground">75%</span>
              </div>
              <ProgressBar
                value={75}
                gradient="linear-gradient(90deg, #27272A 0%, #71717A 100%)"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">
                  Tarefas Concluídas
                </span>
                <span className="text-muted-foreground">55%</span>
              </div>
              <ProgressBar
                value={55}
                gradient="linear-gradient(90deg, #22C55E 0%, #3B82F6 100%)"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">
                  Estoque em Preparação
                </span>
                <span className="text-muted-foreground">30%</span>
              </div>
              <ProgressBar value={30} color="#F59E0B" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">
                  Capacidade de Atendimento
                </span>
                <span className="text-muted-foreground">88%</span>
              </div>
              <ProgressBar
                value={88}
                gradient="linear-gradient(90deg, #18181B 0%, #3F3F46 60%, #A1A1AA 100%)"
              />
            </div>

            <Separator />

            {/* Avatars */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Avatares
              </p>
              <div className="flex flex-wrap items-center gap-6">
                {/* Individual */}
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-silver-200 text-brand-700 dark:bg-silver-800 dark:text-silver-200 font-semibold">
                      JG
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      João García
                    </p>
                    <p className="text-xs text-muted-foreground">Vendedor</p>
                  </div>
                </div>

                {/* Group */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["JG", "MS", "AL", "PR"].map((initials, i) => (
                      <Avatar
                        key={initials}
                        className="size-8 border-2 border-card"
                      >
                        <AvatarFallback
                          className="text-xs font-semibold"
                          style={{
                            backgroundColor: [
                              "#ede8ff",
                              "#c9f7e6",
                              "#fff5dc",
                              "#e1f5ff",
                            ][i],
                            color: ["#7551ff", "#01b574", "#b97a1a", "#39b8ff"][
                              i
                            ],
                          }}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-semibold text-muted-foreground">
                      +3
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Time de Vendas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Tabela ────────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Tabela</SectionTitle>
        <AppDataTable
          title="Veículos em Estoque"
          columns={tableDataColumns}
          data={tableData}
          total={24}
          page={1}
          pageSize={4}
          searchPlaceholder="Buscar veículo..."
          onSearch={() => {}}
          headerAction={
            <Button size="sm">
              <Car className="size-3.5" />
              Novo
            </Button>
          }
        />
      </section>

      {/* ── Notification / Alert Cards ────────────────────────────────── */}
      <section>
        <SectionTitle>Cards de Alerta</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success-bg p-4">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-4 text-success" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Venda concluída
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Honda Civic #1234 vendido com sucesso.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning-bg p-4">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-warning/10">
              <Bell className="size-4 text-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Tarefa pendente
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                3 tarefas aguardam sua revisão.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger-bg p-4">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-danger/10">
              <XCircle className="size-4 text-danger" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Venda cancelada
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Venda #8901 foi cancelada pelo cliente.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-info/30 bg-info-bg p-4">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-info/10">
              <TrendingUp className="size-4 text-info" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Meta atingida
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Equipe superou a meta de julho em 12%.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
