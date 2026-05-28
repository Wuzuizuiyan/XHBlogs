"use client";

import { useEffect, useState } from 'react';

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
  const [particles, setParticles] = useState<LightParticle[]>([]);

  useEffect(() => {
    const generated: LightParticle[] = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 5,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * -18,
      drift: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(generated);
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
