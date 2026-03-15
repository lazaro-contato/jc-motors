/**
 * AppDataTable — Tabela de listagem com Card, busca, ações e paginação.
 *
 * Diferente de AppTable (estilo planilha), este componente é ideal para
 * listas de entidades com ícones, badges coloridos e botões de ação por linha.
 *
 * Uso básico:
 *   <AppDataTable
 *     title="Veículos em Estoque"
 *     columns={columns}
 *     data={rows}
 *     total={24}
 *     page={1}
 *     pageSize={4}
 *   />
 *
 * Com busca e ação no header:
 *   <AppDataTable
 *     title="Veículos"
 *     columns={columns}
 *     data={rows}
 *     searchPlaceholder="Buscar veículo..."
 *     onSearch={(q) => setQuery(q)}
 *     headerAction={<Button size="sm">Novo</Button>}
 *   />
 *
 * Props:
 *   title             — título do Card
 *   columns           — definição de colunas: key, header, align, className, render
 *   data              — array de objetos tipado via generics
 *   total             — total de registros (para paginação)
 *   page              — página atual (1-based)
 *   pageSize          — itens por página
 *   onPageChange      — callback ao mudar página
 *   searchPlaceholder — placeholder do campo de busca
 *   onSearch          — callback ao digitar na busca (debounce no caller)
 *   headerAction      — elemento à direita do header (ex.: botão "Novo")
 *   emptyText         — mensagem de estado vazio
 *   isLoading         — exibe skeleton
 *   loadingRows       — quantidade de linhas skeleton
 *   onRowClick        — callback ao clicar em uma linha
 *   className         — classe extra no Card
 */
import { type ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AppDataTableColumn<T extends Record<string, unknown> = Record<string, unknown>> = {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  render?: (value: unknown, row: T, index: number) => ReactNode;
};

interface AppDataTableProps<T extends Record<string, unknown>> {
  title?: string;
  columns: AppDataTableColumn<T>[];
  data: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  headerAction?: ReactNode;
  emptyText?: string;
  isLoading?: boolean;
  loadingRows?: number;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-2.5 md:px-5 md:py-3.5">
          <div className={cn("h-4 animate-pulse rounded bg-muted", i === 0 ? "w-40" : "w-24")} />
        </td>
      ))}
    </tr>
  );
}

export function AppDataTable<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  total,
  page = 1,
  pageSize = 10,
  onPageChange,
  searchPlaceholder = "Buscar...",
  onSearch,
  headerAction,
  emptyText = "Sem dados.",
  isLoading = false,
  loadingRows = 5,
  onRowClick,
  className,
}: AppDataTableProps<T>) {
  const totalPages = total !== undefined ? Math.ceil(total / pageSize) : undefined;
  const from = total !== undefined ? (page - 1) * pageSize + 1 : undefined;
  const to = total !== undefined ? Math.min(page * pageSize, total) : undefined;

  const hasPagination = totalPages !== undefined && totalPages > 1;

  /* ── Gerar botões de página ── */
  function getPageButtons(current: number, total: number): (number | "...")[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (current > 3) pages.push("...");
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      pages.push(p);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* ── Header ── */}
      {(title || onSearch || headerAction) && (
        <CardHeader className="flex-col gap-3 border-b border-border py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          {title && (
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          )}
          <div className="flex items-center gap-2">
            {onSearch && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-8 w-full pl-8 text-xs sm:w-44"
                  placeholder={searchPlaceholder}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            )}
            {headerAction}
          </div>
        </CardHeader>
      )}

      {/* ── Table ── */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:px-5 md:py-3",
                      col.align ? alignClass[col.align] : "text-left",
                      col.className,
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: loadingRows }).map((_, i) => (
                  <SkeletonRow key={i} cols={columns.length} />
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-12 text-center text-sm text-muted-foreground md:px-5"
                  >
                    {emptyText}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    onClick={onRowClick ? () => onRowClick(row, rowIdx) : undefined}
                    className={cn(
                      "transition-colors hover:bg-muted/40",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {columns.map((col) => {
                      const value = row[col.key];
                      return (
                        <td
                          key={col.key}
                          className={cn(
                            "px-3 py-2.5 md:px-5 md:py-3.5",
                            col.align ? alignClass[col.align] : "text-left",
                            col.className,
                          )}
                        >
                          {col.render ? col.render(value, row, rowIdx) : (value as ReactNode)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {(hasPagination || total !== undefined) && (
          <div className="flex flex-col items-center gap-2 border-t border-border px-3 py-3 sm:flex-row sm:justify-between sm:px-5">
            <p className="text-xs text-muted-foreground">
              {from !== undefined && to !== undefined && total !== undefined
                ? `Exibindo ${from}–${to} de ${total} registros`
                : `${data.length} registros`}
            </p>
            {hasPagination && totalPages !== undefined && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs"
                  disabled={page <= 1}
                  onClick={() => onPageChange?.(page - 1)}
                >
                  <ChevronLeft className="size-3.5" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>

                <span className="hidden sm:contents">
                  {getPageButtons(page, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted-foreground">
                        …
                      </span>
                    ) : (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "ghost"}
                        size="sm"
                        className="h-7 w-7 p-0 text-xs"
                        onClick={() => onPageChange?.(p as number)}
                      >
                        {p}
                      </Button>
                    ),
                  )}
                </span>
                <span className="text-xs text-muted-foreground sm:hidden">
                  {page} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange?.(page + 1)}
                >
                  <span className="hidden sm:inline">Próximo</span>
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
