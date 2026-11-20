"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function AppSplash({
  image,
  appName,
  accentColor,
  children,
}: {
  image: string;
  appName: string;
  accentColor?: string | null;
  children: React.ReactNode;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        aria-hidden={hidden}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ${
          hidden ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{ backgroundColor: accentColor ?? "#111827" }}
      >
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl shadow-xl">
          <Image
            src={image}
            alt={appName}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>
        <span className="text-sm font-medium text-white">{appName}</span>
      </div>
      {children}
    </>
  );
}
