import type { PracticeRecord } from '../types';
import { formatElapsed, formatRecordDate, inputMethodLabel } from '../utils/practice';

interface RecordListProps {
  records: PracticeRecord[];
}

export function RecordList({ records }: RecordListProps) {
  if (records.length === 0) {
    return (
      <p className="rounded-xl bg-surface px-4 py-6 text-center text-sm text-text/60">
        まだ記録がありません
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {records.map((record) => (
        <li
          key={record.id}
          className="rounded-xl bg-surface px-4 py-3 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-text/70">{formatRecordDate(record.completedAt)}</span>
            <span className="font-bold text-primary">{formatElapsed(record.elapsedMs)}</span>
          </div>
          <p className="mt-1 text-xs text-text/60">
            {inputMethodLabel(record.inputMethod ?? 'tap')}
          </p>
        </li>
      ))}
    </ul>
  );
}
