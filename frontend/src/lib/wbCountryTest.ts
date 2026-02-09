// Script to fetch all countries from World Bank to see structure
// Run with: npx ts-node fetchWBCountries.ts

const WB_API_BASE = 'https://api.worldbank.org/v2/country';

async function fetchAllCountries() {
    try {
        console.log('Fetching all countries from World Bank...');
        // per_page=300 to get all ~218 countries in one go
        const response = await fetch(`${WB_API_BASE}?format=json&per_page=300`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 1) {
            const countries = data[1];
            console.log(`Found ${countries.length} countries.`);

            // Log first 5 to see structure
            console.log('First 5:', JSON.stringify(countries.slice(0, 5), null, 2));

            // Check if Estonia is there
            const estonia = countries.find((c: any) => c.id === 'EST');
            if (estonia) {
                console.log('✅ Found Estonia:', estonia);
            } else {
                console.log('❌ Estonia not found in list.');
            }
        }
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

fetchAllCountries();
