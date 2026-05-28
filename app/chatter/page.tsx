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

export default function ChatterPage() {
  // 注意：这里我们假设你的 md 文件放在根目录的 chatters 文件夹里
  const chattersDirectory = path.join(process.cwd(), 'chatters');
  let chatters = [];

  try {
    // 确保文件夹存在
    if (!fs.existsSync(chattersDirectory)) {
      fs.mkdirSync(chattersDirectory);
    }

    const fileNames = fs.readdirSync(chattersDirectory).filter(fileName => fileName.endsWith('.md'));

    chatters = fileNames.map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fileContents = fs.readFileSync(path.join(chattersDirectory, fileName), 'utf8');
      const { data, content } = matter(fileContents);

      // 确保 date 是字符串（gray-matter 会自动转 Date 对象）
      const dateStr = data.date instanceof Date
        ? data.date.toISOString().slice(0, 19).replace('T', ' ')
        : (data.date || '未知时间');

      // 去除 markdown 格式符号用于预览
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
          .replace(/\[\^[^\]]+\]/g, '')  // 脚注引用
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
    }).sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime())); // 按时间倒序
  } catch (e) {
    console.error("读取杂谈文件失败:", e);
  }

  return (
    <div className="min-h-screen relative pb-10">
      <Navbar />
      <PageTransition>
        {/* 将解析好的数据传递给客户端组件进行瀑布流渲染 */}
        <ChatterBoard chatters={chatters} />
      </PageTransition>
    </div>
  );
}