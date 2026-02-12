
const WB_API_BASE = 'https://api.worldbank.org/v2/country';

// Same helper as in dataService
async function fetchAllCountries() {
    try {
        const response = await fetch(`${WB_API_BASE}?format=json&per_page=300`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 1) {
            const rawCountries = data[1];
            const validCountries = rawCountries.filter((c) =>
                c.region.iso2code !== 'NA' &&
                c.capitalCity !== ''
            ).map((c) => ({
                code: c.id,
                name: c.name
            }));
            return validCountries;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch country list:', error);
        return [];
    }
}

const INDICATORS = {
    gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
    inflation: 'FP.CPI.TOTL.ZG',
    govDebt: 'GC.DOD.TOTL.GD.ZS',
};

async function checkCountryData(isoCode) {
    // Simulating the logic in dataService without full implementation
    // Ideally we'd import fetchCountryData but we are in a standalone script context
    try {
        const promises = Object.entries(INDICATORS).map(async ([key, indicatorCode]) => {
            const url = `${WB_API_BASE}/${isoCode}/indicator/${indicatorCode}?format=json&per_page=1&date=2020:2025`;
            const response = await fetch(url);
            const data = await response.json();

            if (!Array.isArray(data) || data.length < 2 || !data[1]) {
                return null;
            }
            const validItem = data[1].find(item => item.value !== null);
            return validItem ? validItem.value : null;
        });

        const results = await Promise.all(promises);
        // If ALL results are null, this country effectively has NO economic data and might be "dead"
        const hasSomeData = results.some(val => val !== null);
        return hasSomeData;

    } catch (e) {
        return false;
    }
}

async function run() {
    console.log("Fetching all countries...");
    const countries = await fetchAllCountries();
    console.log(`Found ${countries.length} countries. Checking data availability...`);

    const missingDataCountries = [];

    // Process in chunks to avoid rate limiting
    const CHUNK_SIZE = 20;
    for (let i = 0; i < countries.length; i += CHUNK_SIZE) {
        const chunk = countries.slice(i, i + CHUNK_SIZE);
        const promises = chunk.map(async (c) => {
            const hasData = await checkCountryData(c.code);
            if (!hasData) {
                // console.log(`❌ ${c.name} (${c.code}) has NO data for selected indicators.`);
                return c;
            }
            return null;
        });

        const results = await Promise.all(promises);
        results.forEach(r => {
            if (r) missingDataCountries.push(r);
        });

        process.stdout.write(`.`);
    }

    console.log("\n\n--- Countries with NO data (Growth, Inflation, Debt) ---\n");
    if (missingDataCountries.length === 0) {
        console.log("✅ All countries have at least some data!");
    } else {
        missingDataCountries.forEach(c => console.log(`- ${c.name} (${c.code})`));
        console.log(`\nTotal: ${missingDataCountries.length} countries might show as empty cards.`);
    }
}

run();
