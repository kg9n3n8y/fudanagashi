import type { PracticeRecord } from '../types';
import { formatElapsed, formatRecordDate } from '../utils/practice';

interface RecordListProps {
  records: PracticeRecord[];
}

export function RecordList({ records }: RecordListProps) {
  if (records.length === 0) {
    return (
      <p className="rounded-xl bg-surface px-4 py-5 text-center text-sm text-text/60">
        まだ記録がありません
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {records.map((record) => (
        <li
          key={record.id}
          className="flex items-center justify-between gap-2 rounded-xl bg-surface px-4 py-2 shadow-sm"
        >
          <span className="text-sm text-text/70">{formatRecordDate(record.completedAt)}</span>
          <span className="font-bold text-primary">{formatElapsed(record.elapsedMs)}</span>
        </li>
      ))}
    </ul>
  );
}
