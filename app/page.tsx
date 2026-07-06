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
            <SearchBar posts={allPosts} />

            <main className="flex flex-col gap-6 w-full mt-6">

              {/* 第一行：作者档案卡 + 今日存档状态 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-7 flex flex-col">
                  <ProfileCard postCount={allPosts.length} chatterCount={chatterCount} photoCount={realPhotoCount}/>
                </div>
                <div className="col-span-1 lg:col-span-5 flex flex-col">
                  <ArchiveStatusCard />
                </div>
              </div>

              {/* 音乐氛围条 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-12 flex flex-col gap-2">
                  <CloudPlayer />
                  <LyricBar />
                </div>
              </div>

              {/* 第二行：最近拾零 + 灵感掉落 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-6 flex flex-col">
                  <LatestPostsCarousel posts={top5Posts} />
                </div>
                <div className="col-span-1 lg:col-span-6 flex flex-col">
                  <InspirationDropCard />
                </div>
              </div>

              {/* 第三行：雾中碎语 + 途经之景 + 未完成工程 */}
              <ArchiveEntranceCard
                photoCover={latestAlbum.cover}
                chatterDescription={siteConfig.chatterDescription}
              />

              {/* 底部：存档点状态栏 */}
              <div className="w-full mt-2">
                <SiteDashboard />
              </div>
            </main>
          </div>
        </PageTransition>
      </div>
    </ToastProvider>
  );
}