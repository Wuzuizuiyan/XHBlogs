import { siteConfig } from '../siteConfig';

export default function InspirationDropCard() {
  const drops = siteConfig.inspirationDrops ?? [];

  if (drops.length === 0) return null;

  const index = Math.max(0, Math.min(drops.length - 1, siteConfig.inspirationFeaturedIndex ?? 0));
  const text = drops[index];

  return (
    <div className="rounded-3xl !bg-[#fffaf0]/78 backdrop-blur-md border !border-white/80 shadow-[0_18px_45px_rgba(133,101,59,0.16)] p-5 sm:p-6 h-full min-h-[230px] flex flex-col relative overflow-hidden transition-all duration-700 hover:-translate-y-0.5 group">
      {/* 便签贴纸感 */}
      <div className="absolute top-3 left-1/2 w-16 h-5 bg-amber-200/70 dark:bg-amber-400/25 rounded-sm rotate-3 shadow-sm border border-amber-300/40 dark:border-amber-500/20" />
      <div className="absolute right-5 top-5 text-4xl opacity-20 rotate-12 pointer-events-none">⌕</div>

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-bold !text-stone-800 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
            灵感掉落
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <blockquote className="relative w-full rounded-2xl !bg-[#f7ecd7]/80 border border-stone-200/70 px-5 py-6 shadow-inner">
            <div className="absolute inset-x-5 top-0 bottom-0 pointer-events-none bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,rgba(120,93,58,0.12)_28px)]" />
            <p className="relative text-sm sm:text-base leading-loose !text-stone-700 font-medium text-center">
              「{text}」
            </p>
          </blockquote>
        </div>

        <p className="text-[10px] !text-stone-500 mt-4 font-mono">
          #{String(index + 1).padStart(2, '0')} / {drops.length} · 每日一签
        </p>
      </div>

      {/* 暖雾底色 */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 via-transparent to-orange-50/10 dark:from-amber-900/10 dark:to-transparent pointer-events-none" />
    </div>
  );
}
