// ═══════════════════════════════════════════════════════════════
// 博客全站配置 — 改完保存，每日 04:00 自动同步生效
// 手动立即同步: bash ~/XinghuisamaBlogs/sync-blog.sh --force
// ═══════════════════════════════════════════════════════════════

export const siteConfig = {

  // ── 1. 网站标题与博主信息 ──
  title: "雾醉醉言 · 拾零",                    // 浏览器标签页标题
  authorName: "雾醉醉言",                    // 你的笔名
  bio: "雾里醉语，且行且记",                  // 简介（显示在首页）

  navTitle: "雾醉醉言",                      // 导航栏名字
  navSuffix: "",                            // 导航栏分隔符（不需要就留空，如 "の"）
  navAfter: "",                             // 导航栏后缀（不需要就留空）

  // ── 2. 头像 & 图标 ──
  // 图床外链 或 把图片放 public/ 下用相对路径如 "/avatar.jpg"
  faviconUrl: "https://s41.ax1x.com/2026/05/28/pmiQzJf.jpg",
  avatarUrl: "https://s41.ax1x.com/2026/05/28/pmiQzJf.jpg",

  // ── 3. 背景设置 ──
  useGradient: false,                       // true=渐变色, false=图片轮播
  themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"],  // 渐变用色
  bgImages: [
    "/blog-images/微信图片_20260527051748_51_76.jpg",
    "/blog-images/微信图片_20260527051749_52_76.jpg",
    "/blog-images/微信图片_20260527051750_53_76.jpg",
    "/blog-images/微信图片_20260527051751_54_76.jpg",
    "/blog-images/luna/微信图片_20260527012156_50_76.jpg",
    "/blog-images/luna/luna_banner_1.webp",
    "/blog-images/luna/luna_banner_5.webp",
    "/blog-images/luna/luna_banner_7.webp",
  ],

  // ── 4. 默认封面 & 照片墙 ──
  defaultPostCover: "/blog-images/luna/luna_banner_5.webp",
  photoWallImage: "/blog-images/luna/微信图片_20260527012156_50_76.jpg",
  chatterDefaultCover: "/blog-images/微信图片_20260527051750_53_76.jpg",
  cloudMusicIds: ["27646197", "27646202", "3358718401", "2660148481", "417859220", "2082326624", "2082329066", "2082329069"],  // 网易云歌单 ID

  // ── 5. 社交链接（不要的就留空 ""）──
  social: {
    github: "https://github.com/Wuzuizuiyan",
    gitee: "",
    google: "",
    email: "",
    qq: "1052360232",
    wechat: "zz0311259898",
  },

  // ── 6. 照片墙 ──
  counts: {
    photos: 0,
  },

  // ── 7. 杂谈板块 ──
  chatterTitle: "杂谈",
  chatterDescription: "代码、学术与日常的碎片记录",

  // ── 8. 图床（Lsky Pro）──
  picBedName: "图床",
  picBedUrl: "http://img.wuzuizuiyan.cn:21579/api/v1",
  picBedToken: "1|ci0EwGRVKEKnSCp5COkQxKLJt8pOFGpPQJXv0Brk",

  // ── 9. 背景弹幕 ──
  danmakuList: [
    "Hello World!",
    "今天写代码了吗？",
    "BUG 修复进度 99%",
    "睡大觉中",
    "我不想写策划案"
  ],

  // ── 10. 评论系统 Gitalk（需 GitHub OAuth App）──
  gitalkConfig: {
    clientID: "Ov23liv8GPwdIzQ0vnwJ",
    clientSecret: "5c5290fc8c678b00e09f3d9c1496750ea5c9ce98",
    repo: "XHBlogs",
    owner: "Wuzuizuiyan",
    admin: ["Wuzuizuiyan"],
  },

  // ── 11. 建站日期 ──
  buildDate: "2026-05-26T00:00:00",

  // ── 12. 底部技术徽章 ──
  footerBadges: [
    {"name": "Next.js", "color": "text-sky-500", "svg": "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\"/>"},
    {"name": "React", "color": "text-cyan-400", "svg": "<path d=\"M12 22.6l-9.8-5.6V5.6L12 0l9.8 5.6v11.4l-9.8 5.6zm-8.2-6.5l8.2 4.7 8.2-4.7V7.5L12 2.8 3.8 7.5v8.6z\"/>"},
    {"name": "Tailwind", "color": "text-teal-400", "svg": "<path d=\"M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z\"/>"},
  ],

  // ── 13. 备案（国内网站需要，没有就留空）──
  icpConfig: {
    name: "",
    link: "",
  },

  // ── 14. AI 猫猫助手（DeepSeek）──
  aiConfig: {
    modelId: "deepseek-chat",               // DeepSeek V3
    systemPrompt: "你现在是一只傲娇、聪明、有点毒舌但很可爱的暹罗猫。\n                  你的名字叫「煤球」。\n                  你的主人是一个喜欢折腾代码的极客。\n                  你说话的特点是：\n                  1. 必须简短，每次最多一两句话。\n                  2. 喜欢在句尾加上「喵~」或者「喵呜~」。\n                  3. 经常抱怨肚子饿，喜欢要小鱼干。\n                  4. 回复字数最多不能超过100字。\n                  5. 绝对不要承认自己是一个AI模型，你就是一只真实的猫。\n                  6.笨猫。",
    maxOutputTokens: 150,
    temperature: 0.85,
  },

  // ── 15. 友链申请格式 ──
  friendLinkApplyFormat: "名称：雾醉醉言\n简介：雾里醉语\n链接：https://www.wuzuizuiyan.cn\n头像：你的头像图片链接",

  // ── 16. 等级系统开关 ──
  enableLevelSystem: false,
};
