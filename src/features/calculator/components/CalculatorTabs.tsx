import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import { CALCULATOR_TABS, type CalculatorTab } from "../data/calculator.schema"
import { SettingsTab } from "./tabs/SettingsTab"
import { VehicleDataTab } from "./tabs/VehicleDataTab"

interface CalculatorTabsProps {
  value: CalculatorTab
  onValueChange: (value: CalculatorTab) => void
}

export function CalculatorTabs({ value, onValueChange }: CalculatorTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as CalculatorTab)}>
      <TabsList className="h-auto w-full justify-start gap-2 bg-transparent p-0">
        {CALCULATOR_TABS.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "cursor-pointer relative h-10 flex-none rounded-md border border-border bg-card px-4",
              "data-active:border-brand-500 data-active:bg-brand-50 data-active:text-brand-700",
              "dark:data-active:bg-brand-900/20 dark:data-active:text-brand-300",
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="vehicle" className="mt-6">
        <VehicleDataTab />
      </TabsContent>
      <TabsContent value="settings" className="mt-6">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  )
}
