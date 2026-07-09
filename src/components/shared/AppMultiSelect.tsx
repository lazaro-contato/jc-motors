/**
 * AppMultiSelect — Select com busca e seleção múltipla.
 *
 * Uso:
 *   <AppMultiSelect
 *     options={[{ label: 'Honda Civic', value: 'civic' }]}
 *     value={selected}
 *     onChange={setSelected}
 *     placeholder="Selecione os veículos"
 *   />
 *
 * Props:
 *   options           — array de { label, value, disabled? }
 *   value             — array de values selecionados
 *   onChange          — callback ao selecionar/desselecionar (recebe o novo array)
 *   placeholder       — texto do trigger quando nada selecionado
 *   searchPlaceholder — placeholder do campo de busca
 *   emptyText         — texto quando nenhum resultado encontrado
 *   maxBadges         — número máximo de badges visíveis no trigger (padrão: 2)
 *   isDisabled        — desabilita o componente
 *   error             — mensagem de erro ou boolean para estilo
 *   className         — classes extras no trigger
 */
import { useRef, useState } from "react";

import { Check, ChevronDown, X } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { SelectOption } from "./AppSelect";

interface AppMultiSelectProps {
  options: SelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  maxBadges?: number;
  isDisabled?: boolean;
  error?: string | boolean;
  className?: string;
}

export function AppMultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Selecione as opções",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum resultado encontrado.",
  maxBadges = 2,
  isDisabled = false,
  error,
  className,
}: AppMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const hasError = Boolean(error);
  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[];

  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange?.(value.filter((v) => v !== optValue));
    } else {
      onChange?.([...value, optValue]);
    }
  };

  const removeOne = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== optValue));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const visibleBadges = selectedLabels.slice(0, maxBadges);
  const overflowCount = selectedLabels.length - visibleBadges.length;

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={isDisabled ? undefined : setOpen}>
        <PopoverTrigger
          disabled={isDisabled}
          render={
            <button
              ref={triggerRef}
              type="button"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "flex min-h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                hasError && "border-danger focus-visible:ring-danger/30",
                className,
              )}
            >
              {/* Badges or placeholder */}
              <div className="flex flex-1 flex-wrap gap-1">
                {selectedLabels.length === 0 ? (
                  <span className="text-muted-foreground">{placeholder}</span>
                ) : (
                  <>
                    {visibleBadges.map((label, i) => {
                      const optValue = value[i]!;
                      return (
                        <span
                          key={optValue}
                          className="inline-flex items-center gap-1 rounded bg-silver-100 dark:bg-silver-800 px-2 py-0.5 text-xs font-medium text-brand-700 dark:text-silver-200"
                        >
                          {label}
                          <button
                            type="button"
                            onClick={(e) => removeOne(optValue, e)}
                            className="rounded-sm text-silver-500 hover:text-brand-800 dark:text-silver-400 dark:hover:text-silver-100 focus:outline-none"
                            aria-label={`Remover ${label}`}
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      );
                    })}
                    {overflowCount > 0 && (
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        +{overflowCount}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Right icons */}
              <div className="flex shrink-0 items-center gap-1 pl-1">
                {selectedLabels.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-sm text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label="Limpar seleção"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    open && "rotate-180",
                  )}
                />
              </div>
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
                {options.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      disabled={opt.disabled}
                      data-checked={isSelected}
                      onSelect={() => toggle(opt.value)}
                      className="cursor-pointer"
                    >
                      {/* Checkbox visual */}
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-input bg-transparent",
                        )}
                      >
                        {isSelected && <Check className="size-3 text-primary-foreground" />}
                      </span>
                      {opt.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {typeof error === "string" && error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
