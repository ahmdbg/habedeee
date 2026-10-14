import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface InteractiveCakeProps {
  recipientName: string;
  age?: string;
  onBlownOut?: () => void;
}

export function InteractiveCake({ recipientName, age, onBlownOut }: InteractiveCakeProps) {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [wishingNote, setWishingNote] = useState(false);

  const handleBlowCandle = () => {
    if (isBlownOut) return;
    setIsBlownOut(true);
    setWishingNote(true);

    audioEngine.playCandleBlow();

    setTimeout(() => {
      audioEngine.playFireworkPop(1.15);
      const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || navigator.maxTouchPoints > 0);

      // Sky blue & butter yellow pastel confetti
      confetti({
        particleCount: isMobile ? 35 : 75,
        spread: isMobile ? 65 : 85,
        origin: { y: 0.65 },
        colors: ['#38bdf8', '#7dd3fc', '#fde047', '#fef08a', '#ffffff', '#bae6fd'],
        disableForReducedMotion: true,
      });
    }, 120);

    if (onBlownOut) {
      onBlownOut();
    }
  };

  const handleRelight = () => {
    setIsBlownOut(false);
    setWishingNote(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-3xl border-2 border-sky-400/30 shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Decorative top ribbon badge */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sky-950/80 border border-sky-400/40 text-[10px] text-sky-200 font-medium tracking-wider flex items-center gap-1.5">
        <span>🎀</span>
        <span>Make a Sweet Wish</span>
        <span>⭐</span>
      </div>

      {/* Cake Illustration */}
      <div className="relative w-64 h-56 flex flex-col items-center justify-end select-none mt-2">
        {/* Tier 1 (Top Layer: Soft Baby Blue & Vanilla Cream) */}
        <div className="relative w-36 h-12 bg-gradient-to-b from-sky-100 to-sky-200 rounded-t-2xl border border-sky-300/60 shadow-inner z-10 flex items-center justify-center">
          {/* Candle & Flame (Standing cleanly ON TOP of Tier 1) */}
          <div className="absolute -top-[62px] left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
            {!isBlownOut ? (
              <button
                onClick={handleBlowCandle}
                title="Ketuk untuk meniup lilin!"
                className="relative cursor-pointer group focus:outline-none transition-transform hover:scale-110"
                aria-label="Tiup lilin ulang tahun"
              >
                {/* Flame (Warm butter yellow with sky blue core) */}
                <div className="w-5 h-8 bg-gradient-to-t from-sky-400 via-amber-300 to-yellow-100 rounded-full animate-flicker shadow-[0_0_15px_#fde047]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-3.5 bg-sky-300/80 rounded-full blur-[1px]" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-yellow-200 text-[10px] px-2 py-0.5 rounded whitespace-nowrap border border-yellow-400/30">
                  Tiup lilinnya! ✨
                </div>
              </button>
            ) : (
              /* Smoke wisps after blowing out */
              <div className="relative h-8 flex flex-col items-center justify-end">
                <div className="w-1.5 h-6 bg-gradient-to-t from-sky-200/50 to-transparent rounded-full blur-[1px] animate-pulse" />
                <div className="w-2.5 h-2.5 bg-sky-300/30 rounded-full blur-sm -translate-y-2" />
              </div>
            )}

            {/* Wick */}
            <div className="w-0.5 h-2 bg-neutral-800" />

            {/* Candle Body (Baby blue with butter yellow spiral stripes) */}
            <div className="w-3.5 h-8 bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300 rounded-sm shadow-md border-x border-sky-400/50 flex flex-col justify-evenly items-center">
              <div className="w-full h-0.5 bg-yellow-300/80" />
              <div className="w-full h-0.5 bg-yellow-300/80" />
              <div className="w-full h-0.5 bg-yellow-300/80" />
            </div>
          </div>

          {/* Vanilla Cream Drips (Butter Yellow) */}
          <div className="absolute top-0 inset-x-0 h-4 bg-yellow-200/90 rounded-t-2xl flex justify-around items-end">
            <span className="w-2.5 h-3 bg-yellow-200/90 rounded-b-full translate-y-1.5" />
            <span className="w-3 h-4 bg-yellow-200/90 rounded-b-full translate-y-2" />
            <span className="w-2 h-2.5 bg-yellow-200/90 rounded-b-full translate-y-1" />
            <span className="w-3 h-3.5 bg-yellow-200/90 rounded-b-full translate-y-2" />
          </div>

          {age ? (
            <span className="relative z-10 text-xs font-bold text-sky-950 tracking-wider font-serif bg-yellow-300/90 px-3 py-1 rounded-full mt-2.5 shadow-sm border border-yellow-400/50">
              Ke-{age} ✨
            </span>
          ) : (
            <span className="relative z-10 text-[10px] uppercase font-bold text-sky-950/80 tracking-widest mt-2">
              Spesial
            </span>
          )}
        </div>

        {/* Tier 2 (Bottom Layer: Dreamy Sky Blue with pastel sprinkles) */}
        <div className="relative w-52 h-16 bg-gradient-to-b from-sky-200 via-sky-100 to-sky-300 rounded-t-3xl border border-sky-400/50 shadow-lg flex flex-col items-center justify-between py-2">
          {/* Butter Cream Drips */}
          <div className="absolute -top-1 inset-x-0 h-4 bg-yellow-200/90 rounded-t-3xl flex justify-around items-end">
            <span className="w-3 h-3.5 bg-yellow-200/90 rounded-b-full translate-y-1.5" />
            <span className="w-4 h-4.5 bg-yellow-200/90 rounded-b-full translate-y-2.5" />
            <span className="w-3 h-3.5 bg-yellow-200/90 rounded-b-full translate-y-1.5" />
            <span className="w-3.5 h-4 bg-yellow-200/90 rounded-b-full translate-y-2" />
            <span className="w-2.5 h-3 bg-yellow-200/90 rounded-b-full translate-y-1" />
          </div>
          <div className="text-[11px] font-semibold text-sky-950 tracking-wider truncate max-w-[190px] mt-2">
            🎂 {recipientName}
          </div>
          {/* Pastel sugar pearls */}
          <div className="flex gap-2.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-yellow-300 shadow-xs" />
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-xs" />
            <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
            <span className="w-2 h-2 rounded-full bg-yellow-300 shadow-xs" />
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-xs" />
          </div>
        </div>

        {/* Cake Plate (Pastel yellow and baby blue trim) */}
        <div className="w-64 h-3 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 rounded-full shadow-md border-t border-yellow-100" />
        <div className="w-48 h-2 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 rounded-b-lg shadow-sm" />
      </div>

      {/* Interactive Controls & Status */}
      <div className="mt-5 text-center">
        {!isBlownOut ? (
          <button
            onClick={handleBlowCandle}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-400 via-sky-300 to-yellow-300 hover:from-sky-300 hover:to-yellow-200 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-sky-400/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Tiup Lilin & Ucapkan Permohonan 🎂✨</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2 animate-fade-in">
            <p className="text-xs sm:text-sm font-semibold text-yellow-300 flex items-center gap-1.5">
              <span>🎉</span>
              <span>Lilin berhasil ditiup! Semoga semua harapan indahmu dikabulkan Allah!</span>
              <span>🤲🏻</span>
            </p>
            <button
              onClick={handleRelight}
              className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-yellow-200 transition-colors py-1 px-3 rounded-lg hover:bg-slate-800/80 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nyalakan Lilin Kembali</span>
            </button>
          </div>
        )}
      </div>

      {wishingNote && (
        <div className="mt-4 p-3.5 bg-sky-950/60 border border-yellow-400/30 rounded-2xl text-center max-w-sm">
          <p className="text-xs text-yellow-200 leading-relaxed italic">
            &ldquo;Tutup matamu sejenak... Bisikkan doa terbaikmu dalam hati. Semesta dan malaikat mengamini setiap doa baikmu hari ini.&rdquo; ✨🤍
          </p>
        </div>
      )}
    </div>
  );
}
