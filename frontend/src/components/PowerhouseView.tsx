import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, DollarSign, Landmark, AlertTriangle } from 'lucide-react';
import { fetchCountryData } from '../lib/dataService';
import type { CountryData } from '../lib/types';
import clsx from 'clsx';

const POWERHOUSES = [
    { code: 'USA', name: 'USA', color: 'border-blue-500', shadow: 'shadow-blue-500/20', flag: '🇺🇸' },
    { code: 'CHN', name: 'Kina', color: 'border-red-500', shadow: 'shadow-red-500/20', flag: '🇨🇳' },
    { code: 'EUU', name: 'EU', color: 'border-blue-400', shadow: 'shadow-blue-400/20', flag: '🇪🇺' },
    { code: 'RUS', name: 'Ryssland', color: 'border-green-500', shadow: 'shadow-green-500/20', flag: '🇷🇺' },
];

export const PowerhouseView: React.FC = () => {
    const [data, setData] = useState<Record<string, CountryData | null>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const promises = POWERHOUSES.map(p => fetchCountryData(p.code));
            const results = await Promise.all(promises);

            const newData: Record<string, CountryData | null> = {};
            results.forEach((result, index) => {
                if (result) {
                    newData[POWERHOUSES[index].code] = result;
                }
            });
            setData(newData);
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto mt-16 mb-20 px-4">
            <div className="flex items-center gap-3 mb-8">
                <Landmark className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                    Ekonomiska Stormakter
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {POWERHOUSES.map((powerhouse) => {
                    const countryData = data[powerhouse.code];
                    const isLoading = !countryData && loading;

                    return (
                        <motion.div
                            key={powerhouse.code}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={clsx(
                                "relative overflow-hidden rounded-2xl border bg-slate-900/40 backdrop-blur-xl p-6",
                                powerhouse.color,
                                powerhouse.shadow,
                                "shadow-lg hover:shadow-xl transition-shadow"
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{powerhouse.flag}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{powerhouse.name}</h3>
                                        <span className={clsx(
                                            "text-xs font-semibold px-2 py-0.5 rounded-full border",
                                            countryData?.status === 'Success' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                countryData?.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                    countryData?.status === 'Danger' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                                        'bg-slate-700 text-slate-400 border-slate-600'
                                        )}>
                                            {isLoading ? 'Hämtar...' : (countryData?.healthIndex !== null ? `${countryData?.healthIndex}/100` : 'Data Saknas')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="space-y-4">
                                {/* GDP Growth */}
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm">Tillväxt</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={clsx(
                                            "font-mono font-bold block",
                                            countryData?.metrics.gdpGrowth.value === null ? 'text-slate-500' :
                                                (countryData?.metrics.gdpGrowth.value ?? 0) > 2 ? 'text-green-400' : 'text-red-400'
                                        )}>
                                            {isLoading ? '-' : countryData?.metrics.gdpGrowth.value !== null ? `${countryData?.metrics.gdpGrowth.value.toFixed(1)}%` : 'Saknas'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 block">
                                            {countryData?.metrics.gdpGrowth.source} {countryData?.metrics.gdpGrowth.year}
                                        </span>
                                    </div>
                                </div>

                                {/* Inflation */}
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Activity className="w-4 h-4" />
                                        <span className="text-sm">Inflation</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={clsx(
                                            "font-mono font-bold block",
                                            countryData?.metrics.inflation.value === null ? 'text-slate-500' :
                                                (countryData?.metrics.inflation.value ?? 100) < 3 ? 'text-green-400' : 'text-red-400'
                                        )}>
                                            {isLoading ? '-' : countryData?.metrics.inflation.value !== null ? `${countryData?.metrics.inflation.value.toFixed(1)}%` : 'Saknas'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 block">
                                            {countryData?.metrics.inflation.source} {countryData?.metrics.inflation.year}
                                        </span>
                                    </div>
                                </div>

                                {/* Debt */}
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="text-sm">Statsskuld</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={clsx(
                                            "font-mono font-bold block",
                                            countryData?.metrics.debtToGdp.value === null ? 'text-slate-500' :
                                                (countryData?.metrics.debtToGdp.value ?? 0) < 60 ? 'text-green-400' : 'text-yellow-400'
                                        )}>
                                            {isLoading ? '-' : countryData?.metrics.debtToGdp.value !== null ? `${countryData?.metrics.debtToGdp.value.toFixed(1)}%` : 'Saknas'}
                                        </span>
                                        <span className="text-[10px] text-slate-500 block">
                                            {countryData?.metrics.debtToGdp.source} {countryData?.metrics.debtToGdp.year}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Missing Data Warning */}
                            {countryData && (countryData.metrics.debtToGdp === null || countryData.metrics.gdpGrowth === null) && (
                                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Viss data ej rapporterad till Världsbanken</span>
                                </div>
                            )}

                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
