export interface Fuda {
  no: number;
  kimariji: string;
  normal: string;
  reverse: string;
}

export type InputMethod = 'tap' | 'swipe';
export type PracticeMode = 'manual' | 'auto';

export interface Settings {
  inputMethod: InputMethod;
  practiceMode: PracticeMode;
  autoTotalSeconds: number;
}

export interface PracticeRecord {
  id: string;
  completedAt: string;
  elapsedMs: number;
  mode: PracticeMode;
  inputMethod?: InputMethod;
  autoTotalSeconds?: number;
}

export interface PracticeResult {
  elapsedMs: number;
  mode: PracticeMode;
  inputMethod: InputMethod;
  autoTotalSeconds: number;
}

export interface DisplayFuda {
  src: string;
  kimariji: string;
}
