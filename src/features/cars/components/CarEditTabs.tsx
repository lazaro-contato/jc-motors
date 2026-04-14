import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { CAR_STEPS, type CarStep } from "../data/car.schema";

import { CostsTab } from "./tabs/CostsTab";
import { NegotiationTab } from "./tabs/NegotiationTab";
import { OptionalsTab } from "./tabs/OptionalsTab";
import { VehicleInfoTab } from "./tabs/VehicleInfoTab";

interface CarEditTabsProps {
  value: CarStep;
  onValueChange: (value: CarStep) => void;
  pendingSteps: CarStep[];
}

export function CarEditTabs({
  value,
  onValueChange,
  pendingSteps,
}: CarEditTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as CarStep)}>
      <TabsList className="h-auto w-full justify-start gap-2 bg-transparent p-0">
        {CAR_STEPS.map((step) => {
          const isPending = pendingSteps.includes(step.id);
          return (
            <TabsTrigger
              key={step.id}
              value={step.id}
              className={cn(
                "cursor-pointer relative h-10 flex-none rounded-md border border-border bg-card px-4",
                "data-active:border-brand-500 data-active:bg-brand-50 data-active:text-brand-700",
                "dark:data-active:bg-brand-900/20 dark:data-active:text-brand-300",
              )}
            >
              <span>{step.label}</span>
              {isPending && <PendingDot />}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="vehicle" className="mt-5">
        <VehicleInfoTab />
      </TabsContent>
      <TabsContent value="optionals" className="mt-5">
        <OptionalsTab />
      </TabsContent>
      <TabsContent value="negotiation" className="mt-5">
        <NegotiationTab />
      </TabsContent>
      <TabsContent value="costs" className="mt-5">
        <CostsTab />
      </TabsContent>
    </Tabs>
  );
}

function PendingDot() {
  return (
    <span className="relative ml-1 flex size-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-danger" />
    </span>
  );
}
