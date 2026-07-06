import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import SearchBar from '../components/SearchBar';
import { siteConfig } from '../siteConfig';
import CloudPlayer from '../components/CloudPlayer';
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

  const chatterCount = allChatters.length;
  const realPhotoCount = albums.reduce((total, album) => total + album.photos.length, 0);
  const latestAlbum = albums.length > 0 ? albums[0] : { id: '', title: '照片墙', description: '查看摄影', cover: siteConfig.photoWallImage, date: '' };

  return (
    <ToastProvider>
      <div className="min-h-screen relative pb-10">
        <Navbar />
        <PageTransition>
          {/* 🌟 调整整体容器的内边距，适应手机端更小的屏幕 */}
          <div className="w-full max-w-6xl mx-auto mt-24 sm:mt-28 px-4 sm:px-6 lg:px-10 relative z-10">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/40 dark:border-white/10 bg-white/35 dark:bg-slate-900/45 backdrop-blur-xl shadow-2xl px-5 py-6 sm:px-8 sm:py-8">
              <div className="absolute -top-24 right-10 h-56 w-56 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 left-8 h-48 w-48 rounded-full bg-slate-300/20 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />
              <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:items-end">
                <div>
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.35em] text-amber-700/80 dark:text-amber-300/80 mb-3">
                    Save Slot 01 / Mist Archive
                  </p>
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
                    雾中存档工作台
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    一个游戏策划的个人存档点：把策划案、碎语、照片和未完成的灵感先收进雾里，等它们慢慢长出形状。
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {siteConfig.archiveRoles?.map((role) => (
                      <span key={role} className="rounded-full border border-white/50 dark:border-white/10 bg-white/45 dark:bg-slate-800/45 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="lg:justify-self-end w-full">
                  <SearchBar posts={allPosts} />
                </div>
              </div>
            </section>

            <main className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 w-full mt-6 items-start">

              {/* 左侧主舞台：作者档案、最新拾零和入口区 */}
              <section className="flex flex-col gap-6 min-w-0">
                <ProfileCard postCount={allPosts.length} chatterCount={chatterCount} photoCount={realPhotoCount}/>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] gap-6">
                  <LatestPostsCarousel posts={top5Posts} />
                  <div className="flex flex-col gap-6">
                    <InspirationDropCard />
                    <div className="rounded-3xl bg-white/35 dark:bg-slate-800/45 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 mb-3">Background Track</p>
                      <LyricBar />
                    </div>
                  </div>
                </div>

                <ArchiveEntranceCard
                  photoCover={latestAlbum.cover}
                  chatterDescription={siteConfig.chatterDescription}
                />
              </section>

              {/* 右侧侧栏：今日状态和音乐氛围，不再占据首页主轴 */}
              <aside className="flex flex-col gap-6 xl:sticky xl:top-24">
                <ArchiveStatusCard />
                <div className="relative">
                  <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-amber-300/10 to-slate-400/10 blur-xl pointer-events-none" />
                  <CloudPlayer />
                </div>
              </aside>

              {/* 底部：存档点状态栏 */}
              <div className="xl:col-span-2 w-full mt-2">
                <SiteDashboard />
              </div>
            </main>
          </div>
        </PageTransition>
      </div>
    </ToastProvider>
  );
}