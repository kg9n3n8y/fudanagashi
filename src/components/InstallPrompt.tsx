import { useEffect, useState } from 'react';
import { dismissInstallPrompt, isInstallPromptDismissed } from '../utils/storage';
import { Button } from './Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIosDevice, setIsIosDevice] = useState(false);

  useEffect(() => {
    if (isInstallPromptDismissed() || isStandalone()) return;

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 800);

    setIsIosDevice(isIos());

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  const close = () => {
    dismissInstallPrompt();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-primary">ホーム画面に追加</h2>
        <p className="mb-4 text-sm leading-relaxed text-text/80">
          札流しをアプリのように使えます。オフラインでも練習できます。
        </p>

        {deferredPrompt ? (
          <Button
            onClick={async () => {
              await deferredPrompt.prompt();
              await deferredPrompt.userChoice;
              close();
            }}
          >
            インストール
          </Button>
        ) : isIosDevice ? (
          <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm text-text/80">
            <li>画面下の共有ボタンをタップ</li>
            <li>「ホーム画面に追加」を選択</li>
            <li>「追加」をタップ</li>
          </ol>
        ) : (
          <p className="mb-4 text-sm text-text/80">
            ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選んでください。
          </p>
        )}

        <div className="mt-3">
          <Button variant="ghost" onClick={close}>
            後で
          </Button>
        </div>
      </div>
    </div>
  );
}
