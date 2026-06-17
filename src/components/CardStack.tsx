import { useCallback, useRef, useState } from 'react';
import type { InputMethod } from '../types';
import { getDragDistance } from '../utils/practice';

interface CardStackProps {
  currentSrc: string;
  nextSrc: string | null;
  inputMethod: InputMethod;
  onAdvance: () => void;
  disabled?: boolean;
}

const SNAP_BACK_MS = 250;
const SLIDE_OUT_MS = 300;
const CARD_SHADOW = 'drop-shadow-[0_8px_16px_rgba(44,44,44,0.12)]';
const CARD_IMAGE =
  'practice-card-image mx-auto block h-auto w-auto max-h-full max-w-full object-contain';

export function CardStack({
  currentSrc,
  nextSrc,
  inputMethod,
  onAdvance,
  disabled = false,
}: CardStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [animating, setAnimating] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const pointerId = useRef<number | null>(null);
  const hasDragged = useRef(false);

  const showStack = Boolean(nextSrc && inputMethod === 'swipe');

  const threshold = useCallback(() => {
    const el = containerRef.current;
    if (!el) return 80;
    const rect = el.getBoundingClientRect();
    return Math.min(rect.width, rect.height) * 0.25;
  }, []);

  const resetOffset = useCallback(() => {
    setAnimating(true);
    setOffset({ x: 0, y: 0 });
    window.setTimeout(() => setAnimating(false), SNAP_BACK_MS);
  }, []);

  const slideOut = useCallback(
    (dx: number, dy: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = dx / dist;
      const ny = dy / dist;
      const far = Math.max(rect.width, rect.height) * 1.2;

      setAnimating(true);
      setOffset({ x: nx * far, y: ny * far });
      window.setTimeout(() => {
        onAdvance();
        setOffset({ x: 0, y: 0 });
        setAnimating(false);
      }, SLIDE_OUT_MS);
    },
    [onAdvance],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || inputMethod !== 'swipe' || animating) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    pointerId.current = e.pointerId;
    hasDragged.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current || pointerId.current !== e.pointerId || inputMethod !== 'swipe') return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (getDragDistance(dx, dy) > 5) hasDragged.current = true;
    setOffset({ x: dx, y: dy });
  };

  const finishDrag = (clientX: number, clientY: number) => {
    if (!dragStart.current) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    dragStart.current = null;
    pointerId.current = null;

    if (getDragDistance(dx, dy) >= threshold()) {
      slideOut(dx, dy);
    } else {
      resetOffset();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    finishDrag(e.clientX, e.clientY);
  };

  const handleClick = () => {
    if (disabled || animating || hasDragged.current) return;
    onAdvance();
  };

  const transitionStyle = animating
    ? `transform ${offset.x === 0 && offset.y === 0 ? SNAP_BACK_MS : SLIDE_OUT_MS}ms ease-out`
    : 'none';

  return (
    <div
      ref={containerRef}
      className="practice-card-frame relative mx-auto flex h-full w-full max-w-[min(94vw,32rem)] touch-none select-none items-center justify-center"
      style={{ touchAction: inputMethod === 'swipe' ? 'none' : 'manipulation' }}
    >
      <div className="relative flex h-full max-h-full w-full items-center justify-center">
        {showStack && (
          <img
            src={nextSrc!}
            alt=""
            className={CARD_IMAGE}
            draggable={false}
          />
        )}
        <img
          src={currentSrc}
          alt="取り札"
          className={`${CARD_IMAGE} ${CARD_SHADOW} ${showStack ? 'absolute inset-0 m-auto' : ''} ${!disabled ? 'cursor-pointer' : ''}`}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: transitionStyle,
            zIndex: 1,
          }}
          draggable={false}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  );
}
