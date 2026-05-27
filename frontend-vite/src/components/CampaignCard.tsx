/**
 * Campaign card — glass surface, editorial type (no brutalist notches)
 */

import { Link } from 'react-router-dom';
import type { Campaign } from '../types';
import { Countdown } from './Countdown';
import { formatAmount, calculateProgress } from '../lib/api';
import { cn } from '@/lib/utils';

interface CampaignCardProps {
  campaign: Campaign;
  index?: number;
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const progress = calculateProgress(campaign.raised, campaign.goal);

  return (
    <article
      className={cn(
        'group animate-fade-rise',
        index > 0 && 'animate-fade-rise-delay',
      )}
      style={{ animationDelay: index > 1 ? `${0.1 * index}s` : undefined }}
    >
      <Link
        to={`/campaign/${campaign.id}`}
        className="liquid-glass block rounded-2xl p-6 transition-transform hover:scale-[1.01]"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <span
            className={cn(
              'text-xs uppercase tracking-widest',
              campaign.status === 'active'
                ? 'text-foreground'
                : 'text-muted-foreground',
            )}
          >
            {campaign.status}
          </span>
          {campaign.deadline && campaign.status === 'active' && (
            <Countdown deadline={campaign.deadline} />
          )}
        </div>

        <h3
          className="mb-2 line-clamp-2 text-xl text-foreground transition-colors group-hover:text-muted-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {campaign.title}
        </h3>

        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {campaign.description || 'No description yet.'}
        </p>

        <div className="mb-3 h-px w-full bg-border/80" />

        <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-foreground/90 transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          <span className="text-foreground">${formatAmount(campaign.raised)}</span>
          {' '}
          of ${formatAmount(campaign.goal || 0)} raised
        </p>
      </Link>
    </article>
  );
}
