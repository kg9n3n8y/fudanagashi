import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpModal } from '../components/HelpModal';
import { SettingsModal } from '../components/SettingsModal';
import { InstallPrompt } from '../components/InstallPrompt';
import { Layout } from '../components/Layout';
import { RecordList } from '../components/RecordList';
import { Button } from '../components/Button';
import { loadRecords } from '../utils/storage';

const APP_URL = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}`;

export function HomePage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(() => loadRecords());
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('URLをコピーしてください', APP_URL);
    }
  };

  return (
    <Layout
      title="札流し"
      leftAction={
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="rounded-lg border border-primary/25 bg-surface px-3.5 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/40 hover:bg-white"
        >
          使い方
        </button>
      }
      rightAction={
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="rounded-lg border border-primary/25 bg-surface px-3.5 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/40 hover:bg-white"
        >
          ⚙️ 設定
        </button>
      }
    >
      <div className="flex flex-1 flex-col gap-8">
        <section className="py-4 text-center">
          <Button className="min-h-14 py-4 text-xl" onClick={() => navigate('/practice')}>
            練習を始める
          </Button>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold text-primary">直近の記録</h2>
          <RecordList records={records} />
        </section>

        <section className="mt-auto pt-2 text-center">
          <button
            type="button"
            onClick={copyUrl}
            className="rounded-lg border border-primary/25 bg-surface px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/40 hover:bg-white"
          >
            {copied ? 'コピーしました！' : 'URLをコピー'}
          </button>
        </section>
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <InstallPrompt />
    </Layout>
  );
}
