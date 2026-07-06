"use client";

import { siteConfig } from '../siteConfig';

function StatusBar({ label, value, barColor }: { label: string; value: number; barColor: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span className="font-mono text-slate-500 dark:text-slate-400">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/40 dark:bg-slate-700/60 overflow-hidden border border-white/30 dark:border-white/5">
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
    <div className="rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-5 sm:p-6 flex flex-col justify-between h-full min-h-[220px] md:min-h-[280px] relative overflow-hidden transition-all duration-700 hover:scale-[1.01] group">
      {/* 雾感装饰 */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-slate-300/20 dark:bg-slate-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1">
              Archive Status
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              今日存档状态
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 backdrop-blur-sm">
            {status.lastSaveLabel}
          </span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <StatusBar label="雾浓度" value={status.mistLevel} barColor="bg-slate-400 dark:bg-slate-500" />
          <StatusBar label="待办堆积" value={status.backlogLevel} barColor="bg-amber-500 dark:bg-amber-400" />
        </div>
      </div>

      <div className="relative z-10 mt-5 pt-4 border-t border-white/30 dark:border-white/10 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/30 dark:bg-slate-700/30 px-3 py-2.5 border border-white/30 dark:border-white/5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">写作心境</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{status.writingMood}</p>
        </div>
        <div className="rounded-xl bg-white/30 dark:bg-slate-700/30 px-3 py-2.5 border border-white/30 dark:border-white/5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">值班猫</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{status.catStatus}</p>
        </div>
      </div>
    </div>
  );
}
