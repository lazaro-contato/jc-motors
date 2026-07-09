import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "sonner"

import { AppButton } from "@/components/shared/AppButton"
import { AppInput } from "@/components/shared/AppInput"
import { useSignIn } from "../hooks/useAuthMutations"

const loginSchema = z.object({
  email:    z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

type LoginData = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const signIn = useSignIn()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginData) {
    try {
      await signIn.mutateAsync(data)
      navigate({ to: "/" })
    } catch {
      toast.error("E-mail ou senha incorretos")
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">JC Motors</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acesse sua conta para continuar.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AppInput
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <AppInput
            label="Senha"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <AppButton
            type="submit"
            className="w-full"
            isLoading={signIn.isPending}
          >
            Entrar
          </AppButton>
        </form>
      </div>
    </div>
  )
}
