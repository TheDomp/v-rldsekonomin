import React from 'react';
import { motion } from 'framer-motion';
import type { CountryData } from '../lib/types';
import { FiscalRunway } from './FiscalRunway';
import { getStatusColor, getStatusBgColor, getStatusBorderColor } from '../lib/healthEngine';
import clsx from 'clsx';

interface CountryCardProps {
    country: CountryData;
    onClick: (country: CountryData) => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country, onClick }) => {
    const statusColor = getStatusColor(country.status);
    const statusBg = getStatusBgColor(country.status);
    const statusBorder = getStatusBorderColor(country.status);

    return (
        <motion.div
            layoutId={`card-${country.id}`}
            className={clsx(
                "group relative overflow-hidden rounded-2xl border bg-slate-900/40 backdrop-blur-xl p-6 cursor-pointer",
                "border-slate-700/50 hover:border-slate-500/50 transition-all",
                "hover:shadow-xl hover:-translate-y-1",
                // Left border accent based on status
                country.status === 'Success' ? 'border-l-4 border-l-green-500' :
                    country.status === 'Warning' ? 'border-l-4 border-l-yellow-500' :
                        country.status === 'Danger' ? 'border-l-4 border-l-red-500' :
                            'border-l-4 border-l-slate-500'
            )}
            onClick={() => onClick(country)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Background Glow Effect */}
            <div className={clsx("absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity", statusBg)} />

            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className={`fi fi-${country.flagCode.toLowerCase()} w-8 h-6 rounded shadow-sm object-cover`} />
                        <h2 className="text-xl font-bold text-white group-hover:text-[var(--color-eco-success)] transition-colors">
                            {country.name}
                        </h2>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                        Data: {country.dataYear}
                    </span>
                </div>

                {/* Health Badge */}
                <div className={clsx(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-xl border backdrop-blur-md",
                    statusBg.replace('bg-', 'bg-').replace('500', '500/10'),
                    statusBorder,
                    statusColor
                )}>
                    <span className="text-lg font-bold">{country.healthIndex ?? '?'}</span>
                </div>
            </div>

            {/* Metaphor Quote */}
            <div className="mb-6 relative z-10">
                <p className="text-sm text-slate-400 italic">
                    "{country.metaphor}"
                </p>
            </div>

            {/* Key Metrics Mini-Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
                {/* Growth */}
                <div className="p-2 rounded-lg bg-white/5 flex flex-col items-center">
                    <span className="text-[10px] uppercase text-slate-500 mb-1">Growth</span>
                    <span className={clsx("font-mono font-bold text-sm whitespace-nowrap",
                        country.metrics.gdpGrowth.value === null ? 'text-slate-500' :
                            (country.metrics.gdpGrowth.value ?? 0) > 2 ? 'text-green-400' : 'text-red-400'
                    )}>
                        {country.metrics.gdpGrowth.value !== null ? `${country.metrics.gdpGrowth.value.toFixed(1)}%` : '-'}
                    </span>
                </div>

                {/* Inflation */}
                <div className="p-2 rounded-lg bg-white/5 flex flex-col items-center">
                    <span className="text-[10px] uppercase text-slate-500 mb-1">Inflation</span>
                    <span className={clsx("font-mono font-bold text-sm whitespace-nowrap",
                        country.metrics.inflation.value === null ? 'text-slate-500' :
                            (country.metrics.inflation.value ?? 0) < 3 ? 'text-green-400' : 'text-red-400'
                    )}>
                        {country.metrics.inflation.value !== null ? `${country.metrics.inflation.value.toFixed(1)}%` : '-'}
                    </span>
                </div>

                {/* Debt */}
                <div className="p-2 rounded-lg bg-white/5 flex flex-col items-center">
                    <span className="text-[10px] uppercase text-slate-500 mb-1">Debt</span>
                    <span className={clsx("font-mono font-bold text-sm whitespace-nowrap",
                        country.metrics.debtToGdp.value === null ? 'text-slate-500' :
                            (country.metrics.debtToGdp.value ?? 0) < 60 ? 'text-green-400' : 'text-yellow-400'
                    )}>
                        {country.metrics.debtToGdp.value !== null ? `${country.metrics.debtToGdp.value.toFixed(1)}%` : '-'}
                    </span>
                </div>
            </div>

            {/* Runway Meter (Compact) */}
            <div className="mt-2 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                <FiscalRunway months={country.metrics.reservesMonths.value} />
            </div>

        </motion.div>
    );
};
