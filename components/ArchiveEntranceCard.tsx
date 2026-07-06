"use client";

import Link from 'next/link';

type EntranceVariant = 'note' | 'film' | 'draft';

interface EntranceProps {
  title: string;
  description: string;
  href: string;
  variant: EntranceVariant;
  image?: string;
}

const variantStyles: Record<EntranceVariant, string> = {
  note: 'from-amber-50/40 to-white/20 dark:from-amber-900/20 dark:to-slate-800/30 border-amber-200/40 dark:border-amber-500/20',
  film: 'from-slate-100/40 to-white/20 dark:from-slate-700/30 dark:to-slate-800/30 border-slate-300/40 dark:border-slate-500/20',
  draft: 'from-stone-50/40 to-white/20 dark:from-stone-800/20 dark:to-slate-800/30 border-stone-300/40 dark:border-stone-500/20',
};

function EntranceCard({ title, description, href, variant, image }: EntranceProps) {
  return (
    <Link
      href={href}
      className={`group relative rounded-3xl bg-gradient-to-br ${variantStyles[variant]} backdrop-blur-md border shadow-xl overflow-hidden transition-all duration-700 hover:scale-[1.02] min-h-[180px] sm:min-h-[200px] flex flex-col justify-end`}
    >
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-40 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </>
      )}

      {/* 胶片齿孔 */}
      {variant === 'film' && (
        <div className="absolute top-0 left-0 right-0 h-4 flex justify-around items-center opacity-30 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-sm bg-white/80" />
          ))}
        </div>
      )}

      {/* 草稿线框 */}
      {variant === 'draft' && (
        <div className="absolute inset-3 border border-dashed border-stone-400/30 dark:border-stone-500/30 rounded-2xl pointer-events-none" />
      )}

      {/* 便签折角 */}
      {variant === 'note' && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-amber-300/50 border-l-[24px] border-l-transparent pointer-events-none" />
      )}

      <div className="relative z-10 p-5 sm:p-6">
        <h3 className={`text-lg sm:text-xl font-bold mb-1 ${image ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          {title}
        </h3>
        <p className={`text-xs sm:text-sm line-clamp-2 ${image ? 'text-white/80' : 'text-slate-600 dark:text-slate-300'}`}>
          {description}
        </p>
      </div>
    </Link>
  );
}

export default function ArchiveEntranceCard({
  photoCover,
  chatterDescription,
}: {
  photoCover?: string;
  chatterDescription?: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
      <EntranceCard
        title="雾中碎语"
        description={chatterDescription || "碎片思绪，雾里拾零"}
        href="/moments"
        variant="note"
      />
      <EntranceCard
        title="途经之景"
        description="相册与光影存档"
        href="/photowall"
        variant="film"
        image={photoCover}
      />
      <EntranceCard
        title="未完成工程"
        description="策划案、代码与进行中的事"
        href="/projects"
        variant="draft"
      />
    </div>
  );
}
