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
        inflation: 8.6,   // Source: CBR Q3 2024
        reservesMonths: 25.8 // Source: World Bank/CBR 2024
    },
    'SWE': {
        debtToGdp: 34.0 // Source: SCB/Eurostat 2024
    },
    'DEU': {
        debtToGdp: 62.5 // Source: Bundesbank 2024
    },
    'FRA': { debtToGdp: 113.1 }, // Source: INSEE/Eurostat 2024
    'ITA': { debtToGdp: 134.9 }, // Source: Bank of Italy 2024
    'ESP': { debtToGdp: 101.8 }, // Source: Bank of Spain 2024
    'GBR': { debtToGdp: 94.6 },  // Source: ONS 2024
    'JPN': { debtToGdp: 236.7 }, // Source: MOF Japan 2024
    'BRA': { debtToGdp: 76.1 },  // Source: Central Bank of Brazil 2024
    'IND': { debtToGdp: 81.9 },  // Source: IMF 2024
    'CAN': { debtToGdp: 110.8 }, // Source: Statistics Canada 2024
    'KOR': { debtToGdp: 46.8 },  // Source: MOEF Korea 2024
    'AUS': { debtToGdp: 43.8 },  // Source: ABS 2024
    'MEX': { debtToGdp: 49.7 },  // Source: SHCP Mexico 2024
    'IDN': { debtToGdp: 38.8 },  // Source: MinFin Indonesia 2024
    'SAU': { debtToGdp: 26.2 },  // Source: NDMC Saudi Arabia 2024
    'TUR': { debtToGdp: 24.7 },  // Source: MinFin Turkey 2024
    'ARG': { debtToGdp: 85.3 },  // Source: IMF 2024
    'NOR': { debtToGdp: 42.7 },  // Source: IMF 2024
    'FIN': { debtToGdp: 82.5 },  // Source: Treasury Finland 2024
    'DNK': { debtToGdp: 31.1 },  // Source: Statistics Denmark 2024
    'NLD': { debtToGdp: 43.7 },  // Source: DNB 2024
    'CHE': { debtToGdp: 17.2 },  // Source: Swiss Federal Admin 2024
    'POL': { debtToGdp: 55.6 },  // Source: GUS Poland 2024
    'ZAF': { debtToGdp: 76.9 },  // Source: National Treasury SA 2024
    'NGA': { debtToGdp: 52.9 },  // Source: DMO Nigeria 2024
    'EGY': { debtToGdp: 82.9 },  // Source: Central Bank of Egypt 2024
    'BEL': { debtToGdp: 105.2 }, // Source: Eurostat 2024
    'BLR': { debtToGdp: 33.1 },  // Source: IMF 2024
    'GRC': { debtToGdp: 161.9 }, // Source: Eurostat 2024
    'PRT': { debtToGdp: 99.1 },  // Source: Eurostat 2024
    'AUT': { debtToGdp: 77.8 },  // Source: Eurostat 2024
    'IRL': { debtToGdp: 43.7 },  // Source: Eurostat 2024
    'ISL': { debtToGdp: 66.5 },  // Source: Statistics Iceland 2024
    'HRV': { debtToGdp: 61.3 },  // Source: Eurostat 2024
    'CYP': { debtToGdp: 77.3 },  // Source: Eurostat 2024
    'SVN': { debtToGdp: 69.2 },  // Source: Eurostat 2024
    'SVK': { debtToGdp: 57.8 },  // Source: Eurostat 2024
    'LTU': { debtToGdp: 38.3 },  // Source: Eurostat 2024
    'LVA': { debtToGdp: 43.6 },  // Source: Eurostat 2024
    'EST': { debtToGdp: 19.6 },  // Source: Eurostat 2024
    'UKR': { debtToGdp: 84.4 },  // Source: IMF 2024
    'THA': { debtToGdp: 62.1 },  // Source: Bank of Thailand 2024
    'MYS': { debtToGdp: 65.1 },  // Source: MOF Malaysia 2024
    'PHL': { debtToGdp: 60.1 },  // Source: Bureau of Treasury PH 2024
    'VNM': { debtToGdp: 37.0 },  // Source: IMF 2024
    'ISR': { debtToGdp: 62.1 },  // Source: Bank of Israel 2024
    'CHL': { debtToGdp: 39.6 },  // Source: MinFin Chile 2024
    'COL': { debtToGdp: 54.8 },  // Source: MinFin Colombia 2024
    'PER': { debtToGdp: 33.9 },  // Source: MEF Peru 2024
    'KEN': { debtToGdp: 71.9 },  // Source: National Treasury Kenya 2024
    'GHA': { debtToGdp: 72.0 },  // Source: IMF 2024
    'PAK': { debtToGdp: 75.6 },  // Source: SBP Pakistan 2024
    'BGD': { debtToGdp: 39.4 },  // Source: IMF 2024
    'LKA': { debtToGdp: 104.0 }, // Source: CBSL 2024
    'NZL': { debtToGdp: 43.1 },  // Source: NZ Treasury 2024
};

