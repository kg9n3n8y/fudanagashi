import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Layout } from '../components/Layout';
import type { PracticeResult } from '../types';
import { addRecord } from '../utils/storage';
import { formatElapsed, modeLabel } from '../utils/practice';

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as PracticeResult | null;
  const savedRef = useRef(false);

  useEffect(() => {
    if (!result) {
      navigate('/', { replace: true });
      return;
    }
    if (savedRef.current) return;
    savedRef.current = true;

    if (result.mode !== 'auto') {
      addRecord({
        id: crypto.randomUUID(),
        completedAt: new Date().toISOString(),
        elapsedMs: result.elapsedMs,
        mode: result.mode,
        inputMethod: result.inputMethod,
        autoTotalSeconds: result.autoTotalSeconds,
      });
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <Layout title="結果">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div>
          <p className="mb-2 text-lg text-text/70">お疲れさまでした</p>
          <p className="text-4xl font-bold text-primary">{formatElapsed(result.elapsedMs)}</p>
          <p className="mt-2 text-sm text-text/60">
            {modeLabel(result.mode, result.inputMethod, result.autoTotalSeconds)}
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-2">
          <Button onClick={() => navigate('/practice')}>もう一度</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            トップへ
          </Button>
        </div>
      </div>
    </Layout>
  );
}
