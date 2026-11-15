import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type AppSeed = {
  slug: string;
  folderSlug: string;
  name: string;
  category: string;
  description: string;
};

const APPS: AppSeed[] = [
  { slug: "ansiedade", folderSlug: "anti-ansiedade", name: "Anti-Ansiedade", category: "Saúde/Bem-estar", description: "Técnicas rápidas (respiração, exercícios guiados, diário) para ajudar o usuário a controlar crises de ansiedade no dia a dia." },
  { slug: "estresse", folderSlug: "anti-estresse", name: "Anti-Estresse", category: "Saúde/Bem-estar", description: "Conteúdo e exercícios práticos para reduzir o estresse diário, com rotinas de relaxamento e mindfulness." },
  { slug: "insonia", folderSlug: "anti-insonia", name: "Anti-Insônia", category: "Saúde/Bem-estar", description: "Técnicas, sons e rotinas noturnas para melhorar a qualidade do sono e combater a insônia." },
  { slug: "astrologia", folderSlug: "astrologia", name: "Astrologia", category: "Espiritualidade", description: "Mapa astral, horóscopo e previsões personalizadas baseadas em astrologia." },
  { slug: "barriga-de-aco", folderSlug: "barriga-de-aco", name: "Barriga de Aço", category: "Fitness", description: "Treinos de abdômen em casa, sem equipamentos, com progressão por nível." },
  { slug: "bolo-gourmet", folderSlug: "bolo-gourmet", name: "Bolo Gourmet", category: "Culinária", description: "Receitas de bolos gourmet passo a passo, com dicas de decoração e venda." },
  { slug: "brigadeiros", folderSlug: "brigadeiros-gourmet", name: "Brigadeiros Gourmet", category: "Culinária", description: "Receitas de brigadeiros gourmet para consumo próprio ou revenda." },
  { slug: "cardio", folderSlug: "cardio-em-casa", name: "Cardio em Casa", category: "Fitness", description: "Treinos cardiovasculares sem equipamentos, para queima de gordura em casa." },
  { slug: "cetogenica", folderSlug: "dieta-cetogenica", name: "Dieta Cetogênica", category: "Saúde/Nutrição", description: "Cardápios, receitas e guia prático para iniciar e manter a dieta cetogênica." },
  { slug: "cha-detox", folderSlug: "cha-detox", name: "Chá Detox", category: "Saúde/Nutrição", description: "Receitas de chás detox e guia de rotina de desintoxicação." },
  { slug: "copywriter", folderSlug: "copywriter", name: "Copywriter", category: "Negócios Digitais", description: "Guia e templates para aprender e aplicar copywriting em vendas e marketing." },
  { slug: "cristao", folderSlug: "app-cristao", name: "App Cristão", category: "Religião/Espiritualidade", description: "Devocionais, orações e conteúdo cristão diário." },
  { slug: "doces-sem-acucar", folderSlug: "doces-sem-acucar", name: "Doces sem Açúcar", category: "Culinária/Saúde", description: "Receitas de doces sem açúcar para dietas restritivas." },
  { slug: "espiritualidade", folderSlug: "espiritualidade-em-acao", name: "Espiritualidade em Ação", category: "Religião/Espiritualidade", description: "Práticas e reflexões diárias para desenvolvimento espiritual." },
  { slug: "trafego-pago", folderSlug: "expert-em-trafego-pago", name: "Expert em Tráfego Pago", category: "Negócios Digitais", description: "Guia prático de tráfego pago (Meta Ads, Google Ads) para iniciantes." },
  { slug: "freelancer", folderSlug: "freelancer-digital", name: "Freelancer Digital", category: "Negócios Digitais", description: "Guia para começar e crescer como freelancer digital." },
  { slug: "geladinho", folderSlug: "geladinho-gourmet", name: "Geladinho Gourmet", category: "Culinária", description: "Receitas de geladinhos gourmet para venda." },
  { slug: "gluteo", folderSlug: "gluteo-perfeito", name: "Glúteo Perfeito", category: "Fitness", description: "Treinos específicos de glúteos em casa, organizados por nível." },
  { slug: "inteligencia-emocional", folderSlug: "inteligencia-emocional", name: "Inteligência Emocional", category: "Desenvolvimento Pessoal", description: "Exercícios e conteúdo para desenvolver inteligência emocional no dia a dia." },
  { slug: "iogurte", folderSlug: "iogurte-gourmet", name: "Iogurte Gourmet", category: "Culinária", description: "Receitas de iogurte caseiro gourmet, incluindo variações para venda." },
  { slug: "jejum", folderSlug: "jejum-intermitente", name: "Jejum Intermitente", category: "Saúde/Nutrição", description: "Guia prático e protocolos de jejum intermitente." },
  { slug: "biblia", folderSlug: "leitura-diaria-da-biblia", name: "Leitura Diária da Bíblia", category: "Religião/Espiritualidade", description: "Plano de leitura bíblica diária com devocionais." },
  { slug: "lucrando-com-ia", folderSlug: "lucrando-com-ia", name: "Lucrando com IA", category: "Negócios Digitais", description: "Guia de como usar inteligência artificial para gerar renda extra." },
  { slug: "marketing-digital", folderSlug: "marketing-digital-para-iniciantes", name: "Marketing Digital para Iniciantes", category: "Negócios Digitais", description: "Fundamentos de marketing digital para quem está começando." },
  { slug: "marmita-fit", folderSlug: "marmita-fit", name: "Marmita Fit", category: "Saúde/Nutrição", description: "Receitas e planejamento de marmitas fit semanais." },
  { slug: "pilates", folderSlug: "pilates-em-casa", name: "Pilates em Casa", category: "Fitness", description: "Aulas e rotinas de pilates sem equipamentos." },
  { slug: "oracao", folderSlug: "poder-da-oracao", name: "Poder da Oração", category: "Religião/Espiritualidade", description: "Conteúdo e práticas de oração diária." },
  { slug: "procrastinacao", folderSlug: "matando-a-procrastinacao", name: "Matando a Procrastinação", category: "Produtividade", description: "Técnicas práticas para vencer a procrastinação." },
  { slug: "diabeticos", folderSlug: "receitas-para-diabeticos", name: "Receitas para Diabéticos", category: "Saúde/Nutrição", description: "Receitas adaptadas para quem tem diabetes." },
  { slug: "reiki", folderSlug: "reiki", name: "Reiki", category: "Espiritualidade", description: "Guia introdutório e práticas de reiki." },
  { slug: "rotina-produtiva", folderSlug: "rotina-produtiva", name: "Rotina Produtiva", category: "Produtividade", description: "Métodos e templates para montar rotinas produtivas." },
  { slug: "calistenia", folderSlug: "calistenia-sexy", name: "Calistenia Sexy", category: "Fitness", description: "Treinos de calistenia focados em estética corporal." },
  { slug: "sopa-detox", folderSlug: "sopa-detox", name: "Sopa Detox", category: "Saúde/Nutrição", description: "Receitas de sopas detox para emagrecimento." },
  { slug: "suco-detox", folderSlug: "suco-detox", name: "Suco Detox", category: "Saúde/Nutrição", description: "Receitas de sucos detox." },
  { slug: "vendas-whatsapp", folderSlug: "vendas-no-whatsapp", name: "Vendas no WhatsApp", category: "Negócios Digitais", description: "Guia e scripts para vender pelo WhatsApp." },
  { slug: "yoga", folderSlug: "yoga-profissional", name: "Yoga Profissional", category: "Fitness", description: "Aulas de yoga guiadas por nível, do iniciante ao avançado." },
];

async function main() {
  for (const app of APPS) {
    await prisma.app.upsert({
      where: { slug: app.slug },
      update: { ...app, status: "published" },
      create: { ...app, status: "published" },
    });
  }
  console.log(`Seeded ${APPS.length} apps.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
