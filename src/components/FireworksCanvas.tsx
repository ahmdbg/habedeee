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
}

interface Rocket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  type: 'willow' | 'peony';
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
  const isMobileRef = useRef<boolean>(false);

  const colors = [
    '#38bdf8', // sky blue
    '#7dd3fc', // baby blue
    '#bae6fd', // soft pastel blue
    '#fde047', // soft butter yellow
    '#fef08a', // pale pastel yellow
    '#facc15', // warm star yellow
    '#ffffff', // starlight white
    '#e0f2fe', // ice sky blue
  ];

  const createExplosion = useCallback((x: number, y: number, color: string, type: 'willow' | 'peony') => {
    if (soundEnabled) {
      audioEngine.playFireworkPop(0.85 + Math.random() * 0.35);
    }

    const isMobile = isMobileRef.current;
    const maxParticles = isMobile ? 65 : 150;

    // Cull old particles if approaching limit to guarantee 60fps on mobile
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current.splice(0, particlesRef.current.length - maxParticles);
    }

    const count = isMobile ? 22 : (type === 'willow' ? 55 : 45);
    const isGoldWillow = type === 'willow';

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = isGoldWillow ? 2.5 + Math.random() * 3.5 : 3.5 + Math.random() * 4.5;

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: isGoldWillow ? 0.012 + Math.random() * 0.01 : 0.018 + Math.random() * 0.015,
        color: isGoldWillow ? (Math.random() > 0.4 ? '#fde047' : '#f59e0b') : color,
        size: isMobile ? 2 : 2.5,
        gravity: isGoldWillow ? 0.05 : 0.07,
      });
    }
  }, [soundEnabled]);

  const launchRocket = useCallback((targetX: number, targetY: number) => {
    if (!canvasRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const startX = targetX + (Math.random() - 0.5) * (width * 0.2);
    const startY = height;
    const dy = targetY - startY;
    const dx = targetX - startX;
    const distance = Math.hypot(dx, dy) || 1;
    const speed = isMobileRef.current ? 10 + Math.random() * 3 : 13 + Math.random() * 4;

    rocketsRef.current.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.5 ? 'willow' : 'peony',
    });
  }, [colors]);

  // Click / touch to launch interactive firework
  const handleCanvasInteraction = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    launchRocket(x, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Detect mobile
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    };
    checkMobile();

    const handleResize = () => {
      checkMobile();
      // Cap scale on high DPI mobile to reduce GPU fill rate
      const dpr = Math.min(window.devicePixelRatio || 1, isMobileRef.current ? 1 : 1.25);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial background clear
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    let isDocumentVisible = true;
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = (time: number) => {
      if (!isDocumentVisible || !active) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Fast, lightweight motion trail clear (no expensive globalCompositeOperation swapping)
      ctx.fillStyle = 'rgba(2, 6, 23, 0.22)';
      ctx.fillRect(0, 0, screenWidth, screenHeight);

      // Auto launch firework periodically
      const launchInterval = isMobileRef.current ? 3200 : 2000;
      if (time - lastAutoLaunchRef.current > launchInterval) {
        lastAutoLaunchRef.current = time + (Math.random() * 800 - 400);
        const randomX = screenWidth * 0.15 + Math.random() * (screenWidth * 0.7);
        const randomY = screenHeight * 0.1 + Math.random() * (screenHeight * 0.35);
        launchRocket(randomX, randomY);
      }

      // Update & draw rockets (simple fast stroke, no shadowBlur)
      ctx.lineWidth = 2.5;
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        const prevX = r.x;
        const prevY = r.y;

        r.x += r.vx;
        r.y += r.vy;

        // Draw streamlined rocket streak
        ctx.strokeStyle = r.color;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();

        // Check target altitude
        if (r.y <= r.targetY || r.vy >= 0) {
          createExplosion(r.x, r.y, r.color, r.type);
          rocketsRef.current.splice(i, 1);
        }
      }

      // Update & draw particles using GPU-friendly streak rendering
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        const oldX = p.x;
        const oldY = p.y;

        p.vx *= 0.95;
        p.vy *= 0.95;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Streak lines render 50x faster than multiple arc() paths and create realistic spark trails
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(oldX, oldY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, createExplosion, launchRocket]);

  return (
    <canvas
      ref={canvasRef}
      onClick={(e) => handleCanvasInteraction(e.clientX, e.clientY)}
      title="Klik di mana saja untuk menembakkan kembang api!"
      className="fixed inset-0 w-full h-full pointer-events-auto z-0 cursor-crosshair"
      style={{ touchAction: 'pan-y' }}
    />
  );
}
