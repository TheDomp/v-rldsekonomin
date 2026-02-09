// Standalone script to test IMF API access for government debt
// Run with: npx ts-node fetchIMF.ts

const IMF_API_BASE = 'http://dataservices.imf.org/REST/SDMX_JSON.svc';
// Dataflow for "Fiscal Monitor" (contains debt data)
const DATAFLOW_ID = 'FM';

async function fetchIMFDebt(countryCode: string) {
    try {
        console.log(`Fetching IMF debt data for ${countryCode}...`);

        // Indicator: GG_DID_G01_GDP_PT_Z_PCH (General Government Gross Debt % of GDP)
        // Dimension filters usually: Frequency.Country.Indicator
        // A: Annual
        // US, SE: Country Codes (ISO2 mostly used in IMF SDMX? Actually it's often ISO2 but let's verify)
        // NOTE: IMF often uses its own area codes or ISO2.

        const url = `${IMF_API_BASE}/CompactData/${DATAFLOW_ID}/A.${countryCode}.GG_DID_G01_GDP_PT_Z_PCH?startPeriod=2020`;
        console.log(`URL: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`IMF API Status: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        const data = JSON.parse(text);

        // Navigation into the complex SDMX structure
        const series = data.CompactData?.DataSet?.Series;

        if (!series) {
            console.log(`No series found for ${countryCode}.`);
            return;
        }

        const obs = series.Obs;
        if (Array.isArray(obs)) {
            // Get latest
            const latest = obs[obs.length - 1];
            console.log(`✅ IMF Data for ${countryCode}: Year ${latest['@TIME_PERIOD']} -> Debt: ${latest['@OBS_VALUE']}%`);
        } else if (obs) {
            console.log(`✅ IMF Data for ${countryCode}: Year ${obs['@TIME_PERIOD']} -> Debt: ${obs['@OBS_VALUE']}%`);
        } else {
            console.log('No observations found.');
        }

    } catch (error) {
        console.error(`❌ Error for ${countryCode}:`, error);
    }
}

// Run test
(async () => {
    await fetchIMFDebt('SE');
    await fetchIMFDebt('US');
    await fetchIMFDebt('CN'); // China often uses CN in ISO2
    await fetchIMFDebt('RU'); // Russia
})();
