import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 引入前台客户端组件
import CreativeWorkshopClient from './CreativeWorkshopClient';
import { CreativeItem } from '../../lib/types';

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

function getLocalItems(directoryName: string, typeName: string) {
  const dirPath = path.join(process.cwd(), directoryName);
  let items: CreativeItem[] = [];
  try {
    if (fs.existsSync(dirPath)) {
      const relPaths = walkMdFiles(dirPath, dirPath);
      items = relPaths.map(relPath => {
        const fullPath = path.join(dirPath, relPath + '.md');
        // 🌟 核心：把 content（正文内容）和 data（头部参数）解构出来！
        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));

        // slug 用相对路径，如 '游戏设计/塔防Roguelike'（平铺目录则是纯文件名）
        const slug = relPath.split(path.sep).map(s => encodeURIComponent(s)).join('/');

        return {
          id: data.id || relPath,
          slug, // 🌟 可能是多层路径或纯文件名
          title: data.title || '',
          type: typeName,
          // 确保 date 是字符串（gray-matter 会自动转 Date 对象）
          date: data.date instanceof Date
            ? data.date.toISOString().slice(0, 19).replace('T', ' ')
            : (data.date || '2026-05-01'),
          // 🌟 核心修复：把 cover（封面图）提取出来传给前台！如果写的是 image 也兼容
          cover: data.cover || data.image || null,
          // 把正文传给前台，去掉可能存在的换行符，限制长度防止卡片撑爆
          content: content.trim()
        };
      });
    }
  } catch (error) {
    console.error(`读取 ${directoryName} 失败:`, error);
  }
  return items;
}

export default function CreativeWorkshopPage() {
  const posts = getLocalItems('posts', 'post');
  const chatters = getLocalItems('chatters', 'chatter');
  const moments = getLocalItems('moments', 'moment');

  return (
    <CreativeWorkshopClient
      posts={posts}
      chatters={chatters}
      moments={moments}
    />
  );
}