"use client";

import { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import { Trees } from 'lucide-react';
import { siteConfig } from '../../siteConfig'; // 🌟 引入站点配置

import AlchemyLab from './AlchemyLab';

export default function CreativeWorkshopClient({ posts = [], chatters = [], moments = [] }: any) {

  // =========================================================
  // 🌟 [现实主义] 饱和渐近经验升级系统 (无限等级，难度封顶)
  // =========================================================
  useEffect(() => {
    // 🌟 拦截开关：如果站长在配置中关闭了等级系统，则直接退出，不消耗任何性能！
    if (!siteConfig.enableLevelSystem) return;

    try {
      // 1. 基础内容经验结算
      const postsExp = posts.length * 50;
      const chattersExp = chatters.length * 20;
      const momentsExp = moments.length * 10;
      const contentExp = postsExp + chattersExp + momentsExp;

      // 2. 每日首发打卡经验结算 (去重计算绝对发布日期)
      const allActivities = [...posts, ...chatters, ...moments];
      const uniqueDays = new Set();

      allActivities.forEach(item => {
        if (item.date) {
          const dayString = new Date(item.date).toISOString().split('T')[0];
          uniqueDays.add(dayString);
        }
      });

      const checkInDays = uniqueDays.size;
      const checkInExp = checkInDays * 100;

      // 3. 汇总总储备经验
      const totalExp = contentExp + checkInExp;

      // 4. 🌟 饱和渐近线算法：前期合理递增，后期无限逼近 2150 EXP 封顶
      const getExpNeededForLevel = (lvl: number) => {
        if (lvl <= 1) return 150;
        return 150 + Math.floor((2000 * (lvl - 1)) / ((lvl - 1) + 10));
      };

      let level = 1;
      let remainingExp = totalExp;
      let expNeededForNextLevel = getExpNeededForLevel(level);

      // 循环扣除经验完成升级
      while (remainingExp >= expNeededForNextLevel) {
        remainingExp -= expNeededForNextLevel;
        level++;
        expNeededForNextLevel = getExpNeededForLevel(level);
      }

      // 计算当前等级的经验百分比进度
      const progressPercent = ((remainingExp / expNeededForNextLevel) * 100).toFixed(1);

      // 5. 控制台日志
      console.groupCollapsed(`📋 [行笺] 雾醉醉言 个人档案同步...`);
      console.log(`%c[当前等级] Lv.${level}`, 'color: #6366f1; font-weight: 900; font-size: 16px; text-shadow: 0 0 4px rgba(99,102,241,0.3);');
      console.log(`%c[升级进度] ${remainingExp} / ${expNeededForNextLevel} EXP (${progressPercent}%)`, 'color: #10b981; font-weight: bold;');
      console.log(`[总计累计] ${totalExp} EXP`);
      console.log(`%c[渐近公式] EXP_Next = 150 + Math.floor((2000 * (L-1)) / ((L-1) + 10)) [极限上限: 2150]`, 'color: #8b5cf6; font-style: italic;');
      console.table({
        '文章发布 (50 EXP)': { '结算数量': posts.length, '贡献经验': postsExp },
        '杂谈记录 (20 EXP)': { '结算数量': chatters.length, '贡献经验': chattersExp },
        '每日说说 (10 EXP)': { '结算数量': moments.length, '贡献经验': momentsExp },
        '日历打卡 (100 EXP)': { '活跃天数': checkInDays, '贡献经验': checkInExp },
      });
      console.groupEnd();

    } catch (error) {
      console.error("经验系统计算流走火入魔：", error);
    }
  }, [posts, chatters, moments]);
  // =========================================================

  return (
    <div className="min-h-screen relative pb-32 overflow-x-hidden">
      <Navbar />

      <PageTransition>
        <div className="w-full max-w-7xl mx-auto mt-24 px-4 sm:px-10 relative z-10 flex flex-col items-center">

          {/* 顶部标题栏 */}
          <div className="w-full flex flex-col items-center mb-16 animate-fade-in-up text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-widest mb-3 flex items-center justify-center gap-3 transition-colors duration-700">
              <Trees className="text-indigo-500" size={40} /> 真物
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wider mb-8 transition-colors duration-700">
              寻找真物的途中，顺便留下点什么
            </p>

            {/* 单面板 */}
            <AlchemyLab posts={posts} chatters={chatters} moments={moments} />
          </div>

        </div>
      </PageTransition>

      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes ripple { 0% { r: 0; opacity: 0.8; } 100% { r: 30; opacity: 0; } }
        @keyframes particle-float { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; } 50% { transform: translateY(-8px) scale(1.3); opacity: 0.8; } }
      `}</style>
    </div>
  );
}