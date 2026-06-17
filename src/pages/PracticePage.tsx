import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { fudalist, TORII_IMAGE } from '../data/fudalist';
import { useSettingsContext } from '../contexts/SettingsContext';
import type { DisplayFuda, Fuda } from '../types';
import {
  getAutoIntervalMs,
  getFudaImage,
  preloadFudaImages,
  shuffleArray,
} from '../utils/practice';
import { Button } from '../components/Button';
import { CardStack } from '../components/CardStack';
import { Layout } from '../components/Layout';
import { Stopwatch } from '../components/Stopwatch';

const TOTAL_FUDA = 100;

interface PracticeSession {
  order: Fuda[];
  imageSrcs: string[];
}

function createSession(order: Fuda[]): PracticeSession {
  return {
    order,
    imageSrcs: order.map((fuda) => getFudaImage(fuda)),
  };
}

function getDisplay(session: PracticeSession, fudaIndex: number): DisplayFuda | null {
  if (fudaIndex < 0 || fudaIndex >= TOTAL_FUDA) return null;
  return {
    src: session.imageSrcs[fudaIndex],
    kimariji: session.order[fudaIndex].kimariji,
  };
}

export function PracticePage() {
  const navigate = useNavigate();
  const { settings } = useSettingsContext();
  const [session] = useState(() =>
    createSession(shuffleArray([...fudalist])),
  );
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showKimariji, setShowKimariji] = useState(false);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);

  const isStarted = currentIndex >= 0;
  const isFinished = currentIndex >= TOTAL_FUDA;
  const isAuto = settings.practiceMode === 'auto';

  const currentDisplay = useMemo(() => {
    if (!isStarted || isFinished) return { src: TORII_IMAGE, kimariji: '' };
    return getDisplay(session, currentIndex) ?? { src: TORII_IMAGE, kimariji: '' };
  }, [currentIndex, isFinished, isStarted, session]);

  const nextDisplay = useMemo(() => {
    if (isFinished) return null;
    if (!isStarted) return getDisplay(session, 0);
    if (currentIndex + 1 >= TOTAL_FUDA) return null;
    return getDisplay(session, currentIndex + 1);
  }, [currentIndex, isFinished, isStarted, session]);

  const clearAutoTimer = () => {
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  const finishPractice = () => {
    clearAutoTimer();
    const elapsedMs = timerStart ? Date.now() - timerStart : 0;
    navigate('/result', {
      state: {
        elapsedMs,
        mode: settings.practiceMode,
        inputMethod: settings.inputMethod,
        autoTotalSeconds: settings.autoTotalSeconds,
      },
    });
  };
  const advance = () => {
    if (isFinished) return;

    if (!isStarted) {
      setTimerStart((prev) => (prev === null ? Date.now() : prev));
      setCurrentIndex(0);
      setShowKimariji(false);
      return;
    }

    if (currentIndex === TOTAL_FUDA - 1) {
      setCurrentIndex(TOTAL_FUDA);
      finishPractice();
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setShowKimariji(false);
  };

  const scheduleAutoAdvance = () => {
    clearAutoTimer();
    if (!isAuto || isFinished) return;
    const interval = getAutoIntervalMs(settings.autoTotalSeconds);
    autoTimerRef.current = window.setTimeout(() => {
      advance();
    }, interval);
  };

  useEffect(() => {
    const paths = [TORII_IMAGE, ...fudalist.flatMap((f) => [f.normal, f.reverse])];
    preloadFudaImages(paths);
  }, []);

  useEffect(() => {
    const { style: htmlStyle } = document.documentElement;
    const { style: bodyStyle } = document.body;
    const prevHtmlOverflow = htmlStyle.overflow;
    const prevBodyOverflow = bodyStyle.overflow;

    htmlStyle.overflow = 'hidden';
    bodyStyle.overflow = 'hidden';

    return () => {
      htmlStyle.overflow = prevHtmlOverflow;
      bodyStyle.overflow = prevBodyOverflow;
    };
  }, []);

  useEffect(() => {
    if (!isAuto || !isStarted || isFinished) {
      clearAutoTimer();
      return;
    }
    scheduleAutoAdvance();
    return clearAutoTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuto, isStarted, isFinished, currentIndex, settings.autoTotalSeconds]);

  useEffect(() => {
    const onVisibility = () => {
      if (!isAuto || !isStarted || isFinished) return;
      if (document.hidden) {
        pausedAtRef.current = Date.now();
        clearAutoTimer();
      } else if (pausedAtRef.current) {
        pausedAtRef.current = null;
        scheduleAutoAdvance();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuto, isStarted, isFinished, currentIndex]);

  const kimarijiText =
    isStarted && !isFinished ? session.order[currentIndex]?.kimariji ?? '' : '';

  const showCounter = isAuto && isStarted && !isFinished;

  return (
    <Layout
      showBack
      backTo="/"
      backLabel="トップへ"
      lockViewport
      headerCenter={
        <Stopwatch startTime={timerStart} running={currentIndex >= 0 && !isFinished} />
      }
      mainClassName="px-4 pb-3 pt-1"
    >
      <div
        className="flex flex-1 flex-col items-center gap-1 overflow-hidden overscroll-none"
        style={
          {
            '--practice-card-max-h': showCounter
              ? 'calc(100dvh - 10.75rem)'
              : 'calc(100dvh - 9.5rem)',
          } as CSSProperties
        }
      >
        <div
          className={`flex w-full shrink-0 items-center justify-center ${showCounter ? 'h-5' : 'h-0'}`}
        >
          {showCounter && (
            <p className="text-sm font-medium text-primary">
              {currentIndex + 1} / {TOTAL_FUDA}
            </p>
          )}
        </div>

        <div
          className="flex w-full shrink-0 items-center justify-center"
          style={{ height: 'var(--practice-card-max-h)' }}
        >
          <CardStack
            currentSrc={currentDisplay.src}
            nextSrc={nextDisplay?.src ?? null}
            inputMethod={isAuto ? 'tap' : settings.inputMethod}
            onAdvance={isAuto ? () => {} : advance}
            disabled={isAuto || isFinished}
          />
        </div>

        <div className="flex h-[4.25rem] w-full max-w-sm shrink-0 touch-manipulation items-start justify-center px-2 pt-0">
          {isAuto && !isStarted ? (
            <Button onClick={advance}>開始</Button>
          ) : showKimariji && kimarijiText ? (
            <p className="text-center text-3xl font-bold leading-tight text-accent sm:text-4xl">
              {kimarijiText}
            </p>
          ) : isStarted && !isFinished ? (
            <Button variant="secondary" onClick={() => setShowKimariji(true)}>
              決まり字を見る
            </Button>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
