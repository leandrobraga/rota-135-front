# CLAUDE.md

rota-135-front — backoffice da Rota 135. Consome rota-135-api (repo
separado). Papéis: Admin (tudo), Operador (exceto financeiro), Financeiro
(só financeiro). Login e-mail+senha (app mobile usa OTP).

## Stack

Vite + React 19 + TanStack Router (file-based, SPA sem SSR) + Tailwind v4

- Biome + Bun. TanStack Query + **ky v2** (`prefix`/`baseUrl`, não
  `prefixUrl`; hooks = objeto único). Zustand. React Hook Form + Zod.
  `better-auth/react` com **`basePath: "/auth"` explícito** (backend não usa
  o `/api/auth` padrão — sem isso, login quebra com 404). Tipos de API via
  openapi-typescript, não Eden Treaty. `use-mask-input@3.13.0` — telefone BR
  sempre como **array** `["(99) 9999-9999", "(99) 99999-9999"]`, nunca
  string com `|` (sintaxe pipe tem bug nessa versão). `autoUnmask: true`
  sempre — payload chega sem pontuação.

Bun sempre: `bun add`, `bunx` (com `--bun` por padrão).
Caso algum erro acontece por causa do --bun tentar sem o --bun.

## Pastas

Feature-based, rotas finas (só beforeLoad/loader/import da page):

src/
├── routes/
├── features/
│ └── <modulo>/
│ ├── components/
│ ├── hooks/
│ ├── queries/
│ ├── mutations/
│ ├── services/
│ ├── types/
│ ├── schemas/
│ └── pages/
├── components/ # compartilhado entre features
├── lib/
│ ├── api-client/
│ │ ├── ky-client.ts
│ │ ├── typed-client.ts
│ │ └── schema.d.ts # gerado, nunca editado à mão
│ ├── auth-client/ # better-auth/react, Role type exportado
│ ├── query-client.ts
│ ├── stores/ # Zustand
│ └── route-guards.ts # requireSession(), requireRole()
├── hooks/ # SÓ globais (useDebounce...)
│ # hook de domínio vai em features/<modulo>/hooks
├── config/
└── types/

Alias: só `#/*`. Regra rígida: **só `services/*.service.ts` importa de
`lib/api-client/typed-client`**.

## RBAC

Guard = UX only, autorização real é no backend. `role` vem em
`session.user.role` (`inferAdditionalFields` no auth-client). Zonas via
`requireSession()`/`requireRole([...])` no `beforeLoad`:

- Qualquer autenticado: dashboard, notifications
- `ADMIN`,`OPERATOR`: customer, drivers, vehicles, pricing, trips
- `ADMIN`,`FINANCE`: payments, payouts
- `ADMIN` só: users

## Trips

Transição de estado é 100% backend — front só chama a ação e reage ao
status devolvido, nunca decide. Mapear status→visual fica inline no
componente até repetir 2+ vezes.

## schema.d.ts

Gerar: `bunx openapi-typescript http://localhost:<PORTA>/openapi/json -o src/lib/api-client/schema.d.ts`
— **reiniciar backend por completo antes** (hot-reload não recarrega o
plugin OpenAPI).

- `components.schemas` sempre `never` → usar `ApiResponse<Op>` (extrai de
  `operations[Op]['responses'][200]...`), nunca `components['schemas']`.
- `createdAt/updatedAt/scheduledAt/price/amount` = `unknown` (Date/Decimal
  não representável em JSON Schema). Cast manual até resolver na fonte.
- Listagem inconsistente: alguns módulos retornam array puro, outros
  paginam (`{data:[...],page,pageSize,total}`). Checar por endpoint.

## Formulários

- Botão de submit desabilita **só por `isSubmitting`**, nunca combinado
  com `isValid` (misturar os dois trava o botão depois de erro de
  servidor).
- Todo submit precisa de `try/catch` + `getApiErrorMessage`/`getApiFieldError`
  (`lib/api-error.ts`) — Promise sem handler já engoliu erro 2x.
- Erro do Better Auth vem em inglês — nunca exibir `error.message` cru,
  traduzir por `error.code` (ver `features/auth/lib/auth-error-messages.ts`).
