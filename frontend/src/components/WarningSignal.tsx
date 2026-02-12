import React from 'react';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface WarningSignalProps {
    title: string;
    value: number;
    unit: string;
    threshold: number;
    isUpperLimit?: boolean; // If true, value > threshold is bad. If false, value < threshold is bad.
    description: string;
}

export const WarningSignal: React.FC<WarningSignalProps> = ({
    title,
    value,
    unit,
    threshold,
    isUpperLimit = true,
    description
}) => {
    const isBad = isUpperLimit ? value > threshold : value < threshold;

    return (
        <div className={clsx("p-4 rounded-lg border", isBad ? "bg-red-900/20 border-[var(--color-eco-danger)]/50" : "bg-slate-800 border-slate-700")}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    {isBad ? <AlertTriangle className="w-4 h-4 text-[var(--color-eco-danger)]" /> : <CheckCircle className="w-4 h-4 text-[var(--color-eco-success)]" />}
                    {title}
                </h3>
                <span className={clsx("font-mono font-bold", isBad ? "text-[var(--color-eco-danger)]" : "text-[var(--color-eco-success)]")}>
                    {value > 0 ? '+' : ''}{value}{unit}
                </span>
            </div>
            <p className="text-xs text-[var(--color-eco-text-muted)] mb-2">{description}</p>
            <div className="text-xs text-slate-500">
                Threshold: {isUpperLimit ? '>' : '<'} {threshold}{unit}
            </div>
        </div>
    );
};
