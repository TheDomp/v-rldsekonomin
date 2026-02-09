import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface FiscalRunwayProps {
    months: number | null;
}

export const FiscalRunway: React.FC<FiscalRunwayProps> = ({ months }) => {
    // Cap at 12 months for visualization
    const percentage = months !== null ? Math.min((months / 12) * 100, 100) : 0;

    let colorClass = 'bg-[var(--color-eco-success)]';
    if (months !== null) {
        if (months < 3) colorClass = 'bg-[var(--color-eco-danger)]';
        else if (months < 6) colorClass = 'bg-[var(--color-eco-warning)]';
    } else {
        colorClass = 'bg-slate-700'; // Missing data color
    }

    return (
        <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-[var(--color-eco-text-muted)] mb-1">
                <span>Likviditetsreserv</span>
                <span>{months !== null ? `${months.toFixed(1)} mån` : 'Saknas'}</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    className={clsx("h-full rounded-full", colorClass)}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};
