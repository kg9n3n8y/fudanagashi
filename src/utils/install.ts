export type InstallPlatform =
  | 'android-chrome'
  | 'desktop-chrome'
  | 'desktop-edge'
  | 'ios-safari'
  | 'ios-other'
  | 'desktop-safari'
  | 'firefox'
  | 'other';

export interface ManualInstallGuide {
  buttonLabel: string;
  steps?: string[];
  description?: string;
}

export function detectInstallPlatform(): InstallPlatform {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isEdge = /edg\//.test(ua);
  const isChrome = /chrome/.test(ua) && !isEdge;
  const isFirefox = /firefox/.test(ua);
  const isSafari = /safari/.test(ua) && !isChrome && !isEdge;

  if (isIOS) return isSafari ? 'ios-safari' : 'ios-other';
  if (isAndroid) return 'android-chrome';
  if (isEdge) return 'desktop-edge';
  if (isChrome) return 'desktop-chrome';
  if (isFirefox) return 'firefox';
  if (isSafari) return 'desktop-safari';
  return 'other';
}

export function getNativeInstallButtonLabel(platform: InstallPlatform): string {
  switch (platform) {
    case 'android-chrome':
      return 'アプリをインストール';
    case 'desktop-chrome':
      return 'Chromeにインストール';
    case 'desktop-edge':
      return 'Edgeにインストール';
    default:
      return 'インストール';
  }
}

export function getManualInstallGuide(platform: InstallPlatform): ManualInstallGuide {
  switch (platform) {
    case 'ios-safari':
      return {
        buttonLabel: 'Safariでホーム画面に追加',
        steps: [
          '画面下の共有ボタン（□↑）をタップ',
          '「ホーム画面に追加」を選択',
          '「追加」をタップ',
        ],
      };
    case 'ios-other':
      return {
        buttonLabel: 'Safariで開いて追加',
        description:
          'iPhone・iPadではSafariでこのページを開き、共有メニューから「ホーム画面に追加」を選んでください。',
      };
    case 'android-chrome':
      return {
        buttonLabel: 'Chromeでインストール',
        steps: [
          'ブラウザ右上のメニュー（⋮）をタップ',
          '「アプリをインストール」または「ホーム画面に追加」を選択',
        ],
      };
    case 'desktop-chrome':
      return {
        buttonLabel: 'Chromeでインストール',
        steps: [
          'アドレスバー右のインストールアイコンをクリック',
          'またはメニュー（⋮）→「札流しをインストール」',
        ],
      };
    case 'desktop-edge':
      return {
        buttonLabel: 'Edgeでインストール',
        steps: [
          'アドレスバー右の「アプリで開く」をクリック',
          'またはメニュー（⋯）→「アプリ」→「このサイトをアプリとしてインストール」',
        ],
      };
    case 'desktop-safari':
      return {
        buttonLabel: 'SafariでDockに追加',
        steps: ['メニューバーの「ファイル」→「Dockに追加」'],
      };
    case 'firefox':
      return {
        buttonLabel: 'Firefoxで追加',
        description:
          'Firefoxではメニュー（≡）→「インストール」から追加できる場合があります。未対応の場合はChromeやEdgeのご利用をおすすめします。',
      };
    default:
      return {
        buttonLabel: 'ブラウザからインストール',
        description:
          'ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選んでください。',
      };
  }
}
