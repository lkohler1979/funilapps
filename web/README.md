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
   ADMIN_EMAIL="<e-mail do superadmin>"
   ADMIN_PASSWORD="<senha do superadmin>"
   SITE_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="<chave secreta da Stripe>"
   STRIPE_WEBHOOK_SECRET="<signing secret do webhook da Stripe>"
   ```

   `DATABASE_URL` é a conexão via pooler (usada pela aplicação em runtime).
   `DIRECT_URL` é a conexão direta (porta 5432), usada pelo Prisma CLI.
   `AUTH_SECRET` assina os cookies de sessão (login admin e acesso de
   comprador). `ADMIN_EMAIL`/`ADMIN_PASSWORD` são as credenciais do único
   superadmin (login em `/login`, painel em `/admin`). `SITE_URL` é a URL
   pública do site (usada para montar as URLs de retorno do checkout Stripe).
   `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` vêm do dashboard da Stripe
   (ver seção "Pagamentos").

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
- `src/app/[slug]/page.tsx` — página pública de cada app (paywall, compra,
  combos relacionados). Edição fica só no painel `/admin`.
- `src/app/admin/` — painel do superadmin (dashboard, CRUD de apps, combos,
  relatório de vendas).
- `prisma/schema.prisma` — modelos `App`, `RelatedApp` (combos) e `Purchase`.
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

Login único de superadmin (e-mail + senha, cookie assinado com `AUTH_SECRET`):

- `src/lib/auth.ts` — assina/valida o cookie de sessão e confere e-mail/senha
  contra `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
- `src/app/login/` — página e Server Actions de login/logout.
- `src/app/admin/layout.tsx` — bloqueia toda a área `/admin` (e cada Server
  Action em `src/app/admin/apps/actions.ts` confere a sessão de novo) para
  quem não está logado — essa é a verificação que realmente importa.
- A listagem (`/`) e a visualização de cada app continuam 100% públicas.

## Painel admin (`/admin`)

- `/admin` — dashboard: total de apps, publicados, vendas, receita,
  compradores únicos e vendas recentes.
- `/admin/apps` — lista todos os apps; `/admin/apps/new` cria um novo
  (slug, nome, categoria, descrição, preço, cor de destaque, status e
  upload da imagem de capa — obrigatória na criação); `/admin/apps/<slug>`
  edita tudo isso (imagem opcional ao editar) e gerencia os combos do app
  (ver "Combos" abaixo).
- `/admin/purchases` — relatório completo de vendas (e-mail, tipo, item,
  valor, data).
- Upload de imagem grava direto em `web/public/apps/<slug>.<ext>` (sem
  storage externo — funciona porque o servidor tem disco persistente via
  PM2). Sem exclusão de apps por enquanto: para tirar do ar, usar status
  "Rascunho".

## Combos (apps relacionados)

Não existe mais compra de "pacote completo". Em vez disso, cada app pode ter
combos com outros apps, com preço próprio:

- Modelo `RelatedApp` (`appId`, `relatedAppId`, `comboPriceCents`) — definido
  em qualquer uma das duas direções, mas exibido na página de ambos os apps.
- Gerenciado em `/admin/apps/<slug>`, seção "Apps relacionados".
- Na página pública do app, aparece em "Leve também" com o preço do combo e
  o preço somado para comparação.

## Pagamentos

Cada app tem um preço (`priceCents`, editável no admin). Checkout via Stripe
(Checkout Session hospedado, sem Stripe.js no front-end):

- `src/app/checkout/actions.ts` — cria a sessão de checkout (app individual
  ou combo) e o desbloqueio manual por e-mail.
- `src/app/api/checkout/callback/route.ts` — URL de retorno do Stripe após o
  pagamento: confirma a sessão, grava a compra e libera acesso (cookie) neste
  navegador.
- `src/app/api/webhooks/stripe/route.ts` — webhook (`checkout.session.completed`)
  que confirma a compra de forma assíncrona/idempotente — necessário caso o
  comprador feche a aba antes de retornar (ex: pagamento via PIX).
- `src/lib/buyer.ts` — cookie assinado com o e-mail do comprador e checagem de
  acesso (`hasAccessToApp`) contra `Purchase.appIds` (array — cobre compra
  individual e combo com a mesma lógica).
- Quem comprou mas está em outro navegador/dispositivo pode desbloquear de
  novo informando o mesmo e-mail em "Já comprei" na página do app.
- Configurar na Stripe: um webhook endpoint apontando para
  `<SITE_URL>/api/webhooks/stripe`, evento `checkout.session.completed`.

## Mini-app (`/<slug>/app`)

Cada app, depois de comprado, abre numa experiência própria em `/<slug>/app`
(protegida pelo mesmo `isUnlocked` da página de vendas): hero, aulas em
vídeo, artigos, notícias, áudios/podcast, plano semanal (desafios por
semana/dia, com detalhe de cada prática), e-book, quiz interativo com
pontuação, e uma aba "Reels" que promove outros apps do nosso catálogo
(em vez de produtos de terceiros).

- Conteúdo original: copiado do material PLR do AppFunnelsPro (editor de
  apps da conta licenciada do usuário — mesmo material já usado para as
  imagens e descrições). Importado uma vez via script para os campos
  `App.tagline/heroBadge/heroTitle/navigation/labels/theme/weeklyPlan/quiz/
  diagnostico/news/progressPhrases/ebook*` e os modelos `Article`, `Podcast`,
  `VideoLesson` (relacionados a `App`).
- `src/app/[slug]/app/layout.tsx` — guarda de acesso + menu inferior
  (dinâmico a partir de `App.navigation`).
- `src/lib/access.ts` — `isUnlocked(appId)` unifica a checagem de admin
  logado ou comprador com acesso (reaproveitado da página de vendas).
- Estrutura/UI é nossa (não é cópia pixel-a-pixel do visual original), mas
  o conteúdo, a organização em seções e a navegação seguem o mesmo padrão
  para todos os 36 apps — o template é genérico, dirigido pelos dados de
  cada app no banco.

## Limitações conhecidas

- Login único (um superadmin, sem multiusuário/papéis).
- Sem exclusão de apps no painel (só despublicar via status).
- Progresso do plano semanal e histórico do quiz não são persistidos (sem
  tracking de conclusão por usuário ainda).
- Conteúdo do mini-app (artigos, quiz, plano semanal etc.) ainda não é
  editável pelo painel admin — só os campos do catálogo (nome, preço,
  descrição, imagem, cor, status) são.
