/**
 * AppTable — Tabela com API declarativa baseada em colunas e dados.
 *
 * Uso básico:
 *   <AppTable
 *     columns={[
 *       { key: "name", header: "Nome" },
 *       { key: "price", header: "Preço", align: "right" },
 *     ]}
 *     data={[{ name: "Onix", price: "R$ 80.000" }]}
 *   />
 *
 * Com variante listrada e estado vazio customizado:
 *   <AppTable
 *     variant="striped"
 *     columns={columns}
 *     data={[]}
 *     emptyText="Nenhum veículo encontrado."
 *   />
 *
 * Props:
 *   columns    — definição de colunas: key, header, align, className, render
 *   data       — array de objetos
 *   variant    — "default" | "striped" | "bordered"
 *   caption    — legenda exibida abaixo da tabela
 *   emptyText  — mensagem quando data está vazia (padrão: "Sem dados.")
 *   isLoading  — exibe linhas de skeleton enquanto carrega
 *   className  — classe extra no wrapper
 */
import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type AppTableColumn<T extends Record<string, unknown> = Record<string, unknown>> = {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  render?: (value: unknown, row: T, index: number) => ReactNode;
};

export type AppTableFooterRow = {
  key: string;
  value: ReactNode;
};

interface AppTableProps<T extends Record<string, unknown>> {
  columns: AppTableColumn<T>[];
  data: T[];
  variant?: "default" | "striped" | "bordered";
  caption?: string;
  emptyText?: string;
  isLoading?: boolean;
  loadingRows?: number;
  footer?: AppTableFooterRow[];
  className?: string;
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function SkeletonCell() {
  return (
    <div className="h-4 w-full animate-pulse rounded bg-muted" />
  );
}

export function AppTable<T extends Record<string, unknown>>({
  columns,
  data,
  variant = "default",
  caption,
  emptyText = "Sem dados.",
  isLoading = false,
  loadingRows = 4,
  footer,
  className,
}: AppTableProps<T>) {
  const isStriped = variant === "striped";
  const isBordered = variant === "bordered";

  return (
    <div
      className={cn(
        "relative w-full overflow-x-auto rounded-lg border border-border",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow
            className={cn(
              "bg-muted/50 hover:bg-muted/50",
              isBordered && "border-b border-border",
            )}
          >
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                  col.align ? alignClass[col.align] : "text-left",
                  isBordered && "border-r border-border last:border-r-0",
                  col.className,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: loadingRows }).map((_, rowIdx) => (
              <TableRow key={rowIdx} className="hover:bg-transparent">
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={isBordered ? "border-r border-border last:border-r-0" : ""}
                  >
                    <SkeletonCell />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={cn(
                  isStriped && rowIdx % 2 === 0 && "bg-muted/30",
                )}
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  return (
                    <TableCell
                      key={col.key}
                      className={cn(
                        col.align ? alignClass[col.align] : "text-left",
                        isBordered && "border-r border-border last:border-r-0",
                        col.className,
                      )}
                    >
                      {col.render ? col.render(value, row, rowIdx) : (value as ReactNode)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>

        {footer && footer.length > 0 && (
          <TableFooter>
            <TableRow>
              {footer.map((cell, idx) => (
                <TableCell
                  key={cell.key}
                  colSpan={idx === footer.length - 1 ? columns.length - footer.length + 1 : 1}
                  className={cn(
                    idx === footer.length - 1 && "text-right font-semibold",
                    isBordered && "border-r border-border last:border-r-0",
                  )}
                >
                  {cell.value}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        )}

        {caption && <TableCaption>{caption}</TableCaption>}
      </Table>
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
