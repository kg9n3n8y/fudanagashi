import type { PracticeRecord, Settings } from '../types';

const RECORDS_KEY = 'fudanagashi_records';
const SETTINGS_KEY = 'fudanagashi_settings';
const INSTALL_DISMISSED_KEY = 'pwa_install_prompt_dismissed';
const MAX_RECORDS = 5;

export const DEFAULT_SETTINGS: Settings = {
  inputMethod: 'swipe',
  practiceMode: 'manual',
  autoTotalSeconds: 60,
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadRecords(): PracticeRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];
    const records = JSON.parse(raw) as PracticeRecord[];
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

export function addRecord(record: PracticeRecord): PracticeRecord[] {
  const records = [record, ...loadRecords()].slice(0, MAX_RECORDS);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  return records;
}

export function isInstallPromptDismissed(): boolean {
  return localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true';
}

export function dismissInstallPrompt(): void {
  localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
}
