"use client";

import { useEffect, useState } from "react";

/** Live countdown to the next event — "आगामी कार्यक्रम में X दिन शेष" */
export default function Countdown({ targetDate }: { targetDate: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const target = new Date(targetDate);
      const diff = Math.ceil((target.getTime() - now.getTime()) / 86400000);
      setDays(Math.max(diff, 0));
    };
    update();
    const id = setInterval(update, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // Render nothing until mounted to avoid hydration mismatch
  if (days === null) return null;

  return (
    <p className="text-lg font-bold text-gold-300 sm:text-xl">
      {days === 0 ? "आज ही है कार्यक्रम!" : `आगामी कार्यक्रम में ${days} दिन शेष`}
    </p>
  );
}
