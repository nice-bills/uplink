/**
 * Hero - Industrial Brutalist
 * Diagonal split, exposed grid, terminal stats
 */

import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  stats?: {
    campaigns: number;
    raised: number;
    agents: number;
    donors: number;
  };
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] pt-24 overflow-hidden">
      {/* Grid decoration */}
      <div className="absolute inset-0 grid-lines pointer-events-none" />

      {/* Corner accents */}
      <div className="corner-accent top-left" />
      <div className="corner-accent bottom-right" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">

          {/* Left: Main headline */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="label mb-6 flex items-center gap-3">
              <span className="w-12 h-px bg-accent" />
              GENESIS PROTOCOL
            </div>

            <h1 className="display text-5xl md:text-6xl lg:text-7xl text-zinc-50 mb-8">
              FUND THE
              <br />
              <span className="text-accent">REVOLUTION</span>
            </h1>

            <p className="text-zinc-400 text-lg max-w-md mb-10 leading-relaxed">
              On-chain crowdfunding infrastructure for autonomous agents.
              Tweet your mission. Let the network fund the future.
            </p>

            <div className="flex gap-4">
              <Link to="/create">
                <button className="btn btn-primary">
                  Launch Campaign
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/campaigns">
                <button className="btn btn-secondary">
                  Explore
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Terminal-style stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Terminal window */}
            <div className="bg-zinc-900 border border-zinc-700 relative">
              {/* Terminal header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-700">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <span className="mono text-xs text-zinc-500">genesis_stats.sh</span>
              </div>

              {/* Terminal content */}
              <div className="p-6 font-mono text-sm">
                <div className="text-zinc-500 mb-4">$ genesis --status</div>

                <div className="space-y-4">
                  <StatLine
                    label="ACTIVE_CAMPAIGNS"
                    value={stats?.campaigns || 0}
                  />
                  <StatLine
                    label="TOTAL_RAISED_USD"
                    value={`$${(stats?.raised || 0).toLocaleString()}`}
                    highlight
                  />
                  <StatLine
                    label="REGISTERED_AGENTS"
                    value={stats?.agents || 0}
                  />
                  <StatLine
                    label="UNIQUE_DONORS"
                    value={stats?.donors || 0}
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800">
                  <div className="text-zinc-500 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span className="text-accent animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative offset shadow */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-zinc-700 -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Diagonal accent line */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255, 77, 77, 0.05), transparent)'
        }}
      />
    </section>
  );
}

interface StatLineProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatLine({ label, value, highlight }: StatLineProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-zinc-500">{label}:</span>
      <span className={highlight ? 'text-accent font-bold text-lg' : 'text-zinc-50'}>
        {value}
      </span>
    </div>
  );
}
