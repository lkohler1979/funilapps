"use client";

import { useState, useTransition } from "react";
import { toggleExerciseDone } from "../progress-actions";

export function ExerciseToggle({
  slug,
  appId,
  exerciseName,
  initialDone,
}: {
  slug: string;
  appId: string;
  exerciseName: string;
  initialDone: boolean;
}) {
  const [done, setDone] = useState(initialDone);
  const [, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        checked={done}
        onChange={(e) => {
          const next = e.target.checked;
          setDone(next);
          startTransition(() => {
            toggleExerciseDone(slug, appId, exerciseName, next);
          });
        }}
      />
    </label>
  );
}