- Schema com coerce OU transform quebra tipo do zodResolver (bug
  conhecido, Zod v4 + @hookform/resolvers). Sempre:
  useForm<z.input<typeof schema>, any, z.output<typeof schema>>({...})
- Erro de negócio (ConflictError etc.) também pode incluir field opcional
  no {error:{code,message,field}} — getApiFieldError já trata os dois
  formatos (validação E negócio) igual.

## Componentes compartilhados (não recriar por módulo)

- **DataTable** — tabela desktop / cards mobile. `mobileRole: 'title' |
'badge' | 'meta' | 'actions'` (title+badge mesma linha; meta uma linha
  com "·"; actions só se `render()` retornar algo). `pagination` (desktop)
  e `mobilePagination` (mobile, acumula) opcionais/independentes. `search`
  com debounce 350ms embutido. `resetKey` zera acumulado quando busca muda.
- **FormPanel** — drawer desktop / bottom sheet mobile (Radix Dialog). Só
  fecha por X/ESC, nunca clique-fora. Quem usa dá `reset()` do RHF no
  `onOpenChange(false)`.
- **ConfirmDialog** — Radix AlertDialog, toda ação destrutiva.
  `variant:'destructive'` = tom #9C4A3E, nunca vermelho genérico Tailwind.
- **lib/formatters.ts** — `formatPhoneDisplay`/`formatCpfDisplay`, só
  exibição (dado vem sem máscara do backend). Não usar `use-mask-input`
  pra isso (é lib de input, não formatação estática).
- **ActiveStatusBadge** — badge por active:boolean ("Ativo"/"Desativado").
  Usado em vehicles/customer. drivers usa DriverStatusBadge (tem lógica
  extra de approvalStatus).

## Comandos

`bun --bun run dev` · `bun --bun run check` (sempre ao fim de tarefa) ·
`bun --bun run generate-routes`

## Design

Sem shadcn/ui — Tailwind puro. Referência: `design/mock-reference.html`
(ler antes de construir tela nova). Navy `#0F1F3A`/`#16223B`, dourado
`#C6A15B`, cremes `#F7F5F0`/`#FBF9F5`, neutros `#9C9285`/`#6B6459`/
`#E8E3D8`, verde-sálvia `#5C8F72`/`#E3EEE7` (positivo). Playfair Display
(headings/logo), Public Sans (UI/corpo).

## Ativar/desativar (padrão fixo, todo módulo com essa ação)

- Desativar: destrutivo, ConfirmDialog, fecha painel no onSuccess.
- Reativar: verde-sálvia, SEM ConfirmDialog, TAMBÉM fecha painel no
  onSuccess (esquecer isso quebrou vehicles na 1ª tentativa — painel
  fica com dado velho, botão não atualiza).
- Antes de implementar activate/reactivate num módulo novo: confirmar
  no schema.d.ts que o endpoint .../activate existe. Não presumir.

## E-mail (Resend)

lib/resend.ts tem sendEmail() central — SEMPRE usar essa, nunca
resend.emails.send() direto (tem redirecionamento de dev embutido via
EMAIL_DEV_REDIRECT_TO). Envio é sempre aguardado (não fire-and-forget),
erro capturado sem lançar — resposta da API inclui emailSent:boolean.
Se emailSent:false, UI mostra aviso destacado (borda #9C4A3E + ícone),
trava o form, botão vira "Fechar".

## Senha (Better Auth)

- Admin trocar senha de outro: endpoint nosso
  (PATCH /users/{id}/password), hash via hashPassword de
  "better-auth/crypto" — NÃO existe API pronta do Better Auth pra isso
  sem exigir senha atual (por isso é endpoint próprio, não authClient).
- Usuário trocar a própria: authClient.changePassword({currentPassword,
  newPassword, revokeOtherSessions:true}) direto, sem endpoint nosso —
  já vem de fábrica do Better Auth.

## DropdownMenu (radix-ui)

Rodapé do Sidebar (avatar+nome) usa DropdownMenu, mesmo pacote radix-ui
já instalado. Sempre card branco flutuante com sombra (shadow-lg,
border, rounded-xl) — nunca depender da cor de fundo de onde abre.
