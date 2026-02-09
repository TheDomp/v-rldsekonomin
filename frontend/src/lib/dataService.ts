import type { CountryData, EconomicPillars, EconomicMetrics } from './types';
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
            const url = `${WB_API_BASE}/${code}/indicator/${indicatorCode}?format=json&per_page=1&date=2020:2025`; // Get most recent in last 5 years
            const response = await fetch(url);
            const data: WBResponse = await response.json();

            // Check if response is valid ([metadata, data])
            if (!Array.isArray(data) || data.length < 2 || !data[1]) {
                console.warn(`No data for ${key} (${indicatorCode}) for ${code}`);
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
            // Simple mode year
            mostCommonYear = years.sort((a, b) => years.filter(v => v === a).length - years.filter(v => v === b).length).pop() || 'N/A';
        }

        const dataMap = results.reduce((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }, {} as Record<string, number | null>);


        // Real application would likely flag this as "Data Missing" in UI
        let reserves = dataMap.reserves;
        let gdpGrowth = dataMap.gdpGrowth;
        let govDebt = dataMap.govDebt;
        let inflation = dataMap.inflation;


        // Normalize to 0-100 scores for the Health Engine
        // These mappings are arbitrary for this demo but logic-based

        // Liquidity: Reserves in months (target > 6 months)
        // Treat null as 0 (Danger) for scoring if missing, to avoid false confidence
        const liquidityScore = reserves !== null ? Math.min((reserves / 6) * 100, 100) : 0;

        // Burn Rate: Inverse of current account? Or separate? 
        // Using simple mock logic for demo based on inflation/growth balance

        const burnRateScore = inflation !== null ? Math.max(0, 100 - (inflation * 5)) : 50;

        // Debt Structure: Inverse of Debt/GDP (target < 60%)
        // If debt is null, we can't score it. Return 50 (Neutral/Unknown) or 0 (Risk)? 
        // 50 is safer than 100 (which 0% debt would be).
        const debtScore = govDebt !== null ? Math.max(0, 100 - Math.max(0, govDebt - 40)) : 50;

        // Real Growth: Target > 3%
        const growthScore = gdpGrowth !== null ? Math.min(Math.max(0, (gdpGrowth + 2) * 20), 100) : 50;

        // Demographics: Placeholder (50)
        const demographicsScore = 50;

        const pillars: EconomicPillars = {
            liquidity: Math.round(liquidityScore),
            burnRate: Math.round(burnRateScore),
            debtStructure: Math.round(debtScore),
            realGrowth: Math.round(growthScore),
            demographics: demographicsScore
        };

        const healthIndex = calculateHealthIndex(pillars);
        const status = getHealthStatus(healthIndex);

        // Create Metadata Metaphor
        let metaphor = generateMetaphor(status);
        if ((gdpGrowth || 0) > 5) metaphor += " Stark tillväxtmotor.";
        if ((inflation || 0) > 10) metaphor += " Överhettad.";

        const metrics: EconomicMetrics = {
            reservesMonths: reserves,
            gdpGrowth: gdpGrowth,
            inflation: inflation,
            debtToGdp: govDebt,
            currentAccount: dataMap.currentAccount,
            deficitGdp: null, // Not yet fetched
            debtUsdShare: null, // Not yet fetched
            dependencyRatio: demographicsScore // Proxy using the score for now
        };

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
        return null;
    }
}

function generateMetaphor(status: string): string {
    switch (status) {
        case 'Success': return "Ett väloljat maskineri.";
        case 'Warning': return "Varningslampor blinkar.";
        case 'Danger': return "Kritisk systemnivå.";
        default: return "Status okänd.";
    }
}
