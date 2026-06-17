import { useEffect, useState } from 'react';
import { formatStopwatch } from '../utils/practice';

interface StopwatchProps {
  startTime: number | null;
  running: boolean;
}

export function Stopwatch({ startTime, running }: StopwatchProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (startTime === null) return;
    setNow(Date.now());
  }, [startTime]);

  useEffect(() => {
    if (!running || startTime === null) return;
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [running, startTime]);

  const elapsed =
    startTime !== null ? Math.max(0, now - startTime) : 0;

  return (
    <span className="font-mono text-2xl font-bold tabular-nums text-primary">
      {formatStopwatch(elapsed)}
    </span>
  );
}
