import type { CountryData, EconomicPillars, EconomicMetrics, MetricData } from './types';
import type { CountryOption } from './countries';
import { calculateHealthIndex, getHealthStatus } from './healthEngine';

const WB_API_BASE = 'https://api.worldbank.org/v2/country';

// Indicator Codes
const INDICATORS = {
    gdpGrowth: 'NY.GDP.MKTP.KD.ZG',      // Annual %
    inflation: 'FP.CPI.TOTL.ZG',         // Consumer prices %
    govDebt: 'GC.DOD.TOTL.GD.ZS',        // Central gov debt % of GDP
    reserves: 'FI.RES.TOTL.MO',          // Total reserves in months of imports
    currentAccount: 'BN.CAB.XOKA.GD.ZS', // Current account balance % of GDP
    realInterest: 'FR.INR.RINR',         // Real interest rate (Approx for liquidity/risk)
};

interface WBResponseItem {
    indicator: { id: string; value: string };
    country: { id: string; value: string };
    countryiso3code: string;
    date: string;
    value: number | null;
}

type WBResponse = [
    { page: number; pages: number; per_page: number; total: number },
    WBResponseItem[]
];



interface WBCountryDetails {
    id: string;
    iso2Code: string;
    name: string;
    region: { value: string };
    adminregion: { value: string };
    incomeLevel: { value: string };
    lendingType: { value: string };
    capitalCity: string;
    longitude: string;
    latitude: string;
}

