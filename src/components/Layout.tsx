import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
  headerCenter?: ReactNode;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  mainClassName?: string;
  children: ReactNode;
}

export function Layout({
  title,
  showBack,
  backTo = '/',
  backLabel = '←',
  headerCenter,
  leftAction,
  rightAction,
  mainClassName = 'px-4 py-4',
  children,
}: LayoutProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg text-text">
      <header className="sticky top-0 z-10 grid grid-cols-[1fr_auto_1fr] items-center border-b border-primary/10 bg-bg/95 px-4 py-3 backdrop-blur-sm">
        <div className="justify-self-start">
          {leftAction}
          {showBack && (
            <Link
              to={backTo}
              className="shrink-0 rounded-lg border border-primary/25 bg-surface px-3.5 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/40 hover:bg-white"
              aria-label={backLabel}
            >
              {backLabel}
            </Link>
          )}
        </div>
        <div className="justify-self-center">
          {headerCenter}
          {!headerCenter && title && (
            <h1 className="truncate text-xl font-bold text-primary">{title}</h1>
          )}
        </div>
        <div className="justify-self-end">{rightAction}</div>
      </header>
      <main className={`flex min-h-0 flex-1 flex-col ${mainClassName}`}>{children}</main>
    </div>
  );
}
