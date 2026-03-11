/**
 * AppTextarea — Textarea com label, hint, erro e controle de resize.
 *
 * Uso básico:
 *   <AppTextarea label="Observações" placeholder="Descreva..." />
 *
 * Com linhas fixas e sem resize (padrão):
 *   <AppTextarea label="Descrição" rows={4} />
 *
 * Redimensionável:
 *   <AppTextarea label="Notas" rows={3} resizable />
 *
 * Props extras:
 *   label      — rótulo exibido acima do textarea
 *   hint       — texto de ajuda abaixo (oculto quando há error)
 *   error      — mensagem de erro (string) ou flag de estilo (boolean)
 *   rows       — número de linhas visíveis
 *   resizable  — permite redimensionar verticalmente (padrão: false)
 *   isDisabled — desabilita o textarea
 */
import { useId } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppTextareaProps extends React.ComponentProps<"textarea"> {
  label?: string;
  hint?: string;
  error?: string | boolean;
  rows?: number;
  resizable?: boolean;
  isDisabled?: boolean;
}

export function AppTextarea({
  label,
  hint,
  error,
  rows,
  resizable = false,
  isDisabled = false,
  className,
  id,
  ...props
}: AppTextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      <Textarea
        id={textareaId}
        rows={rows}
        disabled={isDisabled}
        aria-invalid={hasError || undefined}
        className={cn(
          resizable ? "resize-y" : "resize-none",
          hasError && "border-danger focus-visible:ring-danger/30",
          className,
        )}
        {...props}
      />
      {typeof error === "string" && error && (
        <p className="text-xs text-danger">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
