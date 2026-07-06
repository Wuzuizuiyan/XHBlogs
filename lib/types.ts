// 文章 / 杂谈卡片的通用元数据（来自 Markdown frontmatter + 派生字段）。
// 保留索引签名以兼容 gray-matter 展开的任意 frontmatter 字段。
export interface PostMeta {
  slug: string;
  title?: string;
  description?: string;
  cover?: string;
  date: string;
  formattedDate?: string;
  tags?: string[];
  content?: string;
  [key: string]: unknown;
}

// 归档（时间线）页的文章条目。
export interface TimelinePost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover: string;
}

// 标签及其计数。
export interface TagCount {
  name: string;
  count: number;
}

// 「真物」页聚合的内容条目（文章/杂谈/说说统一结构）。
export interface CreativeItem {
  id: string;
  slug: string;
  title: string;
  type: string;
  date: string;
  cover: string | null;
  content: string;
  description?: string;
}

// 单行歌词。
export interface LyricLine {
  time: number;
  text: string;
}

// 歌曲信息。字段较宽松以兼容不同音乐 API（网易/meting）返回的别名，
// 例如 title/name、artist/author、cover/pic 等。
export interface Song {
  id: string;
  title?: string;
  name?: string;
  artist?: string;
  author?: string;
  cover?: string;
  pic?: string;
  src?: string;
  lrcUrl?: string;
  lrc?: string;
  lyric?: string;
  lyrics?: LyricLine[] | string;
}
