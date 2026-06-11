import { AppInput } from "@/components/shared/AppInput"
import { applyCNPJMask } from "@/utils/masks"

type AppCNPJInputProps = React.ComponentProps<typeof AppInput>

export function AppCNPJInput({
  label = "CNPJ",
  placeholder = "00.000.000/0000-00",
  onChange,
  ...props
}: AppCNPJInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.value = applyCNPJMask(e.target.value)
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
