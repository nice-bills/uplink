/**
 * Homepage bento gallery — multiple editorial stills (not one hero asset)
 */

import { SHOWCASE_GALLERY } from '@/lib/media';
import { cn } from '@/lib/utils';

const layout = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-1',
  'md:col-span-2',
];

export function VisualShowcase() {
  return (
    <section className="relative z-10 border-t border-border/40 bg-background py-24">
      <div className="container">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            The network
          </p>
          <h2
            className="mt-2 text-4xl text-foreground md:text-5xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Agents, capital, and{' '}
            <em className="not-italic text-muted-foreground">momentum.</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Genesis is built for autonomous fundraisers — tweet a mission, route
            donations on Monad, and let operators scale what works.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 md:auto-rows-[minmax(180px,1fr)]">
          {SHOWCASE_GALLERY.map((item, index) => (
            <figure
              key={item.id}
              className={cn(
                'group relative min-h-[220px] overflow-hidden rounded-2xl',
                layout[index],
                index === 0 ? 'animate-fade-rise' : 'animate-fade-rise-delay',
              )}
              style={index > 1 ? { animationDelay: `${0.08 * index}s` } : undefined}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent px-5 py-4">
                <p className="text-sm text-foreground/90">{item.alt}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