async function fetchCountryDetails(isoCode: string): Promise<WBCountryDetails | null> {
    try {
        const response = await fetch(`${WB_API_BASE}/${isoCode}?format=json`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 1 && data[1][0]) {
            return data[1][0];
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch details for ${isoCode}`, error);
        return null;
    }
}

/**
 * Fetches the full list of countries from World Bank API
 * (Caches result in memory to avoid repeated calls)
 */
let cachedCountries: CountryOption[] | null = null;

export async function fetchAllCountries(): Promise<CountryOption[]> {
    if (cachedCountries) return cachedCountries;

    try {
        // Fetch valid countries (format=json, per_page=300 to get all)
        const response = await fetch(`${WB_API_BASE}?format=json&per_page=300`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 1) {
            const rawCountries = data[1];

            // Filter out aggregates (Regions, "High income", etc.)
            // Logic: Aggregates usually have 'capitalCity' as empty string, or region.id is 'NA'
            const validCountries = rawCountries.filter((c: any) =>
                c.region.iso2code !== 'NA' &&
                c.capitalCity !== ''
            ).map((c: any) => ({
                code: c.id,
                name: c.name,
                region: c.region.value
            }));

            cachedCountries = validCountries.sort((a: any, b: any) => a.name.localeCompare(b.name));
            return cachedCountries!;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch country list:', error);
        return [];
    }
}

/**
 * Fetches data for a specific country from World Bank API
 */
// Fallback / Override Data for Powerhouse Synchronization (Q3 2024)
const FALLBACK_DATA: Record<string, Partial<Record<keyof EconomicMetrics, number>>> = {
    'EUU': {
        debtToGdp: 81.6 // Source: Eurostat Q3 2024
    },
    'CHN': {
        debtToGdp: 88.3, // Source: IMF 2024 Est
        gdpGrowth: 4.6,  // Source: NBS China Q3 2024
        inflation: 0.4   // Source: NBS China Q3 2024
    },
    'USA': {
        debtToGdp: 120.2 // Source: St. Louis Fed Q3 2024
    },
    'RUS': {
        debtToGdp: 20.3, // Source: FocusEconomics 2024 Est
        gdpGrowth: 3.1,  // Source: Rosstat Q3 2024 Preliminary
        inflation: 8.6   // Source: CBR Q3 2024
    }
};

const FALLBACK_METADATA: Record<string, Partial<Record<keyof EconomicMetrics, { source: string, year: string }>>> = {
    'EUU': {
        debtToGdp: { source: 'Eurostat', year: 'Q3 2024' }
    },
    'CHN': {
        debtToGdp: { source: 'IMF Est', year: '2024' },
        gdpGrowth: { source: 'NBS', year: 'Q3 2024' },
        inflation: { source: 'NBS', year: 'Q3 2024' }
    },
    'USA': {
        debtToGdp: { source: 'St. Louis Fed', year: 'Q3 2024' }
    },
    'RUS': {
        debtToGdp: { source: 'FocusEconomics', year: '2024' },
        gdpGrowth: { source: 'Rosstat', year: 'Q3 2024' },
        inflation: { source: 'CBR', year: 'Q3 2024' }
    }
};

export async function fetchCountryData(isoCode: string): Promise<CountryData | null> {
    const code = isoCode.toUpperCase();

    try {
        // 1. Fetch Country Details (Name, ISO2, etc.)
        const countryDetails = await fetchCountryDetails(code);
        if (!countryDetails) {
            throw new Error(`Country ${code} not found`);
        }

        // 2. Fetch specific economic indicators
        const promises = Object.entries(INDICATORS).map(async ([key, indicatorCode]) => {
            const url = `${WB_API_BASE}/${code}/indicator/${indicatorCode}?format=json&per_page=1&date=2020:2025`;
            const response = await fetch(url);
            const data: WBResponse = await response.json();

            // Check if response is valid ([metadata, data])
            if (!Array.isArray(data) || data.length < 2 || !data[1]) {
                return { key, value: null, year: null };
            }

            // Find first non-null value
            const validItem = data[1].find(item => item.value !== null);
            return { key, value: validItem ? validItem.value : null, year: validItem ? validItem.date : null };
        });

        const results = await Promise.all(promises);

        let mostCommonYear = 'N/A';
        const years = results.map(r => r.year).filter(y => y !== null) as string[];

        if (years.length > 0) {
            mostCommonYear = years.sort((a, b) => years.filter(v => v === a).length - years.filter(v => v === b).length).pop() || 'N/A';
        }

        const dataMap = results.reduce((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }, {} as Record<string, number | null>);

        // Initialize Metrics with Default World Bank Data
        let metricsValues = {
            reservesMonths: dataMap.reserves,
            gdpGrowth: dataMap.gdpGrowth,
            inflation: dataMap.inflation,
            debtToGdp: dataMap.govDebt,
            currentAccount: dataMap.currentAccount,
        };

        // Apply Fallbacks / Overrides
        if (FALLBACK_DATA[code]) {
            const fallback = FALLBACK_DATA[code];
            metricsValues = { ...metricsValues, ...fallback };
            console.info(`Applied fallback data for ${code}`);
        }

        // Helper to create MetricData object
        const createMetric = (key: keyof typeof metricsValues, _wbValue: number | null, wbYear: string | null): MetricData => {
            const val = metricsValues[key];

            // Check if we used a fallback
            if (FALLBACK_DATA[code] && FALLBACK_DATA[code][key] !== undefined) {
                const meta = FALLBACK_METADATA[code]?.[key];
                return { value: val ?? null, source: meta?.source || 'Override', year: meta?.year || '2024' };
            }

            return { value: val ?? null, source: 'World Bank', year: wbYear || mostCommonYear };
        }

        const metrics: EconomicMetrics = {
            reservesMonths: createMetric('reservesMonths', dataMap.reserves, mostCommonYear),
            gdpGrowth: createMetric('gdpGrowth', dataMap.gdpGrowth, mostCommonYear),
            inflation: createMetric('inflation', dataMap.inflation, mostCommonYear),
            debtToGdp: createMetric('debtToGdp', dataMap.govDebt, mostCommonYear),
            currentAccount: createMetric('currentAccount', dataMap.currentAccount, mostCommonYear),
            deficitGdp: { value: null, source: 'World Bank', year: mostCommonYear },
            debtUsdShare: { value: null, source: 'World Bank', year: mostCommonYear },
            dependencyRatio: 50, // Placeholder
            creditToGdpGap: null,
            debtServiceRatio: null,
            reerMisalignment: null
        };

        // ... Pillars Calculation (uses raw numbers) ...

        // Liquidity
        const liquidityScore = metrics.reservesMonths.value !== null ? Math.min((metrics.reservesMonths.value / 6) * 100, 100) : null;

        // Burn Rate
        const burnRateScore = metrics.inflation.value !== null ? Math.max(0, 100 - (metrics.inflation.value * 5)) : null;

        // Debt Structure
        const debtScore = metrics.debtToGdp.value !== null ? Math.max(0, 100 - Math.max(0, metrics.debtToGdp.value - 40)) : null;

        // Real Growth
        const growthScore = metrics.gdpGrowth.value !== null ? Math.min(Math.max(0, (metrics.gdpGrowth.value + 2) * 20), 100) : null;

        const demographicsScore = 50;

        const pillars: EconomicPillars = {
            liquidity: liquidityScore !== null ? Math.round(liquidityScore) : null,
            burnRate: burnRateScore !== null ? Math.round(burnRateScore) : null,
            debtStructure: debtScore !== null ? Math.round(debtScore) : null,
            realGrowth: growthScore !== null ? Math.round(growthScore) : null,
            demographics: demographicsScore
        };

        const healthIndex = calculateHealthIndex(pillars);
        const status = getHealthStatus(healthIndex);

        // Create Metadata Metaphor
        let metaphor = generateMetaphor(status);
        if ((metrics.gdpGrowth.value || 0) > 5) metaphor += " Stark tillväxtmotor.";
        if ((metrics.inflation.value || 0) > 10) metaphor += " Överhettad.";

        return {
            id: code,
            name: countryDetails.name,
            flagCode: countryDetails.iso2Code,
            dataYear: mostCommonYear,
            healthIndex,
            status,
            pillars,
            metrics,
            metaphor
        };

    } catch (error) {
        console.error(`Failed to fetch data for ${code}:`, error);
        return null; // Return null to handle gracefully
    }
}

function generateMetaphor(status: string): string {
    switch (status) {
        case 'Success': return "Ett väloljat maskineri.";
        case 'Warning': return "Varningslampor blinkar.";
        case 'Danger': return "Kritisk systemnivå.";
        default: return "Inväntar mer data för diagnos.";
    }
}
