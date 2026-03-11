/**
 * AppInput — Input com label, hint, erro e ícones integrados.
 *
 * Uso básico:
 *   <AppInput label="Nome" placeholder="Ex: João Silva" />
 *
 * Com ícone e erro:
 *   <AppInput
 *     label="Busca"
 *     leftIcon={<Search className="size-4" />}
 *     placeholder="Buscar veículo..."
 *     error="Campo obrigatório."
 *   />
 *
 * Senha (toggle automático):
 *   <AppInput label="Senha" type="password" />
 *
 * Props extras:
 *   label      — rótulo exibido acima do input
 *   hint       — texto de ajuda abaixo do input (oculto quando há error)
 *   error      — mensagem de erro (string) ou flag de estilo (boolean)
 *   leftIcon   — ícone ou elemento à esquerda do input
 *   rightIcon  — ícone ou elemento à direita do input (ignorado quando type="password")
 *   isDisabled — desabilita o input
 */
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppInputProps extends React.ComponentProps<"input"> {
  label?: string;
  hint?: string;
  error?: string | boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isDisabled?: boolean;
}

export function AppInput({
  label,
  hint,
  error,
  leftIcon,
  rightIcon,
  isDisabled = false,
  className,
  id,
  type,
  ...props
}: AppInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hasError = Boolean(error);
  const isPassword = type === "password";

  const [showPassword, setShowPassword] = useState(false);

  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const passwordToggle = isPassword ? (
    <InputGroupAddon align="inline-end">
      <InputGroupButton
        onClick={() => setShowPassword((v) => !v)}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </InputGroupButton>
    </InputGroupAddon>
  ) : null;

  const effectiveRightAddon = isPassword ? passwordToggle : (
    rightIcon ? (
      <InputGroupAddon align="inline-end">
        <InputGroupText>{rightIcon}</InputGroupText>
      </InputGroupAddon>
    ) : null
  );

  const hasAddon = leftIcon || effectiveRightAddon;

  const inputField = hasAddon ? (
    <InputGroup>
      {leftIcon && (
        <InputGroupAddon align="inline-start">
          <InputGroupText>{leftIcon}</InputGroupText>
        </InputGroupAddon>
      )}
      <InputGroupInput
        id={inputId}
        type={resolvedType}
        disabled={isDisabled}
        aria-invalid={hasError || undefined}
        className={cn(
          hasError && "border-danger focus-visible:ring-danger/30",
          className,
        )}
        {...props}
      />
      {effectiveRightAddon}
    </InputGroup>
  ) : (
    <Input
      id={inputId}
      type={resolvedType}
      disabled={isDisabled}
      aria-invalid={hasError || undefined}
      className={cn(
        hasError && "border-danger focus-visible:ring-danger/30",
        className,
      )}
      {...props}
    />
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      {inputField}
      {typeof error === "string" && error && (
        <p className="text-xs text-danger">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
