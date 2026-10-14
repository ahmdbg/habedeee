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

    // Audio effects
    audioEngine.playCandleBlow();

    // Trigger confetti burst
    setTimeout(() => {
      audioEngine.playFireworkPop(1.2);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#fbbf24', '#ec4899', '#8b5cf6', '#10b981'],
      });

      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffd700', '#ffa500', '#ff69b4'],
      });

      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffd700', '#ffa500', '#ff69b4'],
      });
    }, 180);

    if (onBlownOut) {
      onBlownOut();
    }
  };

  const handleRelight = () => {
    setIsBlownOut(false);
    setWishingNote(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Ambient background glow */}
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cake Illustration */}
      <div className="relative w-64 h-52 flex flex-col items-center justify-end select-none">
        {/* Candle & Flame */}
        <div className="absolute top-6 flex flex-col items-center z-20">
          {/* Flame */}
          {!isBlownOut ? (
            <button
              onClick={handleBlowCandle}
              title="Klik untuk meniup lilin!"
              className="relative cursor-pointer group focus:outline-none transition-transform hover:scale-110"
              aria-label="Tiup lilin ulang tahun"
            >
              {/* Outer Glow */}
              <div className="w-6 h-8 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full animate-flicker shadow-[0_0_20px_#f59e0b,0_0_35px_#fbbf24]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-blue-400/80 rounded-full blur-[1px]" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-amber-200 text-[10px] px-2 py-0.5 rounded whitespace-nowrap border border-amber-500/30">
                Klik untuk tiup!
              </div>
            </button>
          ) : (
            /* Smoke wisps after blowing out */
            <div className="relative h-8 flex flex-col items-center justify-end">
              <div className="w-1.5 h-6 bg-gradient-to-t from-slate-400/60 to-transparent rounded-full blur-[1px] animate-pulse" />
              <div className="w-3 h-3 bg-slate-400/40 rounded-full blur-sm -translate-y-2" />
            </div>
          )}

          {/* Wick */}
          <div className="w-0.5 h-3 bg-neutral-800" />

          {/* Candle Body */}
          <div className="w-3.5 h-12 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 rounded-sm shadow-md border-x border-amber-400/50 flex flex-col justify-evenly items-center">
            <div className="w-full h-1 bg-amber-500/40" />
            <div className="w-full h-1 bg-amber-500/40" />
            <div className="w-full h-1 bg-amber-500/40" />
          </div>
        </div>

        {/* Tier 1 (Top Layer) */}
        <div className="relative w-36 h-12 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-xl border border-amber-300/40 shadow-inner z-10 flex items-center justify-center">
          {/* Frosting Drips */}
          <div className="absolute top-0 inset-x-0 h-4 bg-amber-400/80 rounded-t-xl flex justify-around items-end">
            <span className="w-2.5 h-3 bg-amber-400/80 rounded-b-full translate-y-1.5" />
            <span className="w-3 h-4 bg-amber-400/80 rounded-b-full translate-y-2" />
            <span className="w-2 h-2.5 bg-amber-400/80 rounded-b-full translate-y-1" />
            <span className="w-3 h-3.5 bg-amber-400/80 rounded-b-full translate-y-2" />
          </div>
          {age ? (
            <span className="relative z-10 text-xs font-bold text-amber-900 tracking-wider font-serif bg-amber-300/60 px-2 py-0.5 rounded-full mt-2">
              Ke-{age}
            </span>
          ) : (
            <span className="relative z-10 text-[10px] uppercase font-bold text-amber-900/80 tracking-widest mt-2">
              Spesial
            </span>
          )}
        </div>

        {/* Tier 2 (Bottom Layer) */}
        <div className="relative w-48 h-16 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 rounded-t-2xl border border-amber-300/50 shadow-lg flex flex-col items-center justify-between py-2">
          {/* Cream Drips */}
          <div className="absolute -top-1 inset-x-0 h-4 bg-amber-400/70 rounded-t-2xl flex justify-around items-end">
            <span className="w-3 h-3 bg-amber-400/70 rounded-b-full translate-y-1.5" />
            <span className="w-4 h-4 bg-amber-400/70 rounded-b-full translate-y-2.5" />
            <span className="w-3 h-3 bg-amber-400/70 rounded-b-full translate-y-1.5" />
            <span className="w-3.5 h-4 bg-amber-400/70 rounded-b-full translate-y-2" />
            <span className="w-2.5 h-3 bg-amber-400/70 rounded-b-full translate-y-1" />
          </div>
          <div className="text-[11px] font-medium text-amber-800/90 tracking-wider truncate max-w-[170px] mt-2">
            🎂 {recipientName}
          </div>
          {/* Decorative pearls */}
          <div className="flex gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-pink-400 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-pink-400 shadow-sm" />
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
          </div>
        </div>

        {/* Cake Plate / Stand */}
        <div className="w-60 h-3 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 rounded-full shadow-md border-t border-amber-100" />
        <div className="w-44 h-2 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 rounded-b-lg shadow-sm" />
      </div>

      {/* Interactive Controls & Status */}
      <div className="mt-5 text-center">
        {!isBlownOut ? (
          <button
            onClick={handleBlowCandle}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tiup Lilin & Ucapkan Permohonan</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-amber-300 animate-fade-in flex items-center gap-1.5">
              <span>🎉</span>
              <span>Lilin berhasil ditiup! Semoga harapanmu terwujud nyata!</span>
            </p>
            <button
              onClick={handleRelight}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-200 transition-colors py-1 px-3 rounded-lg hover:bg-slate-800/80 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nyalakan Lilin Kembali</span>
            </button>
          </div>
        )}
      </div>

      {wishingNote && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center max-w-sm">
          <p className="text-xs text-amber-200/90 leading-relaxed italic">
            &ldquo;Tutup mata sejenak, buat satu doa terindah dalam hatimu... Semesta mengamini setiap harapan baikmu hari ini.&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
