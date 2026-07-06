"use client";

import { useMemo } from 'react';
import { mulberry32 } from '../lib/prng';

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  twinkleDuration: number;
  twinkleDelay: number;
}

export default function Stars() {
  // 使用确定性随机在 render 期生成，保证 SSR/CSR 一致且避免挂载后额外重渲染
  const stars = useMemo<Star[]>(() => {
    const rand = mulberry32(0x57415253);
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${rand() * 100}%`,
      left: `${rand() * 100}%`,
      size: 1 + rand() * 2.5,
      twinkleDuration: 1.5 + rand() * 3,
      twinkleDelay: rand() * -5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>

      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'rgba(255, 255, 240, 0.9)',
            boxShadow: '0 0 4px 1px rgba(255, 255, 200, 0.6)',
            animation: `starTwinkle ${star.twinkleDuration}s ease-in-out infinite`,
            animationDelay: `${star.twinkleDelay}s`,
          }}
        ></div>
      ))}
    </div>
  );
}
