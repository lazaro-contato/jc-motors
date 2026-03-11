/**
 * AppButton — extensão do Button do shadcn com variantes de `intent`.
 *
 * Uso:
 *   <AppButton intent="success">Salvar</AppButton>
 *   <AppButton intent="danger" soft>Cancelar</AppButton>
 *   <AppButton isLoading>Salvando...</AppButton>
 *   <AppButton isDisabled>Indisponível</AppButton>
 *
 * Props extras:
 *   intent     — 'success' | 'warning' | 'danger' | 'info'
 *   soft       — fundo claro (bg-light) + texto colorido, ao invés do sólido
 *   isLoading  — exibe spinner e desabilita o botão
 *   isDisabled — desabilita o botão sem alterar o visual de loading
 */
import type { ComponentProps } from "react";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Intent = "default" | "success" | "warning" | "danger" | "info";

const solidStyles: Record<Exclude<Intent, "default">, string> = {
  success:
    "bg-success text-white hover:bg-success/85 focus-visible:ring-success/30 border-transparent",
  warning:
    "bg-warning text-navy-800 dark:text-navy-900 hover:bg-warning/85 focus-visible:ring-warning/30 border-transparent",
  danger:
    "bg-danger  text-white hover:bg-danger/85  focus-visible:ring-danger/30  border-transparent",
  info: "bg-info    text-white hover:bg-info/85    focus-visible:ring-info/30    border-transparent",
};

const softStyles: Record<Exclude<Intent, "default">, string> = {
  success:
    "bg-success-bg text-success hover:bg-success/15 focus-visible:ring-success/20 border-transparent",
  warning:
    "bg-warning-bg text-warning dark:text-warning hover:bg-warning/15 focus-visible:ring-warning/20 border-transparent",
  danger:
    "bg-danger-bg text-danger hover:bg-danger/15 focus-visible:ring-danger/20 border-transparent",
  info: "bg-info-bg text-info hover:bg-info/15 focus-visible:ring-info/20 border-transparent",
};

interface AppButtonProps extends ComponentProps<typeof Button> {
  intent?: Intent;
  soft?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function AppButton({
  intent = "default",
  soft = false,
  isLoading = false,
  isDisabled = false,
  className,
  children,
  ...props
}: AppButtonProps) {
  const intentClass =
    intent !== "default"
      ? soft
        ? softStyles[intent]
        : solidStyles[intent]
      : undefined;

  return (
    <Button
      variant={intent !== "default" ? "default" : props.variant}
      disabled={isDisabled || isLoading}
      className={cn(intentClass, className)}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </Button>
  );
}
