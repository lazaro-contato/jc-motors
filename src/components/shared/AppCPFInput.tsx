import { AppInput } from "@/components/shared/AppInput"
import { applyCPFMask } from "@/utils/masks"

type AppCPFInputProps = React.ComponentProps<typeof AppInput>

export function AppCPFInput({
  label = "CPF",
  placeholder = "000.000.000-00",
  onChange,
  ...props
}: AppCPFInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.value = applyCPFMask(e.target.value)
    onChange?.(e)
  }

  return (
    <AppInput
      label={label}
      placeholder={placeholder}
      {...props}
      onChange={handleChange}
    />
  )
}
