import { useState, useEffect } from 'react';
import { BIRTHDAY_DATA } from '../config/birthdayData';

interface CountdownLockProps {
  onUnlock: () => void;
  onPreviewBypass: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUnlocked: boolean;
}

export function CountdownLock({ onUnlock, onPreviewBypass }: CountdownLockProps) {
  const data = BIRTHDAY_DATA;
  const targetDate = new Date(data.unlockTargetTime).getTime();

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isUnlocked: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeLeft(remaining);

      if (remaining.isUnlocked) {
        clearInterval(timer);
        onUnlock();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onUnlock]);

  const pad = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 z-10 select-none bg-[#030914]">
      {/* Pure, Minimalist, Aesthetic Countdown Timer */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="w-18 sm:w-28 md:w-32 py-4 sm:py-6 rounded-2xl sm:rounded-3xl bg-[#071733]/90 border border-sky-400/30 shadow-[0_0_25px_rgba(56,189,248,0.12)] flex items-center justify-center">
            <span className="text-3xl sm:text-6xl md:text-7xl font-mono font-bold text-yellow-300 tabular-nums tracking-tight">
              {pad(timeLeft.days)}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-sky-300/80 mt-2 sm:mt-3">
            Hari
          </span>
        </div>

        <span className="text-2xl sm:text-4xl font-mono text-yellow-300/40 -translate-y-3 sm:-translate-y-4">
          :
        </span>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="w-18 sm:w-28 md:w-32 py-4 sm:py-6 rounded-2xl sm:rounded-3xl bg-[#071733]/90 border border-sky-400/30 shadow-[0_0_25px_rgba(56,189,248,0.12)] flex items-center justify-center">
            <span className="text-3xl sm:text-6xl md:text-7xl font-mono font-bold text-yellow-300 tabular-nums tracking-tight">
              {pad(timeLeft.hours)}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-sky-300/80 mt-2 sm:mt-3">
            Jam
          </span>
        </div>

        <span className="text-2xl sm:text-4xl font-mono text-yellow-300/40 -translate-y-3 sm:-translate-y-4">
          :
        </span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="w-18 sm:w-28 md:w-32 py-4 sm:py-6 rounded-2xl sm:rounded-3xl bg-[#071733]/90 border border-sky-400/30 shadow-[0_0_25px_rgba(56,189,248,0.12)] flex items-center justify-center">
            <span className="text-3xl sm:text-6xl md:text-7xl font-mono font-bold text-yellow-300 tabular-nums tracking-tight">
              {pad(timeLeft.minutes)}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-sky-300/80 mt-2 sm:mt-3">
            Menit
          </span>
        </div>

        <span className="text-2xl sm:text-4xl font-mono text-yellow-300/40 -translate-y-3 sm:-translate-y-4">
          :
        </span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="w-18 sm:w-28 md:w-32 py-4 sm:py-6 rounded-2xl sm:rounded-3xl bg-[#071733]/90 border border-sky-400/30 shadow-[0_0_25px_rgba(56,189,248,0.12)] flex items-center justify-center">
            <span className="text-3xl sm:text-6xl md:text-7xl font-mono font-bold text-sky-300 tabular-nums tracking-tight">
              {pad(timeLeft.seconds)}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-sky-300/80 mt-2 sm:mt-3">
            Detik
          </span>
        </div>
      </div>

      {/* Discreet Bypass for Owner (almost invisible in bottom corner, clickable for preview) */}
      <button
        onClick={onPreviewBypass}
        className="fixed bottom-3 right-3 text-[10px] text-sky-400/20 hover:text-sky-300/70 p-2 rounded transition-colors cursor-pointer"
        title="Pratinjau kartu"
      >
        ✦
      </button>
    </div>
  );
}
