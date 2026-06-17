import type { CSSProperties } from 'react';
import { useSettingsContext } from '../contexts/SettingsContext';
import type { InputMethod, PracticeMode } from '../types';
import { Button } from './Button';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const AUTO_MIN = 10;
const AUTO_MAX = 180;
const AUTO_STEP = 10;

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettingsContext();

  if (!open) return null;

  const handleSliderChange = (value: number) => {
    updateSettings({ autoTotalSeconds: value, practiceMode: 'auto' });
  };

  const sliderProgress =
    ((settings.autoTotalSeconds - AUTO_MIN) / (AUTO_MAX - AUTO_MIN)) * 100;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-primary">設定</h2>

        <div className="space-y-8">
          <section>
            <h3 className="mb-3 text-sm font-bold text-primary">操作方法</h3>
            <div className="flex gap-2">
              {(['swipe', 'tap'] as InputMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => updateSettings({ inputMethod: method })}
                  className={`flex-1 rounded-xl py-3 text-sm font-medium transition ${
                    settings.inputMethod === method
                      ? 'bg-primary text-white'
                      : 'bg-bg text-text hover:bg-white'
                  }`}
                >
                  {method === 'tap' ? 'タップ' : 'スワイプ'}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-primary">練習モード</h3>
            <div className="mb-4 flex gap-2">
              {(['manual', 'auto'] as PracticeMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateSettings({ practiceMode: mode })}
                  className={`flex-1 rounded-xl py-3 text-sm font-medium transition ${
                    settings.practiceMode === mode
                      ? 'bg-primary text-white'
                      : 'bg-bg text-text hover:bg-white'
                  }`}
                >
                  {mode === 'manual' ? '手動' : '自動'}
                </button>
              ))}
            </div>

            <div
              className={`rounded-xl bg-bg px-4 py-5 transition-opacity ${
                settings.practiceMode === 'auto' ? 'opacity-100' : 'pointer-events-none opacity-40'
              }`}
            >
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm text-text/70">100枚の合計時間</span>
                <span className="text-2xl font-bold text-primary">
                  {settings.autoTotalSeconds}
                  <span className="ml-0.5 text-base font-medium">秒</span>
                </span>
              </div>
              <input
                type="range"
                min={AUTO_MIN}
                max={AUTO_MAX}
                step={AUTO_STEP}
                value={settings.autoTotalSeconds}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="settings-slider w-full"
                style={{ '--slider-progress': `${sliderProgress}%` } as CSSProperties}
                disabled={settings.practiceMode !== 'auto'}
              />
              <div className="mt-1 flex justify-between text-xs text-text/50">
                <span>{AUTO_MIN}秒</span>
                <span>{AUTO_MAX}秒</span>
              </div>
              <p className="mt-3 text-center text-xs text-text/60">
                1枚あたり {(settings.autoTotalSeconds / 100).toFixed(1)} 秒間隔
              </p>
            </div>
          </section>
        </div>

        <div className="mt-6">
          <Button variant="secondary" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
}
