import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, Zap } from 'lucide-react';
import type { CountryData } from '../lib/types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ComparisonViewProps {
    countries: CountryData[];
    onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ countries, onClose }) => {
    if (countries.length === 0) return null;

    const pillarData = [
        { name: 'Liquidity', ...countries.reduce((acc, c) => ({ ...acc, [c.name]: c.pillars.liquidity }), {}) },
        { name: 'Burn Rate', ...countries.reduce((acc, c) => ({ ...acc, [c.name]: c.pillars.burnRate }), {}) },
        { name: 'Debt Structure', ...countries.reduce((acc, c) => ({ ...acc, [c.name]: c.pillars.debtStructure }), {}) },
        { name: 'Growth', ...countries.reduce((acc, c) => ({ ...acc, [c.name]: c.pillars.realGrowth }), {}) },
        { name: 'Demographics', ...countries.reduce((acc, c) => ({ ...acc, [c.name]: c.pillars.demographics }), {}) },
    ];

    const colors = ['#2ECC71', '#3498DB', '#9B59B6', '#F1C40F', '#E74C3C'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[var(--color-eco-card)] border border-slate-700 rounded-2xl p-6 shadow-2xl"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Comparative Analysis</h2>
                    <p className="text-sm text-[var(--color-eco-text-muted)]">Side-by-side analysis of {countries.length} selected economies</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Radar Chart for Pillars */}
                <div className="h-[400px] bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                    <h3 className="text-lg font-medium text-slate-300 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Economic Pillars (%)
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={pillarData}>
                            <PolarGrid stroke="#475569" />
                            <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                            {countries.map((country, idx) => (
                                <Radar
                                    key={country.id}
                                    name={country.name}
                                    dataKey={country.name}
                                    stroke={colors[idx % colors.length]}
                                    fill={colors[idx % colors.length]}
                                    fillOpacity={0.4}
                                />
                            ))}
                            <Legend />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart for Health Index */}
                <div className="h-[400px] bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                    <h3 className="text-lg font-medium text-slate-300 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Health Index (0-100)
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={countries}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            />
                            <Bar dataKey="healthIndex" name="Health Index" radius={[4, 4, 0, 0]}>
                                {countries.map((entry, index) => (
                                    <motion.rect
                                        key={`cell-${index}`}
                                        fill={entry.healthIndex === null ? '#475569' : (entry.healthIndex > 70 ? '#2ECC71' : entry.healthIndex > 40 ? '#F1C40F' : '#E74C3C')}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="mt-12 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="py-4 px-4 text-slate-400 font-medium whitespace-nowrap">Metric</th>
                            {countries.map(c => (
                                <th key={c.id} className="py-4 px-4 text-white font-bold text-center">{c.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="py-4 px-4 text-slate-400 whitespace-nowrap">GDP Growth (%)</td>
                            {countries.map(c => (
                                <td key={c.id} className="py-4 px-4 text-white text-center">
                                    {c.metrics.gdpGrowth.value !== null ? `${c.metrics.gdpGrowth.value.toFixed(1)}%` : 'N/A'}
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="py-4 px-4 text-slate-400 whitespace-nowrap">Inflation (%)</td>
                            {countries.map(c => (
                                <td key={c.id} className="py-4 px-4 text-white text-center">
                                    {c.metrics.inflation.value !== null ? `${c.metrics.inflation.value.toFixed(1)}%` : 'N/A'}
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="py-4 px-4 text-slate-400 whitespace-nowrap">Public Debt (% of GDP)</td>
                            {countries.map(c => (
                                <td key={c.id} className="py-4 px-4 text-white text-center">
                                    {c.metrics.debtToGdp.value !== null && c.metrics.debtToGdp.value > 0 ? `${c.metrics.debtToGdp.value.toFixed(1)}%` : 'N/A'}
                                </td>
                            ))}
                        </tr>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="py-4 px-4 text-slate-400 whitespace-nowrap">Reserves (months)</td>
                            {countries.map(c => (
                                <td key={c.id} className="py-4 px-4 text-white text-center">
                                    {c.metrics.reservesMonths.value !== null ? c.metrics.reservesMonths.value.toFixed(1) : 'N/A'}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};
