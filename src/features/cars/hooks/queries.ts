export const vehicleOptionalKeys = {
  all: ["vehicle-optionals"] as const,
  list: () => [...vehicleOptionalKeys.all, "list"] as const,
}
