/**
 * CampaignCard - Industrial Brutalist
 * Corner notch, hard shadow, neon progress
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Campaign } from '../types';
import { Countdown } from './Countdown';
import { formatAmount, calculateProgress } from '../lib/api';

interface CampaignCardProps {
  campaign: Campaign;
  index?: number;
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const progress = calculateProgress(campaign.raised, campaign.goal);
  const sectionNum = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <Link to={`/campaign/${campaign.id}`} className="block group">
        <div className="card h-full">
          {/* Header strip */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
            <div className="flex items-center gap-3">
              <span className={`status-dot ${campaign.status !== 'active' ? 'opacity-30 !bg-zinc-500' : ''}`} />
              <span className="mono text-xs text-zinc-500">{sectionNum}</span>
            </div>
            <span className={`badge ${campaign.status === 'active' ? 'badge-active' : 'badge-completed'}`}>
              {campaign.status}
            </span>
          </div>

          {/* Content */}
          <div className="card-content">
            <h3 className="font-display text-lg font-bold text-zinc-50 mb-2 line-clamp-1 group-hover:text-accent transition-colors">
              {campaign.title}
            </h3>
            <p className="text-sm text-zinc-500 mb-6 line-clamp-2">
              {campaign.description || 'No description available'}
            </p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex justify-between items-center">
              <div>
                <span className="data text-lg">${formatAmount(campaign.raised)}</span>
                <span className="text-zinc-600 text-sm ml-2">
                  / ${formatAmount(campaign.goal || 0)}
                </span>
              </div>

              {campaign.deadline && campaign.status === 'active' && (
                <Countdown deadline={campaign.deadline} />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
