import type { Fuda } from '../types';

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分${seconds}秒`;
}

export function formatStopwatch(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatRecordDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const time = date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `今日 ${time}`;
  if (isYesterday) return `昨日 ${time}`;
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function getFudaImage(fuda: Fuda): string {
  return Math.random() < 0.5 ? fuda.normal : fuda.reverse;
}

export function getDragDistance(dx: number, dy: number): number {
  return Math.sqrt(dx * dx + dy * dy);
}

export function getAutoIntervalMs(totalSeconds: number): number {
  return totalSeconds * 10;
}

export function modeLabel(
  mode: 'manual' | 'auto',
  inputMethod: 'tap' | 'swipe',
  autoTotalSeconds: number,
): string {
  if (mode === 'auto') return `自動 ${autoTotalSeconds}秒`;
  return inputMethod === 'tap' ? '手動（タップ）' : '手動（スワイプ）';
}

export function preloadFudaImages(paths: string[]): void {
  const sources = [...new Set(paths)];
  let index = 0;
  const CHUNK_SIZE = 8;

  const loadChunk = (deadline?: IdleDeadline) => {
    let processed = 0;
    while (index < sources.length && processed < CHUNK_SIZE) {
      if (deadline && deadline.timeRemaining() <= 0) break;
      const img = new Image();
      img.src = sources[index];
      index++;
      processed++;
    }
    if (index < sources.length) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadChunk);
      } else {
        setTimeout(() => loadChunk(), 16);
      }
    }
  };

  if (sources.length === 0) return;
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadChunk);
  } else {
    setTimeout(() => loadChunk(), 0);
  }
}
