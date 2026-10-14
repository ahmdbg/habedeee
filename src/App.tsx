import { FireworksCanvas } from './components/FireworksCanvas';
import { CelebrationCard } from './components/CelebrationCard';
import { BIRTHDAY_DATA } from './config/birthdayData';

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#030914] text-slate-100 overflow-x-hidden select-text">
      {/* Background Interactive Fireworks Canvas (Sky Blue & Butter Yellow) */}
      <FireworksCanvas
        active={BIRTHDAY_DATA.showFireworks}
        soundEnabled={true}
      />

      {/* Primary Birthday Celebration Card */}
      <CelebrationCard />
    </div>
  );
}
