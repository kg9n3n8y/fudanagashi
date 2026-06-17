import { Button } from './Button';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-primary">使い方</h2>
        <div className="space-y-4 text-sm leading-relaxed text-text/90">
          <section>
            <h3 className="mb-1 font-bold text-primary">札流しとは</h3>
            <p>100枚の取り札の決まり字を言う練習です。</p>
          </section>
          <section>
            <h3 className="mb-1 font-bold text-primary">練習の流れ</h3>
            <p>スワイプ(タップも可)で開始し、100枚終えるとかかった時間が表示されます。</p>
          </section>
          <section>
            <h3 className="mb-1 font-bold text-primary">操作方法</h3>
            <p>
              <strong>スワイプ:</strong> スワイプで上下左右などに一定距離以上札を動かすことで次へ進みます。
              <br />
              <strong>タップ:</strong> タップすることで次へ進みます。
            </p>
          </section>
          <section>
            <h3 className="mb-1 font-bold text-primary">練習モード</h3>
            <p>
              <strong>手動:</strong> 自分のペースで進めます。結果は最大5件まで記録されます。
              <br />
              <strong>自動:</strong> 設定した時間で100枚が流れます。結果は記録されません。
            </p>
          </section>
          <section>
            <h3 className="mb-1 font-bold text-primary">決まり字</h3>
            <p>「決まり字を見る」で確認できます。</p>
          </section>
          <section>
            <h3 className="mb-1 font-bold text-primary">ホーム画面に追加</h3>
            <p>ホーム画面に追加するとアプリのように使えて、オフラインでも練習できます。</p>
          </section>
        </div>
        <div className="mt-6">
          <Button variant="secondary" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
}
