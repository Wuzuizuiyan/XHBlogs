// components/LatestPostsCarousel.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type CarouselPost = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  formattedDate?: string;
};

export default function LatestPostsCarousel({ posts }: { posts: CarouselPost[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (!posts || posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  return (
    <div className="rounded-3xl !bg-[#fffaf0]/78 backdrop-blur-md border !border-white/80 shadow-[0_18px_45px_rgba(133,101,59,0.16)] overflow-hidden relative group min-h-[230px] h-full p-4 sm:p-5">
      <div className="absolute top-3 right-5 h-12 w-12 border-t-2 border-r-2 border-stone-300/60 dark:border-white/10 rounded-tr-2xl pointer-events-none" />
      <div className="absolute -top-2 right-6 h-10 w-4 rounded-sm bg-stone-300/50 dark:bg-slate-600/40 rotate-12 shadow-sm pointer-events-none" />

      <Link href={currentPost.slug === 'none' ? '#' : `/posts/${currentPost.slug}`} className="absolute inset-0 z-20" aria-label={`阅读 ${currentPost.title}`} />

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
          <h2 className="text-base sm:text-lg font-bold !text-stone-800">最近拾零</h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPost.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 sm:grid-cols-[44%_1fr] gap-4 flex-1"
          >
            <div className="rounded-xl overflow-hidden border border-white/80 dark:border-white/10 shadow-sm bg-white/50 h-40 sm:h-full">
              <img src={currentPost.cover} className="w-full h-full object-cover sepia-[0.16] contrast-[0.95] transition-transform duration-1000 group-hover:scale-105" alt={currentPost.title} />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-2.5 py-1 !bg-white/55 rounded-full text-[10px] !text-stone-600 font-bold border border-stone-200/70">
                  文章
                </span>
                {currentPost.formattedDate && (
                  <span className="text-[10px] !text-stone-500 font-mono tracking-wider">
                    {currentPost.formattedDate}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold !text-stone-800 mb-2 group-hover:!text-amber-700 transition-colors">{currentPost.title}</h3>
              <p className="text-sm !text-stone-600 line-clamp-3 leading-relaxed mb-4">{currentPost.description}</p>
              <span className="text-xs font-bold !text-stone-600">阅读全文 →</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {posts.length > 1 && (
        <div className="absolute bottom-4 right-5 z-30 flex gap-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-6 bg-amber-600' : 'w-2 bg-stone-300 hover:bg-stone-400'}`}
              aria-label={`切换到第 ${i + 1} 篇拾零`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
