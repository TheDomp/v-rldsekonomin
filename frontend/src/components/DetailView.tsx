import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CountryData } from '../lib/types';
import { X, TrendingUp, Users, Wallet, Activity, ShieldCheck } from 'lucide-react';
import { WarningSignal } from './WarningSignal';
import { getStatusColor } from '../lib/healthEngine';
import clsx from 'clsx';

interface DetailViewProps {
    country: CountryData | null;
    onClose: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ country, onClose }) => {
    if (!country) return null;

    const statusColor = getStatusColor(country.status);

    return (
        <AnimatePresence>
            {country && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[var(--color-eco-card)] w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        layoutId={`card-${country.id}`}
                    >
                        {/* Header */}
                        <div className="relative p-8 pb-4">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-700 transition-colors"
                            >
                                <X className="w-6 h-6 text-[var(--color-eco-text-muted)]" />
                            </button>

                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-4xl">{/* Flag could go here */}</span>
                                <h2 className="text-4xl font-bold">{country.name}</h2>
                            </div>
                            <div className="flex items-center gap-4 text-[var(--color-eco-text-muted)]">
                                <span className="font-mono">{country.id}</span>
                                <span>•</span>
                                <span className={clsx("font-bold", statusColor)}>{country.status} Economy</span>
                            </div>
                        </div>

                        <div className="p-8 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Left Column: Health Pillars */}
                            <div>
                                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Activity className="text-[var(--color-eco-success)]" />
                                    Hälso-Index: <span className={statusColor}>{country.healthIndex}</span>
                                </h3>

                                <div className="space-y-6">
                                    <PillarRow title="Likviditet" value={country.pillars.liquidity} icon={<Wallet />} color="bg-blue-500" />
                                    <PillarRow title="Burn Rate" value={country.pillars.burnRate} icon={<TrendingUp />} color="bg-red-500" />
                                    <PillarRow title="Skuldstruktur" value={country.pillars.debtStructure} icon={<ShieldCheck />} color="bg-purple-500" />
                                    <PillarRow title="Real Tillväxt" value={country.pillars.realGrowth} icon={<TrendingUp />} color="bg-green-500" />
                                    <PillarRow title="Demografi" value={country.pillars.demographics} icon={<Users />} color="bg-orange-500" />
                                </div>

                                <div className="mt-8 p-4 bg-slate-800/50 rounded-lg italic text-[var(--color-eco-text-muted)] border-l-4 border-slate-600">
                                    "{country.metaphor}"
                                </div>
                            </div>

                            {/* Right Column: Deep Dive & Warnings */}
                            <div>
                                <h3 className="text-xl font-semibold mb-6 text-[var(--color-eco-warning)] flex items-center gap-2">
                                    <AlertTriangle className="text-[var(--color-eco-warning)]" />
                                    Osynliga Varningssignaler
                                </h3>

                                <div className="space-y-4">
                                    <WarningSignal
                                        title="Credit-to-GDP Gap"
                                        value={country.metrics.creditToGdpGap || 0}
                                        unit="%"
                                        threshold={10}
                                        isUpperLimit={true}
                                        description="Avvikelse från långsiktig trend. Över 10% indikerar överhettning."
                                    />
                                    <WarningSignal
                                        title="Debt Service Ratio (DSR)"
                                        value={country.metrics.debtServiceRatio || 0}
                                        unit="%"
                                        threshold={20}
                                        isUpperLimit={true}
                                        description="Andel av inkomst som går till räntor och amorteringar."
                                    />
                                    <WarningSignal
                                        title="REER Misalignment"
                                        value={country.metrics.reerMisalignment || 0}
                                        unit="%"
                                        threshold={10}
                                        isUpperLimit={true}
                                        description="Valutans övervärdering mot fundamenta."
                                    />
                                </div>

                                <div className="mt-8">
                                    <h4 className="font-semibold mb-4 text-slate-300">Ekonomiska Nyckeltal</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <StatBox
                                            label="Reserver (mån)"
                                            value={country.metrics.reservesMonths !== null ? country.metrics.reservesMonths.toFixed(1) : 'Saknas'}
                                        />
                                        <StatBox
                                            label="Statsskuld / BNP"
                                            value={country.metrics.debtToGdp !== null && country.metrics.debtToGdp > 0 ? `${country.metrics.debtToGdp.toFixed(1)}%` : 'Saknas'}
                                        />
                                        <StatBox
                                            label="Budgetunderskott"
                                            value={country.metrics.deficitGdp !== null ? `${country.metrics.deficitGdp}%` : 'Saknas'}
                                        />
                                        <StatBox
                                            label="Dollarberoende"
                                            value={country.metrics.debtUsdShare !== null ? `${country.metrics.debtUsdShare}%` : 'Saknas'}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PillarRow = ({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) => (
    <div>
        <div className="flex justify-between items-center mb-1 text-sm">
            <div className="flex items-center gap-2 text-[var(--color-eco-text-muted)]">
                {React.cloneElement(icon, { className: "w-4 h-4" })}
                {title}
            </div>
            <span className="font-bold">{value}/100</span>
        </div>
        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
            <motion.div
                className={clsx("h-full", color)}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
        </div>
    </div>
);

const StatBox = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-slate-800 p-3 rounded border border-slate-700">
        <div className="text-xs text-[var(--color-eco-text-muted)]">{label}</div>
        <div className="font-mono font-bold text-lg">{value}</div>
    </div>
);

import { AlertTriangle } from 'lucide-react';
