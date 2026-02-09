export type HealthStatus = 'Success' | 'Warning' | 'Danger';

/**
 * The 5 Pillars of Economic Health
 */
export interface EconomicPillars {
    liquidity: number;       // 0-100 score
    burnRate: number;        // 0-100 score
    debtStructure: number;   // 0-100 score
    realGrowth: number;      // 0-100 score
    demographics: number;    // 0-100 score
}

/**
 * Detailed metrics for deep-dive analysis
 */
export interface EconomicMetrics {
    reservesMonths: number | null;      // "Fiscal Runway"
    gdpGrowth: number | null;
    inflation: number | null;
    debtToGdp: number | null;
    currentAccount: number | null;
    deficitGdp: number | null;          // % of GDP
    debtUsdShare: number | null;        // % of debt in USD
    dependencyRatio: number | null;     // Demographics indicator
    creditToGdpGap?: number | null;     // "Invisible Warning": >10% is bad
    debtServiceRatio?: number | null;   // "Invisible Warning"
    reerMisalignment?: number | null;   // "Invisible Warning"
}

export interface CountryData {
    id: string;
    name: string;
    flagCode: string; // ISO 2-letter code
    dataYear: string; // Year of the data source
    healthIndex: number;
    status: HealthStatus;
    pillars: EconomicPillars;
    metrics: EconomicMetrics;
    metaphor: string;
}
