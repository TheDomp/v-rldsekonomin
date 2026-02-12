import React from 'react';
import { motion } from 'framer-motion';

interface LoadingCardProps {
    code: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ code }) => {
    return (
        <motion.div
            layoutId={`card-loading-${code}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-xl p-6 border-l-4 border-l-blue-500/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* Header skeleton */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-6 rounded bg-slate-700/50 animate-pulse" />
                        <div className="h-6 w-32 rounded bg-slate-700/50 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
                        <span className="text-xs text-blue-400 font-mono animate-pulse">
                            Fetching data for {code}...
                        </span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-700/30 animate-pulse flex items-center justify-center">
                    <span className="text-slate-600 text-lg">?</span>
                </div>
            </div>

            {/* Metaphor skeleton */}
            <div className="mb-6">
                <div className="h-4 w-3/4 rounded bg-slate-700/30 animate-pulse" />
            </div>

            {/* Metrics grid skeleton */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {['Growth', 'Inflation', 'Debt'].map((label) => (
                    <div key={label} className="p-2 rounded-lg bg-white/5 flex flex-col items-center">
                        <span className="text-[10px] uppercase text-slate-500 mb-1">{label}</span>
                        <div className="h-4 w-10 rounded bg-slate-700/30 animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Runway skeleton */}
            <div className="mt-2">
                <div className="h-3 w-full rounded-full bg-slate-700/30 animate-pulse" />
            </div>
        </motion.div>
    );
};
