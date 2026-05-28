"use client";

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  twinkleDuration: number;
  twinkleDelay: number;
}

export default function Stars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generated: Star[] = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2.5,
      twinkleDuration: 1.5 + Math.random() * 3,
      twinkleDelay: Math.random() * -5,
    }));
    setStars(generated);
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
