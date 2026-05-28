"use client";
import { useTheme } from './ThemeProvider';
import Stars from './Stars';
import SunriseParticles from './SunriseParticles';
import WindyGrass from './WindyGrass';

export default function BackgroundEffects() {
  const { isDark } = useTheme();

  return (
    <>
      {/* 核心魔法：根据 isDark 切换特效组件 */}
      <div className={`transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <Stars />
      </div>
      <div className={`transition-opacity duration-1000 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <SunriseParticles />
      </div>

      {/* 草地一直存在，但它内部会自动改变颜色 */}
      <WindyGrass />
    </>
  );
}