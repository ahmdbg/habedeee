import { useState } from 'react';
import { FireworksCanvas } from './components/FireworksCanvas';
import { CelebrationCard } from './components/CelebrationCard';
import { CountdownLock } from './components/CountdownLock';
import { BIRTHDAY_DATA } from './config/birthdayData';

export default function App() {
  const targetTime = new Date(BIRTHDAY_DATA.unlockTargetTime).getTime();

  // Check if target time (15 Oktober 2026, 20:00 WIB) has arrived or if bypass was requested via URL
  const checkInitialUnlock = (): boolean => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      if (search.get('preview') === 'true' || search.has('bypass')) {
        return true;
      }
    }
    return Date.now() >= targetTime;
  };

  const [isUnlocked, setIsUnlocked] = useState<boolean>(checkInitialUnlock);

  return (
    <div className="relative min-h-screen w-full bg-[#030914] text-slate-100 overflow-x-hidden select-text">
      {/* Background Interactive Fireworks Canvas (active when unlocked) */}
      <FireworksCanvas
        active={isUnlocked && BIRTHDAY_DATA.showFireworks}
        soundEnabled={true}
      />

      {/* Display Countdown Lock before 15 Oktober 2026 20.00 WIB, or Celebration Card once unlocked */}
      {!isUnlocked ? (
        <CountdownLock
          onUnlock={() => setIsUnlocked(true)}
          onPreviewBypass={() => setIsUnlocked(true)}
        />
      ) : (
        <CelebrationCard
          onShowCountdown={() => setIsUnlocked(false)}
        />
      )}
    </div>
  );
}
