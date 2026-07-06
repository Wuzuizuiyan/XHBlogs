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
    <div className="rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-amber-200/30 dark:border-white/10 shadow-xl overflow-hidden relative group min-h-[300px] sm:min-h-[320px] h-full flex flex-col">
      {/* 档案纸纹理感 */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,235,0.15)_0%,transparent_40%)] dark:bg-[linear-gradient(180deg,rgba(120,90,60,0.08)_0%,transparent_40%)] pointer-events-none z-[1]" />

      <Link href={currentPost.slug === 'none' ? '#' : `/posts/${currentPost.slug}`} className="absolute inset-0 z-20" aria-label={`阅读 ${currentPost.title}`} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <img src={currentPost.cover} className="w-full h-full object-cover opacity-85 transition-transform duration-1000 group-hover:scale-105 sepia-[0.15]" alt={currentPost.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-800/40 to-amber-50/10"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col justify-end p-5 sm:p-6 w-full mt-auto h-full pointer-events-none">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-3 py-1 bg-amber-600/80 backdrop-blur-lg rounded-full text-[10px] text-white font-black tracking-widest shadow-lg">
            最近拾零
          </span>
          {currentPost.formattedDate && (
            <span className="px-2 py-1 bg-black/30 backdrop-blur-md border border-white/20 rounded-full text-[10px] text-white/90 font-mono tracking-wider">
              {currentPost.formattedDate}
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-amber-50 mb-2 group-hover:-translate-y-1 transition-transform drop-shadow-md">{currentPost.title}</h2>
        <p className="text-sm text-stone-200/90 line-clamp-3 drop-shadow-sm mb-4">{currentPost.description}</p>
      </div>

      {posts.length > 1 && (
        <div className="absolute bottom-4 right-5 sm:right-6 z-30 flex gap-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/80'}`}
              aria-label={`切换到第 ${i + 1} 篇拾零`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
