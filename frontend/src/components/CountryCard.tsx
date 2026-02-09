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

    return (
        <motion.div
            layoutId={`card-${country.id}`}
            className="bg-[var(--color-eco-card)] rounded-xl p-6 cursor-pointer border border-slate-700/50 hover:border-slate-500/50 transition-colors shadow-lg relative overflow-hidden group"
            onClick={() => onClick(country)}
            whileHover={{ y: -5, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Background Glow Effect */}
            <div className={clsx("absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity", statusBg)} />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">{country.name}</h2>
                    <div className="flex gap-2 text-sm text-[var(--color-eco-text-muted)] font-mono">
                        <span>{country.id}</span>
                        <span>•</span>
                        <span>Data: {country.dataYear}</span>
                    </div>
                </div>
                <div className={clsx("flex flex-col items-center justify-center w-16 h-16 rounded-full bg-slate-800 border-2", statusColor, getStatusBorderColor(country.status))}>
                    <span className="text-lg font-bold">{country.healthIndex}</span>
                </div>
            </div>

            <div className="mb-4">
                <span className={clsx("px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-slate-800", statusColor)}>
                    {country.status}
                </span>
            </div>

            <p className="text-sm text-[var(--color-eco-text-muted)] italic min-h-[3rem]">
                "{country.metaphor}"
            </p>

            <FiscalRunway months={country.metrics.reservesMonths} />

        </motion.div>
    );
};
