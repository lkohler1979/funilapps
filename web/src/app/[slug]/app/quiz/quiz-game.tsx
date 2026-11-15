"use client";

import { useEffect, useState } from "react";

type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
};

const QUESTIONS_PER_ROUND = 10;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function QuizGame({ questions }: { questions: QuizQuestion[] }) {
  const [round, setRound] = useState(0);
  const [pool, setPool] = useState<QuizQuestion[] | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setPool(shuffle(questions).slice(0, QUESTIONS_PER_ROUND));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pool === null) {
    return <p className="text-sm text-zinc-500">Carregando...</p>;
  }

  const current = pool[index];
  const finished = index >= pool.length;

  function restart() {
    setPool(shuffle(questions).slice(0, QUESTIONS_PER_ROUND));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setRound((r) => r + 1);
  }

  function choose(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === current.correct) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  if (questions.length === 0) {
    return <p className="text-sm text-zinc-500">Nenhuma pergunta disponível.</p>;
  }

  if (finished) {
    return (
      <div
        key={round}
        className="rounded-lg border border-black/[.08] bg-white p-6 text-center dark:border-white/[.1] dark:bg-zinc-950"
      >
        <p className="text-lg font-semibold text-black dark:text-zinc-50">
          Resultado: {score}/{pool.length}
        </p>
        <button
          onClick={restart}
          className="mt-4 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Jogar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <p className="mb-4 text-xs text-zinc-500">
        Pergunta {index + 1} de {pool.length} · Pontos: {score}
      </p>
      <p className="mb-4 font-medium text-black dark:text-zinc-50">
        {current.question}
      </p>
      <div className="flex flex-col gap-2">
        {current.options.map((option, i) => {
          const isCorrect = i === current.correct;
          const isSelected = i === selected;
          let className =
            "rounded border border-black/[.12] px-3 py-2 text-left text-sm text-black dark:border-white/[.15] dark:text-zinc-50";
          if (selected !== null) {
            if (isCorrect) {
              className += " border-green-600 bg-green-50 dark:bg-green-950";
            } else if (isSelected) {
              className += " border-red-600 bg-red-50 dark:bg-red-950";
            }
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={className}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-4">
          {current.explanation && (
            <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
              {current.explanation}
            </p>
          )}
          <button
            onClick={next}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            {index + 1 < pool.length ? "Próxima" : "Ver resultado"}
          </button>
        </div>
      )}
    </div>
  );
}
