import { useEffect, useRef, useCallback } from 'react';
import { audioEngine } from '../utils/audio';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  gravity: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

interface Rocket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  exploded: boolean;
  type: 'willow' | 'peony' | 'sparkler';
}

interface FireworksCanvasProps {
  active?: boolean;
  soundEnabled?: boolean;
}

export function FireworksCanvas({ active = true, soundEnabled = true }: FireworksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const lastAutoLaunchRef = useRef<number>(0);

  const colors = [
    '#f59e0b', // amber gold
    '#fbbf24', // yellow gold
    '#ec4899', // rose pink
    '#a855f7', // purple royal
    '#38bdf8', // sky cyan
    '#34d399', // emerald
    '#f43f5e', // ruby
    '#ffffff', // diamond white
  ];

  const createExplosion = useCallback((x: number, y: number, color: string, type: 'willow' | 'peony' | 'sparkler') => {
    if (soundEnabled) {
      audioEngine.playFireworkPop(0.8 + Math.random() * 0.4);
    }

    const count = type === 'willow' ? 80 : 65;
    const isGoldWillow = type === 'willow';

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = isGoldWillow ? 2.5 + Math.random() * 4.5 : 3.5 + Math.random() * 5.5;

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: isGoldWillow ? 0.009 + Math.random() * 0.008 : 0.015 + Math.random() * 0.015,
        color: isGoldWillow ? (Math.random() > 0.3 ? '#fef08a' : '#d97706') : color,
        size: isGoldWillow ? 2.5 : 2 + Math.random() * 2,
        gravity: isGoldWillow ? 0.045 : 0.065,
        trail: [],
      });
    }
  }, [soundEnabled]);

  const launchRocket = useCallback((targetX: number, targetY: number) => {
    if (!canvasRef.current) return;
    const startX = targetX + (Math.random() - 0.5) * 150;
    const startY = canvasRef.current.height;
    const dy = targetY - startY;
    const dx = targetX - startX;
    const distance = Math.hypot(dx, dy);
    const speed = 12 + Math.random() * 4;
    const types: Array<'willow' | 'peony' | 'sparkler'> = ['willow', 'peony', 'peony', 'sparkler'];

    rocketsRef.current.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      exploded: false,
      type: types[Math.floor(Math.random() * types.length)],
    });
  }, [colors]);

  // Click anywhere to launch interactive firework
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    launchRocket(x, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      if (!ctx || !canvas) return;

      // Dark translucent clearing for motion trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      // Auto launch fireworks periodically if active
      if (active && time - lastAutoLaunchRef.current > 1800) {
        lastAutoLaunchRef.current = time + (Math.random() * 1200 - 400);
        const randomX = canvas.width * 0.15 + Math.random() * (canvas.width * 0.7);
        const randomY = canvas.height * 0.12 + Math.random() * (canvas.height * 0.38);
        launchRocket(randomX, randomY);
      }

      // Update & draw rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.x += r.vx;
        r.y += r.vy;

        // Draw rocket glowing head
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Spark tail
        ctx.beginPath();
        ctx.arc(r.x - r.vx * 0.8, r.y - r.vy * 0.8, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        // Check if rocket reached altitude
        if (r.y <= r.targetY || r.vy >= 0) {
          createExplosion(r.x, r.y, r.color, r.type);
          rocketsRef.current.splice(i, 1);
        }
      }

      // Update & draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        // Store trail history
        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
        if (p.trail.length > 5) {
          p.trail.shift();
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Render trail
        for (let t = 0; t < p.trail.length; t++) {
          const pt = p.trail[t];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * (0.3 + (t / p.trail.length) * 0.7), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, pt.alpha * (t / p.trail.length) * 0.6);
          ctx.fill();
        }

        // Render core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, createExplosion, launchRocket]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      title="Klik di mana saja untuk menembakkan kembang api!"
      className="fixed inset-0 pointer-events-auto z-0 cursor-crosshair"
      style={{ touchAction: 'none' }}
    />
  );
}
