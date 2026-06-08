import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import ChatterBoard from './ChatterBoard';
import { siteConfig } from '@/siteConfig';


export const metadata = {
  title: "杂谈 | "+ siteConfig.title,
  description: "日常碎片与灵感记录",
};

// 递归扫描 chatters 目录，返回所有 .md 文件
function walkChatterFiles(dir: string, baseDir: string): { slug: string; filePath: string }[] {
  const results: { slug: string; filePath: string }[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkChatterFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relPath = path.relative(baseDir, fullPath);
      const slug = relPath.replace(/\.md$/, '');
      results.push({ slug, filePath: fullPath });
    }
  }
  return results;
}

function loadChatters(): Array<{
  slug: string;
  title: string;
  date: string;
  tags: string[];
  mood: string;
  cover: string;
  content: string;
}> {
  const chattersDirectory = path.join(process.cwd(), 'chatters');

  try {
    if (!fs.existsSync(chattersDirectory)) {
      fs.mkdirSync(chattersDirectory);
    }

    const allFiles = walkChatterFiles(chattersDirectory, chattersDirectory);

    return allFiles.map(({ slug, filePath }) => {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      const dateStr = data.date instanceof Date
        ? data.date.toISOString().slice(0, 19).replace('T', ' ')
        : (data.date || '未知时间');

      const stripMarkdown = (text: string) => {
        return text
          .replace(/#{1,6}\s/g, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/`(.*?)`/g, '$1')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
          .replace(/^\s*[-*+]\s/gm, '')
          .replace(/^\s*>\s/gm, '')
          .replace(/\[\^[^\]]+\]/g, '')
          .replace(/\n{2,}/g, ' ')
          .replace(/\n/g, ' ')
          .trim();
      };
      const previewContent = stripMarkdown(content).substring(0, 200);

      return {
        slug,
        title: data.title || '',
        date: dateStr,
        tags: data.tags || [],
        mood: data.mood || '',
        cover: siteConfig.chatterDefaultCover,
        content: previewContent || content.substring(0, 200)
      };
    }).sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
  } catch (e) {
    console.error("读取杂谈文件失败:", e);
    return [];
  }
}

export default function ChatterPage() {
  const chatters = loadChatters();

  return (
    <div className="min-h-screen relative pb-10">
      <Navbar />
      <PageTransition>
        <ChatterBoard chatters={chatters} />
      </PageTransition>
    </div>
  );
}
