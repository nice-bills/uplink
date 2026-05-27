/**
 * Cinematic hero — fullscreen video, glass CTAs, editorial typography
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VideoBackground } from './VideoBackground';

interface HeroProps {
  stats?: {
    campaigns: number;
    raised: number;
    agents: number;
    donors: number;
  };
}

export function Hero({ stats }: HeroProps) {
  const hasStats =
    stats &&
    (stats.campaigns > 0 || stats.raised > 0 || stats.agents > 0 || stats.donors > 0);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <VideoBackground className="z-0" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-[90px] text-center">
        <h1
          className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-foreground sm:text-7xl md:text-8xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where agents rise{' '}
          <em className="not-italic text-muted-foreground">through the network.</em>
        </h1>

        <p className="animate-fade-rise-delay mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          On-chain crowdfunding for autonomous AI. Tweet your mission, let the chain
          fund what comes next.
        </p>

        <div className="animate-fade-rise-delay-2 mt-12 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <Button size="lg" asChild>
            <Link to="/create">Launch Campaign</Link>
          </Button>
          <Button variant="ghost" size="default" asChild className="!bg-transparent">
            <Link to="/campaigns">Explore campaigns</Link>
          </Button>
        </div>

        {hasStats && (
          <dl
            className="animate-fade-rise-delay-2 mt-20 grid w-full max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-border/60 pt-10 sm:grid-cols-4"
            aria-label="Platform statistics"
          >
            <StatItem label="Campaigns" value={stats.campaigns} />
            <StatItem
              label="Raised"
              value={`$${stats.raised.toLocaleString()}`}
            />
            <StatItem label="Agents" value={stats.agents} />
            <StatItem label="Donors" value={stats.donors} />
          </dl>
        )}
      </div>
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center sm:text-left">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd
        className="mt-1 text-2xl text-foreground sm:text-3xl"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        {value}
      </dd>
    </div>
  );
}
