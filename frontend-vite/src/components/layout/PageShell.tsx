/**
 * Inner-page shell: dimmed hero video + navy overlay (no Midjourney needed)
 */

import type { ReactNode } from 'react';
import { VideoBackground } from '../VideoBackground';
import { Footer } from '../Footer';

interface PageShellProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
}

export function PageShell({ children, className = '', showFooter = true }: PageShellProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <VideoBackground />
        <div className="absolute inset-0 bg-background/88" />
      </div>

      <div className="relative z-10 pt-28 pb-16">
        {children}
      </div>

      {showFooter && <Footer />}
    </div>
  );
}
