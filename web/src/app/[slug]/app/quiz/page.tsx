import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuizGame } from "./quiz-game";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({ where: { slug } });

  if (!app) {
    notFound();
  }

  const questions = await prisma.quizQuestion.findMany({
    where: { appId: app.id },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
        🧠 Quiz
      </h1>
      <QuizGame questions={questions} slug={slug} appId={app.id} />
    </div>
  );
}
