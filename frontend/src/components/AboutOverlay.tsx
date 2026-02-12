import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Activity, ShieldCheck, Cpu, Database, Server, Code } from 'lucide-react';
import clsx from 'clsx';

interface AboutOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutOverlay: React.FC<AboutOverlayProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto"
                onClick={onClose}
            >
                <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="relative w-full bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header with Close Button */}
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={onClose}
                                className="p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Gradient Background Decoration */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
                            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[120px]" />
                        </div>

                        <div className="relative p-8 md:p-12">
                            {/* Title Section */}
                            <div className="text-center mb-16 space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-blue-400 mb-2"
                                >
                                    <Activity className="w-4 h-4" />
                                    <span>SYSTEM ARCHITECTURE v1.0</span>
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
                                >
                                    Under the Hood of EcoHealth
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg text-slate-400 max-w-2xl mx-auto"
                                >
                                    We've built a modern platform to democratize global economic data.
                                    No "black box". Everything is open, tested, and driven by real-time APIs.
                                </motion.p>
                            </div>

                            {/* Visual Flow / Infographic */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

                                {/* Step 1: Data Sources */}
                                <InfographicCard
                                    icon={<Globe className="w-8 h-8 text-blue-400" />}
                                    title="Real-time Data & APIs"
                                    color="blue"
                                    delay={0.4}
                                >
                                    <div className="space-y-3 text-sm text-slate-400">
                                        <p>We don't fetch static files. We talk directly to the source.</p>
                                        <ul className="space-y-2 font-mono text-xs">
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span className="text-slate-300">World Bank Open Data API</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span className="text-slate-300">IMF & Eurostat (Q3 2024)</span>
                                            </li>
                                        </ul>
                                    </div>
                                </InfographicCard>

                                {/* Step 2: Analysis Engine */}
                                <InfographicCard
                                    icon={<Cpu className="w-8 h-8 text-green-400" />}
                                    title="Analysis Engine (Health Engine)"
                                    color="green"
                                    delay={0.6}
                                >
                                    <div className="space-y-3 text-sm text-slate-400">
                                        <p>Raw data is processed through our proprietary 'Health Engine'.</p>
                                        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                            <div className="flex justify-between text-xs font-mono mb-1">
                                                <span className="text-slate-500">ALGORITHM</span>
                                                <span className="text-green-400">ACTIVE</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {['Growth', 'Inflation', 'Debt', 'Liquidity', 'Demographics'].map(tag => (
                                                    <span key={tag} className="px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded text-[10px] border border-green-500/20">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </InfographicCard>

                                {/* Step 3: Quality & Tech */}
                                <InfographicCard
                                    icon={<ShieldCheck className="w-8 h-8 text-purple-400" />}
                                    title="QA & Tech Stack"
                                    color="purple"
                                    delay={0.8}
                                >
                                    <div className="space-y-3 text-sm text-slate-400">
                                        <p>Every update is automatically verified before reaching you.</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <TechItem icon={<Code className="w-3 h-3" />} label="React & Vite" />
                                            <TechItem icon={<Server className="w-3 h-3" />} label="Firebase" />
                                            <TechItem icon={<Database className="w-3 h-3" />} label="TypeScript" />
                                            <TechItem icon={<Activity className="w-3 h-3" />} label="Playwright Test" />
                                        </div>
                                    </div>
                                </InfographicCard>
                            </div>

                            {/* Footer / CTA */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.0 }}
                                className="mt-16 text-center pt-8 border-t border-slate-800"
                            >
                                <p className="text-sm text-slate-500 font-mono">
                                    PROJECT: ECOHEALTH MONITOR • STATUS: OPERATIONAL • LINKEDIN READY
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// Helper Components for Cleaner Code
const InfographicCard = ({ icon, title, children, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: "spring" }}
        className={clsx(
            "relative z-10 flex flex-col items-center text-center p-6 rounded-2xl border bg-slate-800/40 backdrop-blur-xl h-full",
            color === 'blue' && "border-blue-500/20 shadow-blue-500/10 shadow-xl",
            color === 'green' && "border-green-500/20 shadow-green-500/10 shadow-xl",
            color === 'purple' && "border-purple-500/20 shadow-purple-500/10 shadow-xl"
        )}
    >
        <div className={clsx(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border shadow-lg",
            color === 'blue' && "bg-blue-500/10 border-blue-500/30 shadow-blue-500/20",
            color === 'green' && "bg-green-500/10 border-green-500/30 shadow-green-500/20",
            color === 'purple' && "bg-purple-500/10 border-purple-500/30 shadow-purple-500/20"
        )}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        {children}
    </motion.div>
);

const TechItem = ({ icon, label }: any) => (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-slate-900/60 border border-slate-700/50">
        <span className="text-slate-400">{icon}</span>
        <span className="text-xs text-slate-300 font-mono">{label}</span>
    </div>
);
