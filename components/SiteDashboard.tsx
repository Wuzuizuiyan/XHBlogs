"use client";

import { useEffect, useState } from 'react';
import { siteConfig } from '../siteConfig';

export default function SiteDashboard() {
  const [timeStr, setTimeStr] = useState('');
  const [uptimeStr, setUptimeStr] = useState('');

  const START_DATE = new Date(siteConfig.buildDate || '2026-03-23T00:00:00').getTime();
  const hasIcp = Boolean(siteConfig.icpConfig?.name && siteConfig.icpConfig?.link);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      const diff = now.getTime() - START_DATE;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      setUptimeStr(`${days}天 ${hours}小时`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [START_DATE]);

  return (
    <div className="rounded-2xl !bg-white/55 backdrop-blur-md border !border-white/70 shadow-[0_10px_28px_rgba(122,91,54,0.13)] overflow-hidden flex items-stretch transition-colors duration-700 h-full min-h-[58px] group">

      <div className="bg-stone-900 dark:bg-black text-white px-4 sm:px-5 py-3 flex items-center justify-center font-mono text-lg sm:text-xl font-black tracking-widest shadow-inner relative overflow-hidden group-hover:text-amber-300 transition-colors rounded-l-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        {timeStr || '00:00:00'}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-black/50" />
      </div>

      <div className="flex-1 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold !text-stone-600">

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
          <span>存档点状态：<span className="text-amber-700 dark:text-amber-400 font-black">{uptimeStr}</span></span>
        </div>

        <div className="hidden sm:flex gap-2 flex-wrap">
          {siteConfig.footerBadges?.map((badge, index) => (
            <span
              key={index}
              className="px-2 py-1 !bg-white/45 rounded-md shadow-sm flex items-center gap-1 border border-stone-200/70"
            >
              <svg className={`w-3.5 h-3.5 ${badge.color}`} fill="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: badge.svg }} />
              {badge.name}
            </span>
          ))}
        </div>

        {hasIcp && (
          <a
            href={siteConfig.icpConfig.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors border-b border-dashed border-slate-400 dark:border-slate-500 pb-0.5"
          >
            {siteConfig.icpConfig.name}
          </a>
        )}

      </div>
    </div>
  );
}
