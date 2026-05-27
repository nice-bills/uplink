import { useMemo } from 'react';
import {
  PAGE_BACKGROUNDS,
  type MediaAsset,
  type PageBackgroundKey,
} from '@/lib/media';
import { cn } from '@/lib/utils';

interface CinematicBackgroundProps {
  /** Route-specific preset; defaults to home hero video */
  background?: PageBackgroundKey | MediaAsset;
  className?: string;
  /** Ken Burns on stills */
  animateImage?: boolean;
}

function resolveAsset(background?: PageBackgroundKey | MediaAsset): MediaAsset {
  if (!background) return PAGE_BACKGROUNDS.home;
  if (typeof background === 'string') return PAGE_BACKGROUNDS[background];
  return background;
}

export function CinematicBackground({
  background,
  className = '',
  animateImage = true,
}: CinematicBackgroundProps) {
  const asset = useMemo(() => resolveAsset(background), [background]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {asset.kind === 'video' ? (
        <video
          key={asset.src}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={asset.poster}
        >
          <source src={asset.src} type="video/mp4" />
        </video>
      ) : (
        <img
          src={asset.src}
          alt=""
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            animateImage && 'animate-ken-burns',
          )}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}

/** @deprecated Use CinematicBackground */
export function VideoBackground(props: Omit<CinematicBackgroundProps, 'background'>) {
  return <CinematicBackground background="home" {...props} />;
}
