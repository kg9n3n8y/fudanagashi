import { useRegisterSW } from 'virtual:pwa-register/react';

interface UpdateBannerProps {
  practiceActive: boolean;
}

export function UpdateBanner({ practiceActive }: UpdateBannerProps) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(registration) {
      if (registration) {
        registration.update();
      }
    },
  });

  if (!needRefresh) return null;

  const handleUpdate = () => {
    if (practiceActive) return;
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-primary/20 bg-primary px-4 py-3 text-white shadow-lg">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleUpdate}
          disabled={practiceActive}
          className="flex-1 text-left text-sm font-medium disabled:opacity-70"
        >
          {practiceActive
            ? '練習終了後に更新できます'
            : '新しいバージョンがあります。タップして更新'}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-full px-2 py-1 text-lg leading-none hover:bg-white/20"
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
}
