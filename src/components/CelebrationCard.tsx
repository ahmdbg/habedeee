import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Gift,
  Share2,
  Settings,
  Heart,
  Calendar,
  Check,
} from 'lucide-react';
import { BirthdayConfig } from '../types/birthday';
import { InteractiveCake } from './InteractiveCake';
import { audioEngine } from '../utils/audio';
import { generateShareableUrl } from '../utils/storage';

interface CelebrationCardProps {
  config: BirthdayConfig;
  onNavigateToAdmin: () => void;
}

export function CelebrationCard({ config, onNavigateToAdmin }: CelebrationCardProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Trigger grand celebration burst
  const triggerGrandBurst = () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#ec4899', '#6366f1', '#10b981'],
    });
    audioEngine.playFireworkPop(1.1);
  };

  const handleOpenGift = () => {
    setIsOpened(true);
    triggerGrandBurst();
    if (config.musicAutoPlay) {
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

  const handleCopyLink = () => {
    const url = generateShareableUrl(config);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Autoplay music if allowed on initial user interaction
  useEffect(() => {
    return () => {
      audioEngine.stopMelody();
    };
  }, []);

  // Theme styling configurations
  const themeStyles = {
    gold: {
      accentText: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      borderGlow: 'border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]',
      gradientCard: 'from-slate-900/90 via-slate-950/95 to-amber-950/20',
      taglineGlow: 'text-amber-200/90',
      highlightDot: 'bg-amber-400',
    },
    midnight: {
      accentText: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
      borderGlow: 'border-sky-500/30 shadow-[0_0_50px_rgba(56,189,248,0.15)]',
      gradientCard: 'from-slate-900/90 via-slate-950/95 to-indigo-950/25',
      taglineGlow: 'text-sky-200/90',
      highlightDot: 'bg-sky-400',
    },
    rosegold: {
      accentText: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      borderGlow: 'border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)]',
      gradientCard: 'from-slate-900/90 via-slate-950/95 to-rose-950/25',
      taglineGlow: 'text-rose-200/90',
      highlightDot: 'bg-rose-400',
    },
    sapphire: {
      accentText: 'text-blue-400',
      badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      borderGlow: 'border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)]',
      gradientCard: 'from-slate-900/90 via-slate-950/95 to-blue-950/25',
      taglineGlow: 'text-blue-200/90',
      highlightDot: 'bg-blue-400',
    },
    emerald: {
      accentText: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      borderGlow: 'border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]',
      gradientCard: 'from-slate-900/90 via-slate-950/95 to-emerald-950/25',
      taglineGlow: 'text-emerald-200/90',
      highlightDot: 'bg-emerald-400',
    },
  }[config.theme] || {
    accentText: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    borderGlow: 'border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]',
    gradientCard: 'from-slate-900/90 via-slate-950/95 to-amber-950/20',
    taglineGlow: 'text-amber-200/90',
    highlightDot: 'bg-amber-400',
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-8 md:py-12 z-10">
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between gap-4 py-2 px-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-serif tracking-wide text-xs md:text-sm">
            Kartu Ucapan Ulang Tahun
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Music melody button */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              isMusicPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
            title="Putar instrumen melodi ulang tahun"
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Melodi Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Putar Melodi</span>
              </>
            )}
          </button>

          {/* Fireworks burst button */}
          <button
            onClick={triggerGrandBurst}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700/60 transition-all cursor-pointer"
            title="Tembakkan kembang api"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kembang Api</span>
          </button>

          {/* Share link button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
            title="Salin tautan kartu ini"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bagikan</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center">
        {!isOpened ? (
          /* ==========================================================
             UNOPENED ENVELOPE / GIFT BOX STATE
             ========================================================== */
          <div className="w-full max-w-md mx-auto text-center flex flex-col items-center animate-fade-in">
            {/* Glowing Aura */}
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-600/20 rounded-full blur-2xl animate-pulse" />

              {/* Gift Presentation Icon / Box */}
              <button
                onClick={handleOpenGift}
                className="relative group w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-gradient-to-br from-amber-900/40 via-slate-900 to-amber-950/60 border-2 border-amber-400/40 p-6 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="absolute -top-3 px-3 py-0.5 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-full uppercase tracking-wider shadow-md">
                  Pesan Spesial
                </div>

                <Gift className="w-16 h-16 md:w-20 md:h-20 text-amber-300 group-hover:rotate-6 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />

                <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-200 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Buka Kartu</span>
                </div>
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-amber-400/90 font-medium">
                Sebuah Ucapan Hangat Untuk
              </p>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-wide">
                {config.recipientName}
              </h1>
              {config.senderName && (
                <p className="text-sm text-slate-400">
                  Dari: <span className="text-amber-300 font-medium">{config.senderName}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleOpenGift}
              className="mt-8 px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold text-base rounded-xl shadow-xl shadow-amber-500/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Buka Kartu Ucapan Penuh Cinta</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-3">
              Ketuk tombol untuk melihat kejutan kembang api & pesan ucapan
            </p>
          </div>
        ) : (
          /* ==========================================================
             OPENED LUXURIOUS BIRTHDAY CARD
             ========================================================== */
          <div className="w-full space-y-8 animate-fade-in">
            {/* The Luxury Card */}
            <article
              className={`w-full rounded-3xl bg-gradient-to-b ${themeStyles.gradientCard} border ${themeStyles.borderGlow} backdrop-blur-xl p-6 sm:p-10 md:p-12 relative overflow-hidden`}
            >
              {/* Subtle Corner Ornaments */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400/30 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/30 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400/30 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400/30 rounded-br-xl pointer-events-none" />

              {/* Header Badges & Celebration Date */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-6 mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                    Hari Istimewa Bertambah Usia
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{config.celebrationDate || 'Hari Spesial'}</span>
                  {config.age && (
                    <>
                      <span>·</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                        Usia ke-{config.age}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Photo & Recipient Headline */}
              <div className="text-center space-y-4 mb-8">
                {config.photoUrl && (
                  <div className="relative inline-block mb-2">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 shadow-xl mx-auto">
                      <img
                        src={config.photoUrl}
                        alt={config.recipientName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          // Hide on load error
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-xs md:text-sm uppercase tracking-widest text-amber-400/90 font-medium">
                    Selamat Ulang Tahun Untuk
                  </p>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight shimmer-gold">
                    {config.recipientName}
                  </h1>
                  {config.recipientNickname && config.recipientNickname !== config.recipientName && (
                    <p className="text-sm text-slate-400 italic">
                      ({config.recipientNickname})
                    </p>
                  )}
                </div>
              </div>

              {/* Primary Message Title & Prose */}
              <div className="relative my-8 px-4 sm:px-8 py-6 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                <div className="absolute -top-3.5 left-6 px-3 py-0.5 bg-slate-900 border border-amber-500/30 rounded-md text-[11px] font-semibold text-amber-300">
                  ✨ Doa & Harapan
                </div>

                <h2 className="text-lg sm:text-xl font-serif font-semibold text-amber-200 mb-4 mt-1">
                  {config.messageTitle}
                </h2>

                <p className="text-sm sm:text-base leading-relaxed text-slate-200 whitespace-pre-line font-normal">
                  {config.messageBody}
                </p>
              </div>

              {/* Special Wishes Bullet Points */}
              {config.specialWishes && config.specialWishes.length > 0 && (
                <div className="my-8 space-y-2.5">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-3">
                    Untaian Doa Terbaik Untukmu:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {config.specialWishes.map((wish, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 text-xs mt-0.5 font-bold">
                          ★
                        </span>
                        <span className="text-xs sm:text-sm text-slate-300 leading-snug">
                          {wish}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Cake Section (if enabled) */}
              {config.showCake && (
                <div className="my-10">
                  <InteractiveCake
                    recipientName={config.recipientNickname || config.recipientName}
                    age={config.age}
                    onBlownOut={triggerGrandBurst}
                  />
                </div>
              )}

              {/* Elegant Sign-off & Sender */}
              <div className="border-t border-slate-800/80 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold font-serif text-base shadow-md">
                    {config.senderName.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Salam hangat & doa tulus dari:</p>
                    <p className="text-base font-serif font-bold text-white tracking-wide">
                      {config.senderName}
                    </p>
                    {config.senderRelation && (
                      <p className="text-[11px] text-amber-400/80">
                        {config.senderRelation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/40" />
                  <span>Dihangatkan dengan doa terbaik</span>
                </div>
              </div>
            </article>

            {/* Quick Actions after Card */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              <button
                onClick={triggerGrandBurst}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4 text-slate-950" />
                <span>Nyalakan Kembang Api Lagi 🎆</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-medium text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Link Kartu Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Bagikan Kartu Ini ke Teman</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="w-full max-w-4xl flex items-center justify-between text-xs text-slate-500 pt-8 mt-4 border-t border-slate-900/80">
        <p>Rayakan momen indah penuh suka cita & kembang api</p>

        {/* Link ke Halaman 2 (Admin) */}
        <button
          onClick={onNavigateToAdmin}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-900/80 transition-all cursor-pointer border border-transparent hover:border-slate-800"
          title="Buka panel admin untuk mengatur nama, ucapan, dan pengirim"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Panel Pengaturan (Admin)</span>
        </button>
      </footer>
    </div>
  );
}
