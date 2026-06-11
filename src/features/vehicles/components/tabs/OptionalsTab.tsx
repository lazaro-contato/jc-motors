import { useFormContext } from "react-hook-form";

import { useGetOptionals } from "../../hooks/useGetOptionals";
import {
  AppTransferList,
  type TransferListItem,
} from "../optionals/AppTransferList";
import { OptionalsEmptyState } from "../optionals/OptionalsEmptyState";
import { OptionalsLoadingSkeleton } from "../optionals/OptionalsLoadingSkeleton";

import type { VehicleEditData } from "../../data/vehicle.schema";

export function OptionalsTab() {
  const { watch, setValue } = useFormContext<VehicleEditData>();
  const assignedIds = watch("optionals") ?? [];

  const { data, isPending, isError } = useGetOptionals();

  function handleAssignedChange(ids: string[]) {
    setValue("optionals", ids, { shouldDirty: true });
  }

  if (isPending) {
    return <OptionalsLoadingSkeleton />;
  }

  if (isError) {
    return (
      <OptionalsEmptyState
        title="Não foi possível carregar os opcionais"
        description="Verifique sua conexão ou tente novamente em instantes. Se o problema persistir, contate o suporte."
      />
    );
  }

  const results = data?.data ?? [];
  if (results.length === 0) {
    return <OptionalsEmptyState />;
  }

  const availableItems: TransferListItem[] = results.map((o) => ({
    id: o.id,
    label: o.name,
  }));

  return (
    <AppTransferList
      availableItems={availableItems}
      assignedIds={assignedIds}
      onAssignedChange={handleAssignedChange}
      availableTitle="Opcionais Disponíveis"
      assignedTitle="Opcionais do Veículo"
      searchPlaceholder="Buscar opcional..."
      emptyAvailableText="Nenhum opcional encontrado."
      emptyAssignedText="Nenhum opcional adicionado ao veículo."
    />
  );
}
