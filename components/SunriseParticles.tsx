"use client";

import { useMemo } from 'react';
import { mulberry32 } from '../lib/prng';

interface LightParticle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
}

const colors = [
  'rgba(252, 228, 214, 0.7)',  // cream
  'rgba(248, 201, 168, 0.7)',  // peach
  'rgba(232, 148, 90, 0.6)',   // warm orange
  'rgba(240, 215, 140, 0.6)',  // gold
  'rgba(255, 220, 180, 0.5)',  // light amber
];

export default function SunriseParticles() {
  // 使用确定性随机在 render 期生成，保证 SSR/CSR 一致且避免挂载后额外重渲染
  const particles = useMemo<LightParticle[]>(() => {
    const rand = mulberry32(0x53554e52);
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${rand() * 100}%`,
      size: 2 + rand() * 5,
      duration: 8 + rand() * 10,
      delay: rand() * -18,
      drift: (rand() - 0.5) * 10,
      color: colors[Math.floor(rand() * colors.length)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      <style>{`
        @keyframes sunriseRise {
          0% { transform: translate(0, 5vh) scale(0.5); opacity: 0; }
          15% { opacity: 0.8; }
          70% { opacity: 0.5; }
          100% { transform: translate(var(--drift), -105vh) scale(1.2); opacity: 0; }
        }
      `}</style>

      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full blur-[1px]"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.size}px ${p.color}`,
            '--drift': `${p.drift}vw`,
            animation: `sunriseRise ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        ></div>
      ))}
    </div>
  );
}
