"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getBuyerEmail } from "@/lib/buyer";

export async function toggleExerciseDone(
  slug: string,
  appId: string,
  exerciseName: string,
  done: boolean,
) {
  const email = await getBuyerEmail();
  if (!email) return;

  if (done) {
    await prisma.userProgress.upsert({
      where: {
        email_appId_kind_key: { email, appId, kind: "exercise", key: exerciseName },
      },
      create: { email, appId, kind: "exercise", key: exerciseName },
      update: {},
    });
  } else {
    await prisma.userProgress.deleteMany({
      where: { email, appId, kind: "exercise", key: exerciseName },
    });
  }

  revalidatePath(`/${slug}/app/treinos`);
  revalidatePath(`/${slug}/app/progress`);
}

export async function submitQuizResult(
  slug: string,
  appId: string,
  score: number,
  total: number,
) {
  const email = await getBuyerEmail();
  if (!email) return;

  await prisma.userProgress.upsert({
    where: {
      email_appId_kind_key: { email, appId, kind: "quiz", key: "latest" },
    },
    create: { email, appId, kind: "quiz", key: "latest", value: { score, total } },
    update: { value: { score, total }, completedAt: new Date() },
  });

  revalidatePath(`/${slug}/app/progress`);
}
