import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuizGame } from "./quiz-game";

export const dynamic = "force-dynamic";

type QuizQuestion = {
  category?: string;
  difficulty?: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
};

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

  const quiz = (app.quiz ?? {}) as { questions?: QuizQuestion[] };
  const questions = quiz.questions ?? [];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
        🧠 Quiz
      </h1>
      <QuizGame questions={questions} />
    </div>
  );
}
