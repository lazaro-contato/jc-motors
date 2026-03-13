# Auth Feature — Especificação Técnica

> Última atualização: Março 2026

---

## Visão Geral

Feature responsável pela autenticação de usuários na plataforma. Inclui tela de login e, futuramente, fluxos de recuperação de senha e registro.

**Rota:** `/login`
**Layout:** Sem `AppLayout` (tela independente, full-screen)

---

## Estrutura de Arquivos

```
src/features/auth/
└── pages/
    └── LoginPage.tsx         # Tela de login (placeholder)
```

---

## Páginas

### `LoginPage.tsx`

| Item | Detalhe |
|---|---|
| Rota | `/login` |
| Export | `export default function LoginPage()` |
| Layout | Full-screen centralizado, sem sidebar/header |
| Estado atual | Placeholder — formulário ainda não implementado |

**Próximos passos para implementação completa:**

- Formulário com `React Hook Form` + `Zod` (campos: e-mail, senha)
- Integração com `auth.service.ts` → `POST /auth/login/`
- Armazenamento de tokens via `useAuthStore` (Zustand com persist)
- Redirecionamento pós-login via `useNavigate` do TanStack Router
- Tratamento de erros com feedback visual (toast via Sonner)

---

## Dependências

### Store

- `src/store/auth.store.ts` — Zustand store com persist para tokens JWT e dados do usuário

### Serviço (a ser criado)

- `src/features/auth/services/auth.service.ts` — chamadas HTTP para login/logout/refresh

### Tipos

- `src/types/auth.ts` — `User`, `Employee`, `AuthTokens`, `LoginDTO`

---

## Regras de Negócio

- Login é feito por **e-mail + senha** (não username)
- Existem 3 tipos de usuário: `employee`, `customer`, `user`
- O JWT é armazenado via Zustand persist e injetado automaticamente pelo interceptor do Axios (`src/lib/api.ts`)
- Rotas protegidas devem redirecionar para `/login` quando não autenticado (via `src/router/guards.tsx`)
