export type HealthStatus = 'Success' | 'Warning' | 'Danger' | 'Unknown';

/**
 * The 5 Pillars of Economic Health
 */
export interface EconomicPillars {
    liquidity: number | null;       // 0-100 score
    burnRate: number | null;        // 0-100 score
    debtStructure: number | null;   // 0-100 score
    realGrowth: number | null;      // 0-100 score
    demographics: number | null;    // 0-100 score
}

/**
 * Detailed metrics for deep-dive analysis
 */
export interface MetricData {
    value: number | null;
    source?: string;
    year?: string;
}

export interface EconomicMetrics {
    reservesMonths: MetricData;      // "Fiscal Runway"
    gdpGrowth: MetricData;
    inflation: MetricData;
    debtToGdp: MetricData;
    currentAccount: MetricData;
    deficitGdp: MetricData;          // % of GDP
    debtUsdShare: MetricData;        // % of debt in USD
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
    healthIndex: number | null;
    status: HealthStatus;
    pillars: EconomicPillars;
    metrics: EconomicMetrics;
    metaphor: string;
}
