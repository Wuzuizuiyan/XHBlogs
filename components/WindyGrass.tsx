"use client";
import { useMemo } from 'react';
import { useTheme } from './ThemeProvider';
import { mulberry32 } from '../lib/prng';

interface WildBlade { id: number; height: number; width: number; delay: number; duration: number; opacity: number; left: string; isLeftCurve: boolean; }

export default function WindyGrass() {
  // 订阅日夜状态
  const { isDark } = useTheme();

  // 使用确定性随机在 render 期生成，保证 SSR/CSR 一致且避免挂载后额外重渲染
  const blades = useMemo<WildBlade[]>(() => {
    const rand = mulberry32(0x57494e44);
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i, height: 30 + rand() * 50, width: 1 + rand() * 2,
      delay: rand() * -10, duration: 3 + rand() * 4,
      opacity: 0.2 + rand() * 0.4,
      left: `${(i / 150) * 100 + (rand() - 0.5) * 0.5}%`,
      isLeftCurve: rand() > 0.5
    }));
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-10 overflow-hidden transition-colors duration-1000">
      <style>{`@keyframes swayWildGrass { 0% { transform: rotate(-5deg); } 100% { transform: rotate(15deg); } }`}</style>
      {blades.map(blade => (
        <div key={blade.id} className="absolute bottom-0 origin-bottom flex items-end"
             style={{ left: blade.left, height: `${blade.height}px`, width: `${blade.width * 4}px`, opacity: blade.opacity,
             animation: `swayWildGrass ${blade.duration}s ease-in-out infinite alternate`, animationDelay: `${blade.delay}s` }}>
          <div
            // 白天变绿，晚上变白
            className={`w-full h-full transition-all duration-1000 ${isDark ? 'bg-gradient-to-t from-white/80 to-transparent' : 'bg-gradient-to-t from-emerald-500/80 to-transparent'}`}
            style={{ width: `${blade.width}px`, borderRadius: blade.isLeftCurve ? '100% 0 0 100%' : '0 100% 100% 0', transform: blade.isLeftCurve ? 'translateX(50%)' : 'translateX(-50%)' }}
          ></div>
        </div>
      ))}
    </div>
  );
}