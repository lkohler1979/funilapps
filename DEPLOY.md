# Deploy — FunilApp

O app web (`web/`) roda em produção em `funilapps.unifyhub.com.br`, num VPS
compartilhado com outros projetos (ConectaObra, Ethos Financial, etc). Não
mexer nos outros serviços desse servidor ao fazer deploy deste projeto.

## Infra

- **Processo**: PM2, nome `funilapp-web`, porta `3500` (`pm2 list` /
  `pm2 logs funilapp-web`).
- **Nginx**: vhost em `/etc/nginx/sites-available/funilapps`, proxy para
  `127.0.0.1:3500`. SSL via certbot (renovação automática já configurada).
- **Banco**: Postgres gerenciado no Supabase (projeto `funilapps`), não roda
  nesse VPS. Credenciais em `web/.env` no servidor (não commitado).
- **Código**: clonado em `/var/www/funilapps` no servidor.

## Redeploy

```bash
ssh root@<ip-do-servidor>
cd /var/www/funilapps && git pull origin main
cd web && npm ci && npx prisma generate && npm run build
pm2 restart funilapp-web
```

## Primeira vez num servidor novo

1. `git clone` o repo em `/var/www/funilapps`.
2. `cd web && npm ci` — se o npm desse servidor usa `allow-scripts`
   (bloqueia postinstall por padrão), rodar
   `npm approve-scripts @prisma/engines prisma && npm rebuild` antes de
   seguir, senão o engine do Prisma não é baixado.
3. Criar `web/.env` com `DATABASE_URL` (pooler, porta 6543) e `DIRECT_URL`
   (direto, porta 5432) do Supabase, mais `AUTH_SECRET` (string aleatória,
   ex: `openssl rand -hex 32`), `ADMIN_EMAIL`/`ADMIN_PASSWORD` (login do
   superadmin em `/login` e `/admin` — ver seção "Autenticação" em
   `web/README.md`), mais `SITE_URL`, `STRIPE_SECRET_KEY` e
   `STRIPE_WEBHOOK_SECRET` (ver seção "Pagamentos" em `web/README.md`).
4. `npx prisma generate && npm run build`.
5. `pm2 start npm --name funilapp-web --cwd /var/www/funilapps/web -- start -- -p 3500`
   seguido de `pm2 save`.
6. Criar o vhost do nginx (ver exemplo em `/etc/nginx/sites-available/conectaobra`
   nesse mesmo servidor), `nginx -t` antes de recarregar, depois
   `systemctl reload nginx`.
7. `certbot --nginx -d funilapps.unifyhub.com.br --non-interactive --agree-tos`.

## Migrations

Rodar migrations contra o Supabase pela conexão **direta**, não pelo pooler
(ver nota em `web/README.md`):

```bash
cd web
DATABASE_URL="$DIRECT_URL" PRISMA_SCHEMA_ENGINE_BINARY="$(pwd)/node_modules/@prisma/engines/schema-engine-debian-openssl-3.0.x" npx prisma migrate deploy
```

(o nome do binário do engine muda por plataforma — no servidor Linux é
`schema-engine-debian-openssl-3.0.x`, local no Mac é
`schema-engine-darwin-arm64`; conferir com
`ls node_modules/@prisma/engines/`).
