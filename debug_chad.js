
const WB_API_BASE = 'https://api.worldbank.org/v2/country';

async function fetchCountryDetails(isoCode) {
    try {
        const response = await fetch(`${WB_API_BASE}/${isoCode}?format=json`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 1 && data[1][0]) {
            console.log(`✅ Found details for ${isoCode}:`, data[1][0].name);
            return data[1][0];
        } else {
            console.error(`❌ Details NOT found for ${isoCode}`);
            console.log('Raw response:', JSON.stringify(data, null, 2));
            return null;
        }
    } catch (error) {
        console.error(`❌ Network error fetching details for ${isoCode}`, error);
        return null;
    }
}

// Indicators from dataService.ts
const INDICATORS = {
    gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
    inflation: 'FP.CPI.TOTL.ZG',
    govDebt: 'GC.DOD.TOTL.GD.ZS',
};

async function checkIndicators(isoCode) {
    for (const [key, indicatorCode] of Object.entries(INDICATORS)) {
        const url = `${WB_API_BASE}/${isoCode}/indicator/${indicatorCode}?format=json&per_page=1&date=2020:2025`;
        console.log(`Fetching ${key} (${indicatorCode})...`);
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 1 && data[1] && data[1].length > 0 && data[1][0].value !== null) {
                console.log(`   ✅ ${key}: ${data[1][0].value} (${data[1][0].date})`);
            } else {
                console.log(`   ⚠️ ${key}: No data found`);
            }
        } catch (e) {
            console.log(`   ❌ ${key}: Error ${e.message}`);
        }
    }
}

async function run() {
    console.log("--- Testing TCD (Chad) ---");
    const details = await fetchCountryDetails('TCD');
    if (details) {
        await checkIndicators('TCD');
    }
}

run();
