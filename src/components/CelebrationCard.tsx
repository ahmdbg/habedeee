import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Gift,
  Heart,
  Calendar,
  Star,
} from 'lucide-react';
import { BIRTHDAY_DATA } from '../config/birthdayData';
import { InteractiveCake } from './InteractiveCake';
import { audioEngine } from '../utils/audio';

interface CelebrationCardProps {
  onShowCountdown?: () => void;
}

export function CelebrationCard({ onShowCountdown }: CelebrationCardProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const data = BIRTHDAY_DATA;
  const photos = (data.photoUrls?.length ? data.photoUrls : data.photoUrl ? [data.photoUrl] : []).slice(0, 3);

  // Trigger grand celebration burst with sky blue & butter yellow confetti
  const triggerGrandBurst = () => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || navigator.maxTouchPoints > 0);
    confetti({
      particleCount: isMobile ? 35 : 70,
      spread: isMobile ? 65 : 90,
      origin: { y: 0.5 },
      colors: ['#38bdf8', '#7dd3fc', '#fde047', '#fef08a', '#ffffff', '#bae6fd'],
      disableForReducedMotion: true,
    });
    audioEngine.playFireworkPop(1.1);
  };

  const handleOpenGift = () => {
    setIsOpened(true);
    triggerGrandBurst();
    if (data.musicAutoPlay) {
      handleToggleMusic();
    }
  };

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      audioEngine.stopMelody();
      setIsMusicPlaying(false);
    } else {
      audioEngine.setMuted(false);
      audioEngine.startMelody(() => {
        setIsMusicPlaying(false);
      });
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      audioEngine.stopMelody();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-8 md:py-12 z-10">
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-3xl flex items-center justify-between gap-4 py-2 px-4 rounded-2xl bg-slate-900/90 sm:backdrop-blur-md border border-sky-400/30 mb-6 shadow-md">
        <div className="flex items-center gap-2 text-xs md:text-sm text-sky-200">
          <span className="text-yellow-300">🎀</span>
          <span className="font-serif tracking-wide font-medium">
            Hari Spesial {data.recipientNickname}
          </span>
          <span className="text-yellow-300">✨</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Music melody button */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isMusicPlaying
                ? 'bg-sky-500/20 text-yellow-300 border border-yellow-300/40 shadow-[0_0_12px_rgba(253,224,71,0.2)]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-sky-200 border border-sky-500/30'
            }`}
            title="Putar instrumen melodi ulang tahun"
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span className="hidden sm:inline">Melodi Aktif 🎵</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-sky-300" />
                <span className="hidden sm:inline">Putar Musik 🎵</span>
              </>
            )}
          </button>

          {/* Fireworks burst button */}
          <button
            onClick={triggerGrandBurst}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-400 to-yellow-300 hover:from-sky-300 hover:to-yellow-200 text-slate-950 shadow-sm transition-all cursor-pointer"
            title="Tembakkan kembang api"
          >
            <Flame className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">Kembang Api 🎆</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center">
        {!isOpened ? (
          /* ==========================================================
             UNOPENED STATE: CUTE SKY BLUE & BUTTER YELLOW GIFT BOX
             ========================================================== */
          <div className="w-full max-w-md mx-auto text-center flex flex-col items-center animate-fade-in">
            {/* Cute Gift Box */}
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-400/20 via-yellow-300/25 to-sky-400/20 rounded-full blur-xl" />

              <button
                onClick={handleOpenGift}
                className="relative group w-40 h-40 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-[#0c234a] via-[#071733] to-[#0a1f42] border-2 border-sky-400/50 p-6 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {/* Cute Ribbon Tag */}
                <div className="absolute -top-3 px-3.5 py-0.5 bg-gradient-to-r from-yellow-300 to-amber-300 text-slate-950 font-bold text-[11px] rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <span>🎀</span>
                  <span>Ada Surat Spesial</span>
                </div>

                <Gift className="w-16 h-16 md:w-20 md:h-20 text-yellow-300 group-hover:rotate-6 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.5)]" />

                <div className="mt-3 flex items-center gap-1.5 text-xs text-sky-200 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Ketuk untuk Buka 🩵</span>
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-sky-300 font-semibold flex items-center justify-center gap-1.5">
                <span>⭐</span>
                <span>Sebuah Ucapan Hangat Untuk</span>
                <span>⭐</span>
              </p>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-wide">
                {data.recipientFullName}
              </h1>
              {data.senderName && (
                <p className="text-sm text-sky-300/90 font-medium">
                  Dari: <span className="text-yellow-300 font-semibold">{data.senderName}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleOpenGift}
              className="mt-8 px-8 py-3.5 bg-gradient-to-r from-sky-400 via-sky-300 to-yellow-300 hover:from-sky-300 hover:to-yellow-200 text-slate-950 font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-sky-400/20 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Buka Kartu Ucapan Spesial 🎀✨</span>
            </button>
            <p className="text-[11px] text-sky-400/80 mt-3">
              Ketuk untuk melihat kejutan kembang api, melodi & untaian doa
            </p>
          </div>
        ) : (
          /* ==========================================================
             OPENED STATE: DREAMY SKY BLUE & BUTTER YELLOW CELEBRATION CARD
             ========================================================== */
          <div className="w-full space-y-8 animate-fade-in">
            {/* The Cute & Elegant Card */}
            <article className="w-full rounded-3xl bg-gradient-to-b from-[#0a1e42] via-[#06142c] to-[#040e20] border-2 border-sky-400/35 p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl">
              {/* Inner Decorative Butter Yellow Hairline */}
              <div className="absolute inset-2 sm:inset-3 border border-yellow-300/25 rounded-[22px] pointer-events-none" />

              {/* Cute Corner Stars */}
              <div className="absolute top-4 left-4 text-yellow-300 text-xs sm:text-sm pointer-events-none">✨</div>
              <div className="absolute top-4 right-4 text-sky-300 text-xs sm:text-sm pointer-events-none">⭐</div>
              <div className="absolute bottom-4 left-4 text-sky-300 text-xs sm:text-sm pointer-events-none">⭐</div>
              <div className="absolute bottom-4 right-4 text-yellow-300 text-xs sm:text-sm pointer-events-none">✨</div>

              {/* Header Badges & Celebration Date */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-5 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 text-xs">🎀</span>
                  <span className="text-xs uppercase tracking-widest text-sky-300 font-bold">
                    Special Birthday Celebration
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-sky-200">
                  <Calendar className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{data.celebrationDate}</span>
                  {data.age && (
                    <>
                      <span>·</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-yellow-300/15 text-yellow-300 font-bold border border-yellow-300/30">
                        Usia ke-{data.age} ⭐
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Photo & Recipient Headline */}
              <div className="relative z-10 text-center space-y-4 mb-8">
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-2xl mx-auto mb-6">
                    {photos.map((photo, index) => (
                      <div
                        key={`${photo}-${index}`}
                        className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl p-[3px] bg-gradient-to-br from-sky-400 via-yellow-200 to-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.18)]"
                      >
                        <div className="w-full h-full rounded-[calc(1rem-3px)] sm:rounded-[calc(1.5rem-3px)] overflow-hidden bg-[#06142c]">
                          <img
                            src={photo}
                            alt={`${data.recipientFullName} - foto ${index + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        {index === (photos.length > 1 ? 1 : 0) && (
                          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 text-slate-950 font-bold text-[9px] sm:text-xs px-2.5 sm:px-3.5 py-1 rounded-full shadow-lg border-2 border-[#06142c] flex items-center gap-1 select-none z-10">
                            <span>🎀</span>
                            <span>Sweet {data.age}</span>
                            <span>✨</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-xs md:text-sm uppercase tracking-widest text-sky-300 font-semibold flex items-center justify-center gap-1.5">
                    <span>✨</span>
                    <span>Selamat Ulang Tahun Untuk</span>
                    <span>✨</span>
                  </p>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight bg-gradient-to-r from-sky-100 via-yellow-200 to-sky-200 bg-clip-text text-transparent">
                    {data.recipientFullName}
                  </h1>
                  {data.recipientNickname && data.recipientNickname !== data.recipientFullName && (
                    <p className="text-sm sm:text-base text-yellow-300/90 font-medium">
                      ({data.recipientNickname} 🩵)
                    </p>
                  )}
                </div>
              </div>

              {/* Primary Message Title & Prose */}
              <div className="relative z-10 my-8 px-5 sm:px-8 py-6 rounded-2xl bg-sky-950/40 border border-sky-400/30">
                <div className="absolute -top-3.5 left-6 px-3 py-0.5 bg-slate-900 border border-yellow-300/40 rounded-md text-[11px] font-bold text-yellow-300 flex items-center gap-1">
                  <span>🤍</span>
                  <span>Untaian Doa & Harapan</span>
                </div>

                <h2 className="text-lg sm:text-xl font-serif font-bold text-yellow-200 mb-4 mt-1">
                  {data.messageTitle}
                </h2>

                <p className="text-sm sm:text-base leading-relaxed text-slate-100 whitespace-pre-line font-normal">
                  {data.messageBody}
                </p>
              </div>

              {/* Special Wishes Bullet Points */}
              {data.specialWishes && data.specialWishes.length > 0 && (
                <div className="relative z-10 my-8 space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-300/40" />
                    <h3 className="text-xs uppercase tracking-wider text-sky-300 font-bold">
                      Doa Khusus Hari Bahagiamu:
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {data.specialWishes.map((wish, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#091a38]/80 border border-sky-500/25 hover:border-yellow-300/40 transition-all flex items-start gap-3 shadow-xs"
                      >
                        <span className="w-6 h-6 rounded-full bg-yellow-300/15 text-yellow-300 flex items-center justify-center shrink-0 text-xs mt-0.5 font-bold border border-yellow-300/30">
                          ★
                        </span>
                        <span className="text-xs sm:text-sm text-sky-100 font-medium leading-snug">
                          {wish}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Cake Section (if enabled) */}
              {data.showCake && (
                <div className="relative z-10 my-10">
                  <InteractiveCake
                    recipientName={data.recipientNickname || data.recipientFullName}
                    age={data.age}
                    onBlownOut={triggerGrandBurst}
                  />
                </div>
              )}

              {/* Elegant Sign-off & Sender */}
              <div className="relative z-10 border-t border-sky-500/25 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-300 to-yellow-300 flex items-center justify-center text-slate-950 font-bold font-serif text-lg shadow-md">
                    {data.senderName.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-xs text-sky-300">Salam hangat & doa tulus dari:</p>
                    <p className="text-base font-serif font-bold text-white tracking-wide">
                      {data.senderName}
                    </p>
                    {data.senderRelation && (
                      <p className="text-xs text-yellow-300 font-medium mt-0.5">
                        {data.senderRelation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-sky-300/90 bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-400/25">
                  <Heart className="w-3.5 h-3.5 text-sky-400 fill-sky-400/50" />
                  <span>Dihangatkan dengan doa & ketulusan</span>
                </div>
              </div>
            </article>

            {/* Quick Actions after Card */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              <button
                onClick={triggerGrandBurst}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-400 via-sky-300 to-yellow-300 hover:from-sky-300 hover:to-yellow-200 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-slate-950" />
                <span>Nyalakan Kembang Api Lagi 🎆</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Gentle Footer */}
      <footer className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-xs text-sky-400/70 pt-8 mt-4 border-t border-sky-950">
        <p>
          Dibuat dengan segenap ketulusan untuk merayakan hari kelahiranmu 🩵✨
        </p>
      </footer>
    </div>
  );
}
