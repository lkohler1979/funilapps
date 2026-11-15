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
   AUTH_SECRET="<string aleatória, ex: openssl rand -hex 32>"
   ADMIN_PASSWORD="<senha de admin para editar o catálogo>"
   SITE_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="<chave secreta da Stripe>"
   STRIPE_WEBHOOK_SECRET="<signing secret do webhook da Stripe>"
   ```

   `DATABASE_URL` é a conexão via pooler (usada pela aplicação em runtime).
   `DIRECT_URL` é a conexão direta (porta 5432), usada pelo Prisma CLI.
   `AUTH_SECRET` assina o cookie de sessão do login (`/login`) e `ADMIN_PASSWORD`
   é a senha única de administrador — só com ela logado é possível editar um
   app pelo formulário em `/<slug>`. `SITE_URL` é a URL pública do site (usada
   para montar as URLs de retorno do checkout Stripe). `STRIPE_SECRET_KEY` e
   `STRIPE_WEBHOOK_SECRET` vêm do dashboard da Stripe (ver seção "Pagamentos").

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

## Autenticação

A edição de cada app (`/<slug>`) é protegida por login simples (senha única
de administrador, cookie assinado com `AUTH_SECRET`):

- `src/lib/auth.ts` — assina/valida o cookie de sessão e confere a senha.
- `src/app/login/` — página e Server Actions de login/logout.
- A Server Action `updateApp` (`src/app/[slug]/actions.ts`) recusa a
  atualização se não houver sessão válida, independente do que a UI mostra —
  essa é a verificação que realmente importa.
- A listagem (`/`) e a visualização de cada app continuam públicas; só o
  formulário de edição fica oculto para quem não está logado.

## Pagamentos

Cada app tem um preço (`priceCents`, editável pelo admin em `/<slug>`) e
existe uma oferta de pacote com todos os 36 apps (`BUNDLE_PRICE_CENTS` em
`src/lib/pricing.ts`). Checkout via Stripe (Checkout Session hospedado, sem
Stripe.js no front-end):

- `src/app/checkout/actions.ts` — cria a sessão de checkout (por app ou
  pacote) e o desbloqueio manual por e-mail.
- `src/app/api/checkout/callback/route.ts` — URL de retorno do Stripe após o
  pagamento: confirma a sessão, grava a compra e libera acesso (cookie) neste
  navegador.
- `src/app/api/webhooks/stripe/route.ts` — webhook (`checkout.session.completed`)
  que confirma a compra de forma assíncrona/idempotente — necessário caso o
  comprador feche a aba antes de retornar (ex: pagamento via PIX).
- `src/lib/buyer.ts` — cookie assinado com o e-mail do comprador e checagem de
  acesso (`hasAccessToApp`) contra a tabela `Purchase`.
- Quem comprou mas está em outro navegador/dispositivo pode desbloquear de
  novo informando o mesmo e-mail em "Já comprei" na página do app.
- Configurar na Stripe: um webhook endpoint apontando para
  `<SITE_URL>/api/webhooks/stripe`, evento `checkout.session.completed`.

## Limitações conhecidas

- Login único (uma senha de admin, sem multiusuário/papéis) — suficiente
  para proteger a edição, mas não serve para múltiplos editores.
- O "conteúdo" liberado pela compra ainda é a descrição do catálogo — os
  apps em si (funcionalidade real de cada nicho) ainda não foram construídos.
