// Script to test EU data availability
// Run with: npx ts-node fetchEUTest.ts

const WB_API_BASE = 'https://api.worldbank.org/v2/country';

const INDICATORS = {
    gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
    inflation: 'FP.CPI.TOTL.ZG',
    govDebt: 'GC.DOD.TOTL.GD.ZS',
    reserves: 'FI.RES.TOTL.MO',
};

async function checkEntity(code: string) {
    console.log(`\n--- Checking Data for ${code} ---`);

    for (const [key, indicator] of Object.entries(INDICATORS)) {
        const url = `${WB_API_BASE}/${code}/indicator/${indicator}?format=json&per_page=1&date=2020:2025`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 1 && data[1] && data[1][0]) {
                const val = data[1][0].value;
                const year = data[1][0].date;
                console.log(`✅ ${key}: ${val}% (${year})`);
            } else {
                console.log(`❌ ${key}: No data found.`);
            }
        } catch (e) {
            console.log(`❌ ${key}: Error fetching.`);
        }
    }
}

(async () => {
    await checkEntity('EUU'); // European Union
    await checkEntity('EMU'); // Euro Area
})();
