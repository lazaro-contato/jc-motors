import { useFormContext } from "react-hook-form";

import type { CarEditData } from "../../data/car.schema";
import { useGetOptionals } from "../../hooks/useGetOptionals";
import {
  AppTransferList,
  type TransferListItem,
  type TransferListProfile,
} from "../optionals/AppTransferList";
import { OptionalsEmptyState } from "../optionals/OptionalsEmptyState";
import { OptionalsLoadingSkeleton } from "../optionals/OptionalsLoadingSkeleton";
import { MOCK_PROFILES } from "../optionals/optionals-data";

const profiles: TransferListProfile[] = MOCK_PROFILES.map((p) => ({
  id: p.id,
  label: p.name,
  itemIds: p.optionalIds,
}));

export function OptionalsTab() {
  const { watch, setValue } = useFormContext<CarEditData>();
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

  const results = data?.results ?? [];
  if (results.length === 0) {
    return <OptionalsEmptyState />;
  }

  const availableItems: TransferListItem[] = results.map((o) => ({
    id: String(o.id),
    label: o.name,
  }));

  return (
    <AppTransferList
      availableItems={availableItems}
      assignedIds={assignedIds}
      onAssignedChange={handleAssignedChange}
      profiles={profiles}
      availableTitle="Opcionais Disponíveis"
      assignedTitle="Opcionais do Veículo"
      searchPlaceholder="Buscar opcional..."
      emptyAvailableText="Nenhum opcional encontrado."
      emptyAssignedText="Nenhum opcional adicionado ao veículo."
    />
  );
}
