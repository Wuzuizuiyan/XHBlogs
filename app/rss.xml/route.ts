import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { siteConfig } from '../../siteConfig';

// ── 复用 page.tsx 中的 walkMdFiles 逻辑 ──
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

// ── RFC 822 格式日期 ──
function toRFC822(dateString: string): string {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Thu, 01 Jan 1970 00:00:00 +0000';

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = days[d.getDay()];
  const date = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');

  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const offH = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const offM = String(Math.abs(offset) % 60).padStart(2, '0');

  return `${day}, ${date} ${month} ${year} ${hh}:${mm}:${ss} ${sign}${offH}${offM}`;
}

// ── XML 转义 ──
function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
}

export async function GET() {
  const domain = 'https://www.wuzuizuiyan.cn';
  const postsDirectory = path.join(process.cwd(), 'posts');

  let allPosts: { slug: string; title: string; description: string; date: string }[] = [];

  try {
    if (fs.existsSync(postsDirectory)) {
      const relPaths = walkMdFiles(postsDirectory, postsDirectory);
      allPosts = relPaths.map(relPath => {
        const fullPath = path.join(postsDirectory, relPath + '.md');
        const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
        const rawDate = data.date || '1970-01-01';
        // slug URL 编码（复用 page.tsx 逻辑）
        const slug = relPath.split(path.sep).map(s => encodeURIComponent(s)).join('/');
        return {
          slug,
          title: data.title || '',
          description: data.description || '',
          date: rawDate,
        };
      }).sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }).slice(0, 20);
    }
  } catch {
    // 读取失败返回空列表
  }

  const items = allPosts.map(post => {
    const link = `${domain}/posts/${post.slug}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${toRFC822(post.date)}</pubDate>
      <guid>${escapeXml(link)}</guid>
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${escapeXml(domain)}</link>
    <description>${escapeXml(siteConfig.bio)}</description>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
