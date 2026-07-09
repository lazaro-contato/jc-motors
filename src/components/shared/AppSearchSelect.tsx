/**
 * AppSearchSelect — Select com busca (combobox, seleção simples).
 *
 * Uso:
 *   <AppSearchSelect
 *     label="Veículo"
 *     options={[{ label: 'Honda Civic', value: 'civic' }]}
 *     value={value}
 *     onChange={setValue}
 *     placeholder="Selecione o veículo"
 *     searchPlaceholder="Buscar veículo..."
 *   />
 *
 * Props:
 *   options           — array de { label, value, disabled? }
 *   label             — rótulo exibido acima do select
 *   hint              — texto de ajuda abaixo do select (oculto quando há error)
 *   value             — valor selecionado
 *   onChange          — callback ao selecionar (recebe o novo value)
 *   placeholder       — texto do trigger quando nada selecionado
 *   searchPlaceholder — placeholder do campo de busca
 *   emptyText         — texto quando nenhum resultado encontrado
 *   isDisabled        — desabilita o componente
 *   error             — mensagem de erro ou boolean para estilo
 *   className         — classes extras no trigger
 */
import { useRef, useState, type ReactNode } from "react";

import { ChevronDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { SelectOption } from "./AppSelect";

interface AppSearchSelectProps {
  options: SelectOption[];
  label?: string;
  hint?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  isDisabled?: boolean;
  error?: string | boolean;
  className?: string;
  /** Ação fixa exibida no rodapé da lista (ex.: cadastrar novo). Recebe `close` para fechar o popover. */
  footer?: (helpers: { close: () => void }) => ReactNode;
}

export function AppSearchSelect({
  options,
  label,
  hint,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum resultado encontrado.",
  isDisabled = false,
  error,
  className,
  footer,
}: AppSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((o) => o.value === value);
  const hasError = Boolean(error);

  const handleSelect = (optValue: string) => {
    onChange?.(optValue === value ? "" : optValue);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label>{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={isDisabled}
          render={
            <button
              ref={triggerRef}
              type="button"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm whitespace-nowrap transition-colors outline-none",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "data-placeholder:text-muted-foreground",
                hasError && "border-danger focus-visible:ring-danger/30",
                className,
              )}
            >
              <span className={cn(!selected && "text-muted-foreground")}>
                {selected ? selected.label : placeholder}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </button>
          }
        />

        <PopoverContent
          align="start"
          className="p-0"
          style={{
            width: triggerRef.current?.offsetWidth
              ? `${triggerRef.current.offsetWidth}px`
              : undefined,
            minWidth: "12rem",
          }}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    disabled={opt.disabled}
                    data-checked={value === opt.value}
                    onSelect={() => handleSelect(opt.value)}
                    className="py-2.5 px-3"
                  >
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              {footer && (
                <div className="border-t border-border p-1">
                  {footer({ close: () => setOpen(false) })}
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {typeof error === "string" && error && (
        <p className="text-xs text-danger">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
