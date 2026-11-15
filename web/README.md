# FunilApp — web

App Next.js que serve o catálogo/funil de apps: a landing (`/`) lista os apps
cadastrados no banco, e cada um tem sua própria rota `/<slug>` com visualização
e edição pela interface.

## Stack

- Next.js 16 (App Router, Turbopack)
- Prisma ORM 7 + `@prisma/adapter-pg` (driver adapter)
- PostgreSQL (Supabase)

## Setup local

1. Variáveis de ambiente (`.env`, não commitado):

   ```bash
   DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://...:5432/postgres"
   ```

   `DATABASE_URL` é a conexão via pooler (usada pela aplicação em runtime).
   `DIRECT_URL` é a conexão direta (porta 5432), usada pelo Prisma CLI.

2. Instalar dependências e gerar o client:

   ```bash
   npm install
   npx prisma generate
   ```

3. Rodar migrations (veja nota abaixo sobre o pooler do Supabase):

   ```bash
   DATABASE_URL="$DIRECT_URL" PRISMA_SCHEMA_ENGINE_BINARY="$(pwd)/node_modules/@prisma/engines/schema-engine-darwin-arm64" npx prisma migrate dev
   ```

4. Popular o catálogo com os 36 apps:

   ```bash
   npx tsx prisma/seed.ts
   ```

5. Rodar o app:

   ```bash
   npm run dev
   ```

### Nota sobre Prisma + Supabase pooler

O Supabase expõe a porta `6543` via PgBouncer (transaction mode) e a porta
`5432` para conexão direta. Comandos do Prisma CLI (`migrate dev`, `migrate
deploy`) devem rodar contra a conexão **direta** (`DIRECT_URL`) — contra o
pooler eles falham com `prepared statement "sX" already exists`. A aplicação
em runtime (via `src/lib/prisma.ts`) usa o pooler normalmente.

Nesta máquina também foi necessário fixar `PRISMA_SCHEMA_ENGINE_BINARY`
explicitamente para o binário já baixado em
`node_modules/@prisma/engines/`, porque o CLI ficava travado tentando
resolver o engine por conta própria.

## Estrutura

- `src/app/page.tsx` — landing, lista os apps agrupados por categoria.
- `src/app/[slug]/page.tsx` — página de cada app (view + formulário de edição).
- `src/app/[slug]/actions.ts` — Server Action que salva as edições.
- `prisma/schema.prisma` — modelo `App` (slug, categoria, descrição, status).
- `prisma/seed.ts` — popula os 36 apps do catálogo.

## Produção

Rodando em `funilapps.unifyhub.com.br` (VPS compartilhado com outros projetos
do Luiz — ver `DEPLOY.md` na raiz do repo).

- App: `/var/www/funilapps` no servidor, processo PM2 `funilapp-web` na porta `3500`.
- Nginx: `/etc/nginx/sites-available/funilapps`, SSL via certbot.
- Redeploy:
  ```bash
  ssh root@<ip-do-servidor>
  cd /var/www/funilapps && git pull origin main
  cd web && npm ci && npx prisma generate && npm run build
  pm2 restart funilapp-web
  ```

## Limitações conhecidas

- A edição de cada app não tem autenticação — qualquer pessoa com acesso à
  URL pode editar. Adicionar auth antes de ir para produção.
