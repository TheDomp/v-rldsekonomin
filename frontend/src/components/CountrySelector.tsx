import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Search, Globe } from 'lucide-react';
import type { CountryOption } from '../lib/countries';
import { AVAILABLE_COUNTRIES } from '../lib/countries';
import { fetchAllCountries } from '../lib/dataService';
import clsx from 'clsx';

interface CountrySelectorProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCodes: string[];
    onToggle: (code: string) => void;
    onClear: () => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
    isOpen, onClose, selectedCodes, onToggle, onClear
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [allCountries, setAllCountries] = useState<CountryOption[]>(AVAILABLE_COUNTRIES);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch full list when opened
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetchAllCountries().then(countries => {
                if (countries.length > 0) {
                    setAllCountries(countries);
                }
                setIsLoading(false);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredCountries = allCountries.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.region.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[var(--color-eco-card)] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-slate-700">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Globe className="w-6 h-6 text-[var(--color-eco-success)]" />
                                <h2 className="text-2xl font-bold text-white">Select Countries</h2>
                                {isLoading && <span className="text-xs text-slate-400 animate-pulse ml-2">Updating list...</span>}
                            </div>
                            <div className="relative">
                                <X
                                    className={clsx(
                                        "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 cursor-pointer hover:text-white transition-colors",
                                        searchTerm === '' && "hidden"
                                    )}
                                    onClick={() => setSearchTerm('')}
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search country (e.g. Estonia), code or region..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white focus:outline-none focus:border-[var(--color-eco-success)] transition-all"
                                />
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-700/50 rounded-full transition-colors ml-4 self-start"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable List */}
                    <div className="overflow-y-auto p-6 flex-1 min-h-[300px]">
                        {filteredCountries.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredCountries.map((country) => {
                                    const isSelected = selectedCodes.includes(country.code);
                                    return (
                                        <button
                                            key={country.code}
                                            onClick={() => onToggle(country.code)}
                                            className={clsx(
                                                "flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                                                isSelected
                                                    ? "bg-[var(--color-eco-success)]/10 border-[var(--color-eco-success)] text-[var(--color-eco-success)]"
                                                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                                                isSelected ? "bg-[var(--color-eco-success)] border-[var(--color-eco-success)]" : "border-slate-500 group-hover:border-slate-400"
                                            )}>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                                            </div>
                                            <span className="font-medium truncate">{country.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-[var(--color-eco-text-muted)]">
                                <p className="text-lg">No countries match "{searchTerm}"</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 text-[var(--color-eco-success)] hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-b-2xl">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[var(--color-eco-text-muted)]">
                                {selectedCodes.length} countries selected
                            </span>
                            {selectedCodes.length > 0 && (
                                <button
                                    onClick={onClear}
                                    className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
                                >
                                    Clear all
                                </button>
                            )}
                            {/* Bulk select removed per user request to avoid API overload */}
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-[var(--color-eco-success)] text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
