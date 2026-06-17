import { useState } from 'react';
import type { PracticeRecord } from '../types';
import { formatElapsed, formatRecordDate, modeLabel } from '../utils/practice';

interface RecordListProps {
  records: PracticeRecord[];
}

export function RecordList({ records }: RecordListProps) {
  const [selected, setSelected] = useState<PracticeRecord | null>(null);

  if (records.length === 0) {
    return (
      <p className="rounded-xl bg-surface px-4 py-6 text-center text-sm text-text/60">
        まだ記録がありません
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {records.map((record) => (
          <li key={record.id}>
            <button
              type="button"
              onClick={() => setSelected(record)}
              className="w-full rounded-xl bg-surface px-4 py-3 text-left shadow-sm transition hover:bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-text/70">{formatRecordDate(record.completedAt)}</span>
                <span className="font-bold text-primary">{formatElapsed(record.elapsedMs)}</span>
              </div>
              <p className="mt-1 text-xs text-text/60">
                {modeLabel(
                  record.mode,
                  record.inputMethod ?? 'tap',
                  record.autoTotalSeconds ?? 60,
                )}
              </p>
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-bold text-primary">記録の詳細</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text/60">日時</dt>
                <dd>{formatRecordDate(selected.completedAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text/60">時間</dt>
                <dd className="font-bold">{formatElapsed(selected.elapsedMs)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text/60">モード</dt>
                <dd>
                  {modeLabel(
                    selected.mode,
                    selected.inputMethod ?? 'tap',
                    selected.autoTotalSeconds ?? 60,
                  )}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl bg-primary py-3 font-medium text-white"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
