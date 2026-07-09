import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building2 } from "lucide-react";

import { AppButton } from "@/components/shared/AppButton";
import { AppCNPJInput } from "@/components/shared/AppCNPJInput";
import { AppInput } from "@/components/shared/AppInput";
import { AppPhoneInput } from "@/components/shared/AppPhoneInput";
import { AppSelect } from "@/components/shared/AppSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  providerSchema,
  STATE_OPTIONS,
  type ProviderFormData,
} from "../data/provider.schema";

export type { ProviderFormData } from "../data/provider.schema";

/* ── Component ───────────────────────────────────────────────────────────── */

interface ProviderFormProps {
  onSubmit: (data: ProviderFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ProviderForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProviderFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: { status: "active" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados da empresa */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
              <Building2 className="size-4 text-brand-600 dark:text-silver-300" />
            </div>
            <div>
              <CardTitle className="text-base">Dados da Empresa</CardTitle>
              <CardDescription>
                Informações jurídicas do fornecedor
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-3 md:gap-5 md:pt-6">
          <AppInput
            label="Razão Social"
            placeholder="Ex.: Auto Peças São Paulo Ltda."
            error={errors.name?.message}
            {...register("name")}
          />
          <AppCNPJInput error={errors.cnpj?.message} {...register("cnpj")} />
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Contato</CardTitle>
          <CardDescription>
            Responsável e informações de contato
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-3 md:gap-5 md:pt-6">
          <AppInput
            label="Nome do Responsável"
            placeholder="Ex.: João da Silva"
            error={errors.contact?.message}
            {...register("contact")}
          />
          <AppInput
            label="E-mail"
            type="email"
            placeholder="contato@empresa.com.br"
            error={errors.email?.message}
            {...register("email")}
          />
          <AppPhoneInput error={errors.phone?.message} {...register("phone")} />
        </CardContent>
      </Card>

      {/* Localização */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Localização</CardTitle>
          <CardDescription>Cidade e estado de operação</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="grid gap-4 pt-5 md:grid-cols-3 md:gap-5 md:pt-6">
          <div className="md:col-span-2">
            <AppInput
              label="Cidade"
              placeholder="Ex.: São Paulo"
              error={errors.city?.message}
              {...register("city")}
            />
          </div>
          <AppSelect
            label="UF"
            options={STATE_OPTIONS}
            value={watch("state") ?? ""}
            onValueChange={(v) =>
              setValue("state", v, { shouldValidate: true })
            }
            placeholder="Estado"
            error={errors.state?.message}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <AppButton
          type="submit"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          Salvar Fornecedor
        </AppButton>
      </div>
    </form>
  );
}
