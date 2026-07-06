// 确定性伪随机数生成器（mulberry32）。
// 用于背景装饰粒子：相同 seed 在服务端与客户端产生一致的序列，
// 从而避免 hydration 不一致，并可在 render 期（useMemo）中纯函数式计算，
// 无需在 effect 里 setState 来延迟生成随机内容。
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return function () {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
