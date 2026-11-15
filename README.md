# FunilApp

Catálogo de 36 apps standalone que compõem o funil de produtos.
Cada pasta abaixo é um app independente (um dia poderá ser desenvolvido e
vendido separadamente), baseado no modelo de funil de apps PLR levantado em
`eva.igorstorm.com` (produto AppFunnelsPro).

## Apps

- [`anti-ansiedade/`](anti-ansiedade/README.md) — **Anti-Ansiedade** (Saúde/Bem-estar)
- [`anti-estresse/`](anti-estresse/README.md) — **Anti-Estresse** (Saúde/Bem-estar)
- [`anti-insonia/`](anti-insonia/README.md) — **Anti-Insônia** (Saúde/Bem-estar)
- [`astrologia/`](astrologia/README.md) — **Astrologia** (Espiritualidade)
- [`barriga-de-aco/`](barriga-de-aco/README.md) — **Barriga de Aço** (Fitness)
- [`bolo-gourmet/`](bolo-gourmet/README.md) — **Bolo Gourmet** (Culinária)
- [`brigadeiros-gourmet/`](brigadeiros-gourmet/README.md) — **Brigadeiros Gourmet** (Culinária)
- [`cardio-em-casa/`](cardio-em-casa/README.md) — **Cardio em Casa** (Fitness)
- [`dieta-cetogenica/`](dieta-cetogenica/README.md) — **Dieta Cetogênica** (Saúde/Nutrição)
- [`cha-detox/`](cha-detox/README.md) — **Chá Detox** (Saúde/Nutrição)
- [`copywriter/`](copywriter/README.md) — **Copywriter** (Negócios Digitais)
- [`app-cristao/`](app-cristao/README.md) — **App Cristão** (Religião/Espiritualidade)
- [`doces-sem-acucar/`](doces-sem-acucar/README.md) — **Doces sem Açúcar** (Culinária/Saúde)
- [`espiritualidade-em-acao/`](espiritualidade-em-acao/README.md) — **Espiritualidade em Ação** (Religião/Espiritualidade)
- [`expert-em-trafego-pago/`](expert-em-trafego-pago/README.md) — **Expert em Tráfego Pago** (Negócios Digitais)
- [`freelancer-digital/`](freelancer-digital/README.md) — **Freelancer Digital** (Negócios Digitais)
- [`geladinho-gourmet/`](geladinho-gourmet/README.md) — **Geladinho Gourmet** (Culinária)
- [`gluteo-perfeito/`](gluteo-perfeito/README.md) — **Glúteo Perfeito** (Fitness)
- [`inteligencia-emocional/`](inteligencia-emocional/README.md) — **Inteligência Emocional** (Desenvolvimento Pessoal)
- [`iogurte-gourmet/`](iogurte-gourmet/README.md) — **Iogurte Gourmet** (Culinária)
- [`jejum-intermitente/`](jejum-intermitente/README.md) — **Jejum Intermitente** (Saúde/Nutrição)
- [`leitura-diaria-da-biblia/`](leitura-diaria-da-biblia/README.md) — **Leitura Diária da Bíblia** (Religião/Espiritualidade)
- [`lucrando-com-ia/`](lucrando-com-ia/README.md) — **Lucrando com IA** (Negócios Digitais)
- [`marketing-digital-para-iniciantes/`](marketing-digital-para-iniciantes/README.md) — **Marketing Digital para Iniciantes** (Negócios Digitais)
- [`marmita-fit/`](marmita-fit/README.md) — **Marmita Fit** (Saúde/Nutrição)
- [`pilates-em-casa/`](pilates-em-casa/README.md) — **Pilates em Casa** (Fitness)
- [`poder-da-oracao/`](poder-da-oracao/README.md) — **Poder da Oração** (Religião/Espiritualidade)
- [`matando-a-procrastinacao/`](matando-a-procrastinacao/README.md) — **Matando a Procrastinação** (Produtividade)
- [`receitas-para-diabeticos/`](receitas-para-diabeticos/README.md) — **Receitas para Diabéticos** (Saúde/Nutrição)
- [`reiki/`](reiki/README.md) — **Reiki** (Espiritualidade)
- [`rotina-produtiva/`](rotina-produtiva/README.md) — **Rotina Produtiva** (Produtividade)
- [`calistenia-sexy/`](calistenia-sexy/README.md) — **Calistenia Sexy** (Fitness)
- [`sopa-detox/`](sopa-detox/README.md) — **Sopa Detox** (Saúde/Nutrição)
- [`suco-detox/`](suco-detox/README.md) — **Suco Detox** (Saúde/Nutrição)
- [`vendas-no-whatsapp/`](vendas-no-whatsapp/README.md) — **Vendas no WhatsApp** (Negócios Digitais)
- [`yoga-profissional/`](yoga-profissional/README.md) — **Yoga Profissional** (Fitness)

## Stack

- **App web**: [`web/`](web/) — Next.js (App Router) servindo a landing (`/`) e uma rota por
  app (`/<slug-curto>`, ex: `/ansiedade`), com edição de cada app pela própria interface.
- **Banco de dados**: PostgreSQL (Supabase, projeto `funilapps`) via Prisma ORM + migrations.
  Cada app é uma linha na tabela `App` (slug curto, categoria, descrição, status), permitindo
  publicar/editar cada um independentemente dentro do mesmo catálogo.
- **Domínio alvo**: `funilapps.unifyhub.com.br`.

Ver [`web/README.md`](web/README.md) para instruções de desenvolvimento local.