const FALLBACK_METADATA: Record<string, Partial<Record<keyof EconomicMetrics, { source: string, year: string }>>> = {
    'EUU': {
        debtToGdp: { source: 'Eurostat', year: 'Q3 2024' }
    },
    'CHN': {
        debtToGdp: { source: 'IMF', year: 'Q3 2024' },
        gdpGrowth: { source: 'NBS', year: 'Q3 2024' },
        inflation: { source: 'NBS', year: 'Q3 2024' }
    },
    'USA': {
        debtToGdp: { source: 'St. Louis Fed', year: 'Q3 2024' }
    },
    'RUS': {
        debtToGdp: { source: 'FocusEconomics', year: 'Q3 2024' },
        gdpGrowth: { source: 'Rosstat', year: 'Q3 2024' },
        inflation: { source: 'CBR', year: 'Q3 2024' },
        reservesMonths: { source: 'CBR/World Bank', year: '2024' }
    },
    'SWE': {
        debtToGdp: { source: 'SCB', year: '2024' }
    },
    'DEU': {
        debtToGdp: { source: 'Bundesbank', year: '2024' }
    },
    'FRA': { debtToGdp: { source: 'INSEE/Eurostat', year: '2024' } },
    'ITA': { debtToGdp: { source: 'Bank of Italy', year: '2024' } },
    'ESP': { debtToGdp: { source: 'Bank of Spain', year: '2024' } },
    'GBR': { debtToGdp: { source: 'ONS', year: '2024' } },
    'JPN': { debtToGdp: { source: 'MOF Japan', year: '2024' } },
    'BRA': { debtToGdp: { source: 'Central Bank of Brazil', year: '2024' } },
    'IND': { debtToGdp: { source: 'IMF', year: '2024' } },
    'CAN': { debtToGdp: { source: 'Statistics Canada', year: '2024' } },
    'KOR': { debtToGdp: { source: 'MOEF Korea', year: '2024' } },
    'AUS': { debtToGdp: { source: 'ABS', year: '2024' } },
    'MEX': { debtToGdp: { source: 'SHCP Mexico', year: '2024' } },
    'IDN': { debtToGdp: { source: 'MinFin Indonesia', year: '2024' } },
    'SAU': { debtToGdp: { source: 'NDMC Saudi Arabia', year: '2024' } },
    'TUR': { debtToGdp: { source: 'MinFin Turkey', year: '2024' } },
    'ARG': { debtToGdp: { source: 'IMF', year: '2024' } },
    'NOR': { debtToGdp: { source: 'IMF', year: '2024' } },
    'FIN': { debtToGdp: { source: 'Treasury Finland', year: '2024' } },
    'DNK': { debtToGdp: { source: 'Statistics Denmark', year: '2024' } },
    'NLD': { debtToGdp: { source: 'DNB', year: '2024' } },
    'CHE': { debtToGdp: { source: 'Swiss Fed. Admin', year: '2024' } },
    'POL': { debtToGdp: { source: 'GUS Poland', year: '2024' } },
    'ZAF': { debtToGdp: { source: 'National Treasury', year: '2024' } },
    'NGA': { debtToGdp: { source: 'DMO Nigeria', year: '2024' } },
    'EGY': { debtToGdp: { source: 'CBE', year: '2024' } },
    'BEL': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'BLR': { debtToGdp: { source: 'IMF', year: '2024' } },
    'GRC': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'PRT': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'AUT': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'IRL': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'ISL': { debtToGdp: { source: 'Statistics Iceland', year: '2024' } },
    'HRV': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'CYP': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'SVN': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'SVK': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'LTU': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'LVA': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'EST': { debtToGdp: { source: 'Eurostat', year: '2024' } },
    'UKR': { debtToGdp: { source: 'IMF', year: '2024' } },
    'THA': { debtToGdp: { source: 'Bank of Thailand', year: '2024' } },
    'MYS': { debtToGdp: { source: 'MOF Malaysia', year: '2024' } },
    'PHL': { debtToGdp: { source: 'Bureau of Treasury', year: '2024' } },
    'VNM': { debtToGdp: { source: 'IMF', year: '2024' } },
    'ISR': { debtToGdp: { source: 'Bank of Israel', year: '2024' } },
    'CHL': { debtToGdp: { source: 'MinFin Chile', year: '2024' } },
    'COL': { debtToGdp: { source: 'MinFin Colombia', year: '2024' } },
    'PER': { debtToGdp: { source: 'MEF Peru', year: '2024' } },
    'KEN': { debtToGdp: { source: 'National Treasury', year: '2024' } },
    'GHA': { debtToGdp: { source: 'IMF', year: '2024' } },
    'PAK': { debtToGdp: { source: 'SBP Pakistan', year: '2024' } },
    'BGD': { debtToGdp: { source: 'IMF', year: '2024' } },
    'LKA': { debtToGdp: { source: 'CBSL', year: '2024' } },
    'NZL': { debtToGdp: { source: 'NZ Treasury', year: '2024' } },
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

        // If debt is missing and no hardcoded fallback, try alternative WB indicators
        if (metricsValues.debtToGdp === null && !FALLBACK_DATA[code]?.debtToGdp) {
            // Try multiple alternative indicators with broader coverage
            const altIndicators = [
                'GC.DOD.TOTL.GD.ZS',           // Central gov debt (wider date range)
                'GC.XPN.TOTL.GD.ZS',           // Expense (% of GDP) - proxy
            ];
            for (const altIndicator of altIndicators) {
                try {
                    const altUrl = `${WB_API_BASE}/${code}/indicator/${altIndicator}?format=json&per_page=10&date=2010:2025`;
                    const altResp = await fetch(altUrl);
                    const altData: WBResponse = await altResp.json();
                    if (Array.isArray(altData) && altData.length > 1 && altData[1]) {
                        const altItem = altData[1].find(item => item.value !== null);
                        if (altItem && altIndicator.includes('DOD')) {
                            metricsValues.debtToGdp = altItem.value;
                            console.info(`Found alt debt data for ${code}: ${altItem.value}% (${altItem.date}) via ${altIndicator}`);
                            break;
                        }
                    }
                } catch { /* Silently fail, try next indicator */ }
            }
        }

        // Apply Fallbacks / Overrides
        if (FALLBACK_DATA[code]) {
            const fallback = FALLBACK_DATA[code];
            metricsValues = { ...metricsValues, ...fallback };
            console.info(`Applied fallback data for ${code}`);
        }

        // Helper to create MetricData object
        const createMetric = (key: keyof typeof metricsValues, _wbValue: number | null, _wbYear: string | null): MetricData => {
            const val = metricsValues[key];

            if (FALLBACK_DATA[code] && FALLBACK_DATA[code][key] !== undefined) {
                const meta = FALLBACK_METADATA[code]?.[key];
                return { value: val ?? null, source: meta?.source || 'Override', year: meta?.year || 'Q3 2024' };
            }

            return { value: val ?? null, source: 'World Bank', year: 'Q3 2024' };
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
        if ((metrics.gdpGrowth.value || 0) > 5) metaphor += " Strong growth engine.";
        if ((metrics.inflation.value || 0) > 10) metaphor += " Overheated.";

        // Manual contextual overrides
        if (code === 'RUS') {
            metaphor = "War Economy: Driven by military spending. Structural issues masked by stimulus.";
        } else if (code === 'CHN') {
            metaphor = "Property crisis weighs heavily, but industry accelerates.";
        }

        return {
            id: code,
            name: countryDetails.name,
            flagCode: countryDetails.iso2Code,
            dataYear: 'Q3 2024',
            healthIndex,
            status,
            pillars,
            metrics,
            metaphor
        };

    } catch (error) {
        console.error(`Failed to fetch data for ${code}:`, error);
        // Return a fallback object so the country doesn't "disappear" from the UI
        return {
            id: code,
            name: code, // Fallback name
            flagCode: code,
            dataYear: '2024 Q1',
            healthIndex: 0,
            status: 'Warning',
            pillars: {
                liquidity: 0,
                burnRate: 0,
                debtStructure: 0,
                realGrowth: 0,
                demographics: 0
            },
            metrics: {
                reservesMonths: { value: null, source: 'Error', year: '2024 Q1' },
                gdpGrowth: { value: null, source: 'Error', year: '2024 Q1' },
                inflation: { value: null, source: 'Error', year: '2024 Q1' },
                debtToGdp: { value: null, source: 'Error', year: '2024 Q1' },
                currentAccount: { value: null, source: 'Error', year: '2024 Q1' },
                deficitGdp: { value: null, source: 'Error', year: '2024 Q1' },
                debtUsdShare: { value: null, source: 'Error', year: '2024 Q1' },
                dependencyRatio: 0,
                creditToGdpGap: null,
                debtServiceRatio: null,
                reerMisalignment: null
            },
            metaphor: "Could not fetch data."
        };
    }
}

function generateMetaphor(status: string): string {
    switch (status) {
        case 'Success': return "A well-oiled machine.";
        case 'Warning': return "Warning lights are blinking.";
        case 'Danger': return "Critical system level.";
        default: return "Awaiting more data for diagnosis.";
    }
}
