
// 🛡️ 由 Obsidian vault/blog/albums/ 自动生成

export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [];
