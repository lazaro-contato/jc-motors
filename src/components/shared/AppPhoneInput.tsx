import { AppInput } from "@/components/shared/AppInput"
import { applyPhoneMask } from "@/utils/masks"

type AppPhoneInputProps = React.ComponentProps<typeof AppInput>

export function AppPhoneInput({
  label = "Telefone",
  placeholder = "(00) 00000-0000",
  onChange,
  ...props
}: AppPhoneInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.value = applyPhoneMask(e.target.value)
    onChange?.(e)
  }

  return (
    <AppInput
      type="tel"
      label={label}
      placeholder={placeholder}
      {...props}
      onChange={handleChange}
    />
  )
}
