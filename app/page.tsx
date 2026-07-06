import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { siteConfig } from '../siteConfig';
import ProfileCard from '../components/ProfileCard';
import SiteDashboard from '../components/SiteDashboard';
import { albums } from '../data/albums';
import LyricBar from '../components/LyricBar';
import { ToastProvider } from '../components/ToastProvider';

import LatestPostsCarousel from '../components/LatestPostsCarousel';
import ArchiveStatusCard from '../components/ArchiveStatusCard';
import InspirationDropCard from '../components/InspirationDropCard';
import ArchiveEntranceCard from '../components/ArchiveEntranceCard';

export type HomePost = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  content?: string;
  date: string;
  formattedDate: string;
};

type ChatterPreview = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  formattedDate: string;
};

// ── 递归扫描目录，返回所有 .md 文件的相对路径（不含 .md）──
function walkMdFiles(dir: string, baseDir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMdFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(path.relative(baseDir, fullPath).replace(/\.md$/, ''));
    }
  }
  return results;
}

function formatUpdateTime(dateString: string) {
  if (!dateString || dateString === '1970-01-01') return '刚刚更新';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    if (hours === '00' && mins === '00') return `${year}.${month}.${day}`;
    return `${year}.${month}.${day} ${hours}:${mins}`;
  } catch { return dateString; }
}

export default function Home() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  let allPosts: HomePost[] = [];
  try {
    if (fs.existsSync(postsDirectory)) {
      const relPaths = walkMdFiles(postsDirectory, postsDirectory);
      allPosts = relPaths.map(relPath => {
        const fullPath = path.join(postsDirectory, relPath + '.md');
        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
        const rawDate = data.date || '1970-01-01';
        // slug 用相对路径，如 '游戏设计/塔防Roguelike'
        const slug = relPath.split(path.sep).map(s => encodeURIComponent(s)).join('/');
        return {
          slug,
          ...data,
          title: data.title || '',
          description: data.description || '',
          cover: siteConfig.defaultPostCover,
          content: content || '',
          date: rawDate,
          formattedDate: formatUpdateTime(rawDate)
        };
      }).sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.slug.localeCompare(a.slug);
      });
    }
  } catch {}
  const top5Posts = allPosts.length > 0 ? allPosts.slice(0, 5) : [{ slug: 'none', title: '暂无文章', description: '快去写第一篇吧！', cover: siteConfig.defaultPostCover, date: '', formattedDate: '' }];

  const chattersDirectory = path.join(process.cwd(), 'chatters');
  let allChatters: ChatterPreview[] = [];
  try {
    if (fs.existsSync(chattersDirectory)) {
      // 递归扫描子目录
      const walkChatterFiles = (dir: string, base: string): {slug: string, filePath: string}[] => {
        const results: {slug: string, filePath: string}[] = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            results.push(...walkChatterFiles(full, base));
          } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const rel = path.relative(base, full);
            results.push({ slug: rel.replace(/\.md$/, ''), filePath: full });
          }
        }
        return results;
      };
      const chatterFiles = walkChatterFiles(chattersDirectory, chattersDirectory);
      allChatters = chatterFiles.map(({slug, filePath}) => {
        const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
        const rawDate = data.date || '1970-01-01';
        const cover = siteConfig.chatterDefaultCover;
        // 去除 markdown 格式符号
        const stripMarkdown = (text: string) => {
          return text
            .replace(/#{1,6}\s/g, '')  // 标题
            .replace(/\*\*(.*?)\*\*/g, '$1')  // 粗体
            .replace(/\*(.*?)\*/g, '$1')  // 斜体
            .replace(/`(.*?)`/g, '$1')  // 行内代码
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // 链接
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')  // 图片
            .replace(/^\s*[-*+]\s/gm, '')  // 列表
            .replace(/^\s*>\s/gm, '')  // 引用
            .replace(/\n{2,}/g, ' ')  // 多个换行变空格
            .replace(/\n/g, ' ')  // 单个换行变空格
            .trim();
        };
        const description = data.description || stripMarkdown(content).substring(0, 60);
        return { slug, title: data.title || '碎片记录', description: description, cover: cover, date: rawDate, formattedDate: formatUpdateTime(rawDate) };
      }).sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.slug.localeCompare(a.slug);
      });
    }
  } catch {}
  const top3Chatters = allChatters.length > 0 ? allChatters.slice(0, 3) : [];

  const chatterCount = allChatters.length;
  const realPhotoCount = albums.reduce((total, album) => total + album.photos.length, 0);
  const latestAlbum = albums.length > 0 ? albums[0] : { id: '', title: '照片墙', description: '查看摄影', cover: siteConfig.photoWallImage, date: '' };

  return (
    <ToastProvider>
      <div className="min-h-screen relative pb-10 !bg-[#efe3cf] bg-[radial-gradient(circle_at_top_left,rgba(251,240,215,0.9),transparent_36%),radial-gradient(circle_at_top_right,rgba(229,204,168,0.55),transparent_30%)]">
        <Navbar />
        <PageTransition>
          <div className="w-full max-w-7xl mx-auto mt-20 sm:mt-24 px-4 sm:px-6 lg:px-8 relative z-10">
            <main className="relative rounded-[2rem] sm:rounded-[2.5rem] border !border-white/70 !bg-[#f4ead8]/72 backdrop-blur-xl shadow-[0_25px_80px_rgba(120,93,58,0.22)] px-4 py-5 sm:px-6 sm:py-6 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-70 bg-[linear-gradient(90deg,rgba(132,103,65,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(132,103,65,0.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="absolute -top-10 right-24 h-28 w-28 rounded-full bg-white/35 blur-2xl pointer-events-none" />
              <div className="absolute left-6 top-20 text-amber-900/15 dark:text-white/10 text-7xl font-serif rotate-[-14deg] pointer-events-none">⌁</div>

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5">
                <section className="lg:col-span-8">
                  <ProfileCard postCount={allPosts.length} chatterCount={chatterCount} photoCount={realPhotoCount}/>
                </section>

                <section className="lg:col-span-4">
                  <ArchiveStatusCard />
                </section>

                <section className="lg:col-span-7">
                  <LatestPostsCarousel posts={top5Posts} />
                </section>

                <section className="lg:col-span-5">
                  <InspirationDropCard />
                </section>

                <section className="lg:col-span-12">
                  <ArchiveEntranceCard
                    photoCover={latestAlbum.cover}
                    chatterDescription={siteConfig.chatterDescription}
                    chatters={top3Chatters}
                  />
                </section>

                <section className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-4 items-stretch">
                  <SiteDashboard />
                  <div className="rounded-2xl border !border-white/70 !bg-white/55 backdrop-blur-md shadow-[0_10px_28px_rgba(122,91,54,0.13)] px-4 py-3 flex items-center">
                    <LyricBar />
                  </div>
                  <div className="rounded-2xl border !border-white/70 !bg-white/55 backdrop-blur-md shadow-[0_10px_28px_rgba(122,91,54,0.13)] px-4 py-3 flex items-center justify-between text-xs font-bold !text-stone-600">
                    <span>建站时间</span>
                    <span className="font-mono !text-stone-500">2026 / 05 / 26</span>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </PageTransition>
      </div>
    </ToastProvider>
  );
}