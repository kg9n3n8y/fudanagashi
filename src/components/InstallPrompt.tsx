import { useEffect, useState } from 'react';
import {
  detectInstallPlatform,
  getManualInstallGuide,
  getNativeInstallButtonLabel,
  shareForInstall,
  supportsShareInstall,
  type InstallPlatform,
} from '../utils/install';
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

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<InstallPlatform>('other');
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    if (isInstallPromptDismissed() || isStandalone()) return;

    setPlatform(detectInstallPlatform());

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 800);

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

  const manualGuide = getManualInstallGuide(platform);
  const canNativeInstall = deferredPrompt !== null;
  const canShareInstall = supportsShareInstall(platform);

  const handleManualInstall = async () => {
    if (canShareInstall) {
      const result = await shareForInstall();
      if (result === 'unavailable') {
        setShowManualGuide(true);
      }
      return;
    }

    setShowManualGuide((prev) => !prev);
  };

  const manualButtonLabel = canShareInstall
    ? (manualGuide.shareButtonLabel ?? manualGuide.buttonLabel)
    : manualGuide.buttonLabel;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-primary">ホーム画面に追加</h2>
        <p className="mb-4 text-sm leading-relaxed text-text/80">
          札流しをアプリのように使えます。オフラインでも練習できます。
        </p>

        {canNativeInstall ? (
          <Button
            onClick={async () => {
              await deferredPrompt.prompt();
              await deferredPrompt.userChoice;
              close();
            }}
          >
            {getNativeInstallButtonLabel(platform)}
          </Button>
        ) : (
          <div className="space-y-3">
            <Button onClick={handleManualInstall}>{manualButtonLabel}</Button>
            {canShareInstall && manualGuide.shareHint && (
              <p className="text-sm leading-relaxed text-text/80">{manualGuide.shareHint}</p>
            )}
            {(showManualGuide || !canShareInstall) && (
              <div className="rounded-xl bg-bg px-4 py-3 text-sm text-text/80">
                {manualGuide.steps ? (
                  <ol className="list-decimal space-y-2 pl-5">
                    {manualGuide.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p>{manualGuide.description}</p>
                )}
              </div>
            )}
            {canShareInstall && !showManualGuide && (
              <button
                type="button"
                onClick={() => setShowManualGuide(true)}
                className="text-sm text-primary underline-offset-2 hover:underline"
              >
                手順を表示
              </button>
            )}
          </div>
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
