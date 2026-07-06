"use client";

import { siteConfig } from '../siteConfig';

function StatusBar({ label, value, barColor }: { label: string; value: number; barColor: string }) {
  return (
    <div className="rounded-xl !bg-white/48 border border-stone-200/70 px-3 py-2.5 space-y-1.5 shadow-sm">
      <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold !text-stone-600">
        <span>{label}</span>
        <span className="font-mono !text-stone-500">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full !bg-stone-200/70 overflow-hidden border border-stone-300/40">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

export default function ArchiveStatusCard() {
  const status = siteConfig.archiveStatus;

  return (
    <div className="rounded-3xl !bg-[#fffaf0]/78 backdrop-blur-md border !border-white/80 shadow-[0_18px_45px_rgba(133,101,59,0.16)] p-5 sm:p-6 flex flex-col justify-between h-full min-h-[250px] relative overflow-hidden transition-all duration-700 hover:-translate-y-0.5 group">
      {/* 雾感装饰 */}
      <div className="absolute right-0 top-0 h-16 w-28 border-l border-b border-stone-200/70 bg-[#ead8bc]/35 rotate-0 pointer-events-none" />
      <div className="absolute right-3 top-2 text-[9px] font-mono !text-stone-400 text-center pointer-events-none">
        DATE<br />05 / 26
      </div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-200/25 dark:bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold !text-stone-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
              今日存档状态
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold !bg-white/55 !text-stone-500 border border-stone-200/70 backdrop-blur-sm">
            {status.lastSaveLabel}
          </span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <StatusBar label="雾浓度" value={status.mistLevel} barColor="bg-amber-600 dark:bg-amber-400" />
          <StatusBar label="写作欲" value={status.backlogLevel} barColor="bg-stone-500 dark:bg-stone-300" />
        </div>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl !bg-white/48 px-3 py-2.5 border border-stone-200/70">
          <p className="text-[9px] font-bold uppercase tracking-widest !text-stone-500 mb-0.5">写作心境</p>
          <p className="text-sm font-bold !text-stone-800 truncate">{status.writingMood}</p>
        </div>
        <div className="rounded-xl !bg-white/48 px-3 py-2.5 border border-stone-200/70">
          <p className="text-[9px] font-bold uppercase tracking-widest !text-stone-500 mb-0.5">煤球状态</p>
          <p className="text-sm font-bold !text-stone-800 truncate">{status.catStatus}</p>
        </div>
      </div>
    </div>
  );
}
