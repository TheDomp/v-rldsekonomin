import type { EconomicPillars, HealthStatus } from './types';

// Weights for the Health Index
const WEIGHTS = {
    liquidity: 0.25,
    burnRate: 0.20,
    debtStructure: 0.25,
    realGrowth: 0.15,
    demographics: 0.15
};

/**
 * Calculates the weighted Health Index (0-100)
 */
/**
 * Calculates the weighted Health Index (0-100)
 * Returns null if any required pillar data is missing.
 */
export function calculateHealthIndex(pillars: EconomicPillars): number | null {
    if (
        pillars.liquidity === null ||
        pillars.burnRate === null ||
        pillars.debtStructure === null ||
        pillars.realGrowth === null
        // Demographics might be mocked/constant, so we can ignore it or checking it too
    ) {
        return null;
    }

    // Default 50 for demographics if missing (as it's often not fetched yet)
    const demoScore = pillars.demographics ?? 50;

    const index =
        (pillars.liquidity * WEIGHTS.liquidity) +
        (pillars.burnRate * WEIGHTS.burnRate) +
        (pillars.debtStructure * WEIGHTS.debtStructure) +
        (pillars.realGrowth * WEIGHTS.realGrowth) +
        (demoScore * WEIGHTS.demographics);

    return Math.round(index * 10) / 10; // Round to 1 decimal
}

/**
 * Determines the status color/category based on the Health Index
 */
export function getHealthStatus(index: number | null): HealthStatus {
    if (index === null) return 'Unknown';
    if (index >= 75) return 'Success';
    if (index >= 50) return 'Warning';
    return 'Danger';
}

/**
 * Helper to get tailwind color class for status
 */
export function getStatusColor(status: HealthStatus): string {
    switch (status) {
        case 'Success': return 'text-[var(--color-eco-success)]';
        case 'Warning': return 'text-[var(--color-eco-warning)]';
        case 'Danger': return 'text-[var(--color-eco-danger)]';
        case 'Unknown': return 'text-slate-400';
    }
}

export function getStatusBgColor(status: HealthStatus): string {
    switch (status) {
        case 'Success': return 'bg-[var(--color-eco-success)]';
        case 'Warning': return 'bg-[var(--color-eco-warning)]';
        case 'Danger': return 'bg-[var(--color-eco-danger)]';
        case 'Unknown': return 'bg-slate-700';
    }
}

export function getStatusBorderColor(status: HealthStatus): string {
    switch (status) {
        case 'Success': return 'border-[var(--color-eco-success)]';
        case 'Warning': return 'border-[var(--color-eco-warning)]';
        case 'Danger': return 'border-[var(--color-eco-danger)]';
        case 'Unknown': return 'border-slate-600';
    }
}
