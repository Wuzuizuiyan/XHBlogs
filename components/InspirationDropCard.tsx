import { siteConfig } from '../siteConfig';

export default function InspirationDropCard() {
  const drops = siteConfig.inspirationDrops ?? [];

  if (drops.length === 0) return null;

  const index = Math.max(0, Math.min(drops.length - 1, siteConfig.inspirationFeaturedIndex ?? 0));
  const text = drops[index];

  return (
    <div className="rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-5 sm:p-6 h-full min-h-[280px] sm:min-h-[320px] flex flex-col relative overflow-hidden transition-all duration-700 hover:scale-[1.01] group">
      {/* 便签贴纸感 */}
      <div className="absolute top-3 right-5 w-10 h-3 bg-amber-200/60 dark:bg-amber-400/30 rounded-sm rotate-3 shadow-sm border border-amber-300/40 dark:border-amber-500/20" />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-amber-700/70 dark:text-amber-300/70 mb-1">
            Inspiration Drop
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-amber-600 dark:text-amber-400">✦</span>
            灵感掉落
          </h2>
        </div>

        <div className="flex-1 flex items-center">
          <blockquote className="relative pl-4 border-l-2 border-amber-400/50 dark:border-amber-500/40">
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200 font-medium italic">
              「{text}」
            </p>
          </blockquote>
        </div>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-4 font-mono">
          #{String(index + 1).padStart(2, '0')} / {drops.length} · 每日一签
        </p>
      </div>

      {/* 暖雾底色 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-orange-50/10 dark:from-amber-900/10 dark:to-transparent pointer-events-none" />
    </div>
  );
}
