"use client";

import Link from 'next/link';

type EntranceVariant = 'note' | 'film' | 'draft';

interface EntranceProps {
  title: string;
  description: string;
  href: string;
  variant: EntranceVariant;
  image?: string;
  chatters?: Array<{ title: string; formattedDate?: string }>;
}

const variantStyles: Record<EntranceVariant, string> = {
  note: 'from-[#fffaf0]/85 to-[#f3e5cc]/65 !border-white/80',
  film: 'from-[#fffaf0]/85 to-[#efe0c5]/65 !border-white/80',
  draft: 'from-[#fffaf0]/85 to-[#f2e7d3]/65 !border-white/80',
};

function EntranceCard({ title, description, href, variant, image, chatters }: EntranceProps) {
  return (
    <Link
      href={href}
      className={`group relative rounded-2xl bg-gradient-to-br ${variantStyles[variant]} backdrop-blur-md border shadow-[0_14px_34px_rgba(133,101,59,0.14)] overflow-hidden transition-all duration-700 hover:-translate-y-0.5 min-h-[180px] sm:min-h-[190px] flex flex-col`}
    >
      {image && (
        <>
          <div className="absolute inset-x-4 top-11 bottom-12 rounded-sm border-[8px] border-white/75 dark:border-slate-700/70 shadow-inner overflow-hidden">
            <img src={image} alt="" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 sepia-[0.16]" />
          </div>
        </>
      )}

      {/* 胶片齿孔 */}
      {variant === 'film' && (
        <div className="absolute left-5 right-5 top-8 flex justify-around opacity-50 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-[2px] bg-stone-500/35" />
          ))}
        </div>
      )}

      {/* 草稿线框 */}
      {variant === 'draft' && (
        <>
          <div className="absolute inset-4 border border-dashed border-stone-400/35 dark:border-stone-500/30 rounded-2xl pointer-events-none" />
          <div className="absolute right-5 top-12 h-20 w-28 opacity-35 pointer-events-none">
            <div className="absolute left-2 top-9 h-8 w-16 border border-stone-600/60 rounded-sm" />
            <div className="absolute left-9 top-3 h-10 w-10 border border-stone-600/60 rounded-full" />
            <div className="absolute right-1 top-0 h-px w-16 bg-stone-600/60 rotate-[-18deg]" />
            <div className="absolute right-0 bottom-4 h-px w-20 bg-stone-600/60 rotate-[13deg]" />
          </div>
        </>
      )}

      {/* 便签折角 */}
      {variant === 'note' && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-5 bg-[repeating-linear-gradient(to_bottom,rgba(120,93,58,0.16)_0,rgba(120,93,58,0.16)_1px,transparent_1px,transparent_18px)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-amber-300/50 border-l-[24px] border-l-transparent pointer-events-none" />
          <div className="absolute top-[-8px] left-1/2 h-5 w-24 -translate-x-1/2 rotate-[-3deg] bg-amber-200/55 border border-amber-300/35 shadow-sm" />
        </>
      )}

      <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-lg sm:text-xl font-bold !text-stone-800">
          {title}
          </h3>
          <span className="text-[10px] font-bold !text-stone-500">更多 →</span>
        </div>

        {variant === 'note' && chatters && chatters.length > 0 ? (
          <ul className="space-y-2.5 text-xs sm:text-sm !text-stone-600">
            {chatters.map((item) => (
              <li key={item.title} className="flex items-center gap-2 border-b border-stone-200/60 dark:border-white/10 pb-2 last:border-b-0">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500/70" />
                <span className="line-clamp-1 flex-1">{item.title}</span>
                {item.formattedDate && <span className="text-[10px] text-stone-400 font-mono">{item.formattedDate.slice(5, 10)}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs sm:text-sm line-clamp-2 !text-stone-600 mt-auto">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function ArchiveEntranceCard({
  photoCover,
  chatterDescription,
  chatters,
}: {
  photoCover?: string;
  chatterDescription?: string;
  chatters?: Array<{ title: string; formattedDate?: string }>;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
      <EntranceCard
        title="雾中碎语"
        description={chatterDescription || "碎片思绪，雾里拾零"}
        href="/moments"
        variant="note"
        chatters={chatters}
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
