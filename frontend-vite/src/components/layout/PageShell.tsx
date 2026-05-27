/**
 * Inner-page shell: dimmed hero video + navy overlay (no Midjourney needed)
 */

import type { ReactNode } from 'react';
import { CinematicBackground } from '../CinematicBackground';
import { Footer } from '../Footer';
import type { PageBackgroundKey } from '@/lib/media';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
  /** Per-route video or still — avoids one asset everywhere */
  background?: PageBackgroundKey;
  overlayOpacity?: 'default' | 'heavy' | 'light';
}

export function PageShell({
  children,
  className = '',
  showFooter = true,
  background = 'campaigns',
  overlayOpacity = 'default',
}: PageShellProps) {
  const overlayClass =
    overlayOpacity === 'heavy'
      ? 'bg-background/92'
      : overlayOpacity === 'light'
        ? 'bg-background/80'
        : 'bg-background/88';

  return (
    <div className={`relative min-h-screen ${className}`}>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <CinematicBackground background={background} />
        <div className={`absolute inset-0 ${overlayClass}`} />
      </div>

      <div className="relative z-10 pt-28 pb-16">
        {children}
      </div>

      {showFooter && <Footer />}
    </div>
  );
}
