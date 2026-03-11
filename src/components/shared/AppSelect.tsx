/**
 * AppSelect — wrapper simplificado do shadcn Select com API baseada em options[].
 *
 * Uso:
 *   <AppSelect
 *     options={[{ label: 'Honda Civic', value: 'civic' }]}
 *     placeholder="Selecione o veículo"
 *     value={value}
 *     onValueChange={setValue}
 *   />
 *
 * Props:
 *   options       — array de { label, value, disabled? }
 *   placeholder   — texto exibido quando nenhuma opção está selecionada
 *   isDisabled    — desabilita o select inteiro
 *   error         — mensagem de erro (exibida abaixo) ou boolean para estilo de erro
 *   value         — valor selecionado (controlado)
 *   defaultValue  — valor padrão (não-controlado)
 *   onValueChange — callback chamado ao selecionar uma opção
 *   size          — 'default' | 'sm'
 *   className     — classes extras no trigger
 */
import type { ComponentProps } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface AppSelectProps
  extends Omit<
    ComponentProps<typeof Select>,
    "children" | "onValueChange" | "value" | "defaultValue"
  > {
  options: SelectOption[];
  placeholder?: string;
  isDisabled?: boolean;
  error?: string | boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "default";
  className?: string;
}

export function AppSelect({
  options,
  placeholder = "Selecione uma opção",
  isDisabled = false,
  error,
  value,
  defaultValue,
  onValueChange,
  size = "default",
  className,
  ...props
}: AppSelectProps) {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1">
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={isDisabled}
        {...props}
      >
        <SelectTrigger
          size={size}
          className={cn(
            "w-full",
            hasError && "border-danger focus-visible:ring-danger/30",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {typeof error === "string" && error && (
        <p className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
