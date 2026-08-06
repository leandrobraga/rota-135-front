# CLAUDE.md

rota-135-front — backoffice web da Rota 135 (viagens executivas). Consome
rota-135-api (repo separado). 3 papéis: Admin (tudo), Operador (tudo exceto
financeiro), Financeiro (só financeiro). Login e-mail+senha (app mobile usa OTP).

## Stack

Vite + React 19 + TanStack Router (file-based, **SPA sem SSR**, não é
TanStack Start) + Tailwind v4 + Biome + Bun. TanStack Query + **ky v2**
(`prefix`/`baseUrl`, não `prefixUrl`; hooks = objeto único
`{request,options,retryCount}`, não args separados). Zustand (UI state).
React Hook Form + Zod. Auth: `better-auth/react`. Tipos de API: gerados via
openapi-typescript a partir da doc OpenAPI — não Eden Treaty.

**Bun sempre.** `bun add`, `bunx` (não `npx`), com `--bun` por padrão. Casso --bu de algum problema ou erro tentar sem

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

Alias: só `#/*`. Nunca `@/*`, nunca relativo longo.

**Regra rígida**: só `services/*.service.ts` importa de `lib/api-client/typed-client.ts`.

## RBAC

Guard de rota = UX only, autorização real é no backend. `role` vem nativo em
`session.user.role` (Better Auth, via `GET /auth/get-session`) — `auth-client`
usa `inferAdditionalFields` com schema do enum. Zonas, via
`requireSession()`/`requireRole([...])` em `beforeLoad` (não layout aninhado —
4 zonas não cabe em hierarquia):

- Qualquer autenticado: dashboard, notifications
- `ADMIN`,`OPERATOR`: customer, drivers, vehicles, pricing, trips
- `ADMIN`,`FINANCE`: payments, payouts
- `ADMIN` só: users (equipe)

## Formulários — convenção fixa

Erros do Better Auth (`error.message` no `onError`) vêm em inglês por
padrão — nunca exibir `error.message` cru na UI. Traduzir por `error.code`
num dicionário PT-BR (ver `features/auth/lib/auth-error-messages.ts` como
referência do padrão), com fallback genérico pra code não mapeado.

## Trips: sem state machine no frontend

Transição de estado é 100% backend. Frontend só chama a ação
(`TripsService.startTrip(id)` → `POST /trips/:id/start`) e reage ao status
devolvido. Mapear status→label/cor/botão é apresentação — inline no
componente até repetir 2+ vezes, sem pasta própria.

## API — gotchas do schema.d.ts

Gerar: `bunx openapi-typescript http://localhost:<PORTA>/openapi/json -o src/lib/api-client/schema.d.ts`
— **reiniciar backend por completo (não hot-reload) antes**, plugin OpenAPI não recarrega sozinho.

- `components.schemas` sempre `never` — usar helper `ApiResponse<Op>` (extrai
  de `operations[Op]['responses'][200]...`), não `components['schemas']`.
- `createdAt/updatedAt/scheduledAt/cancelledAt/price/amount` = `unknown`
  (`z.date()`/Decimal não representável em JSON Schema, backend usa
  `unrepresentable:"any"`). Cast manual até resolver na fonte.
- Listagem inconsistente: alguns módulos retornam array puro em `data`,
  outros paginam (`data:{data:[...],page,pageSize,total}`). Checar por endpoint.

## Comandos

`bun --bun run dev` · `bun --bun run check` (rodar sempre ao fim de tarefa) ·
`bun --bun run generate-routes`

## Design

Sem shadcn/ui — Tailwind puro. Mock de referência: `design/mock-reference.html`.
Tokens: navy `#0F1F3A`/`#16223B`, dourado `#C6A15B`, cremes `#F7F5F0`/`#FBF9F5`,
neutros `#9C9285`/`#6B6459`/`#E8E3D8`, verde-sálvia `#5C8F72`/`#E3EEE7`
(status positivo). Fontes: Playfair Display (headings/logo), Public Sans (UI/corpo).
