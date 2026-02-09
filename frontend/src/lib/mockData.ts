import type { CountryData } from './types';

export const MOCK_COUNTRIES: CountryData[] = [
    {
        id: 'SWE',
        name: 'Sverige',
        flagCode: 'SE',
        dataYear: '2024',
        healthIndex: 78.5,
        status: 'Success',
        pillars: {
            liquidity: 85,
            burnRate: 80,
            debtStructure: 90,
            realGrowth: 60,
            demographics: 70
        },
        metrics: {
            reservesMonths: 3.5,
            gdpGrowth: 4.5,
            inflation: 65.0,
            debtToGdp: 32.0,
            currentAccount: -5.0,
            deficitGdp: -0.5,
            debtUsdShare: 5.0,
            dependencyRatio: 61.3,
            creditToGdpGap: 2.1,
            debtServiceRatio: 12.5,
            reerMisalignment: -5.0
        },
        metaphor: "Huset är stabilt och välskött, men familjen börjar bli för gammal för att sköta den stora trädgården."
    },
    {
        id: 'ARG',
        name: 'Argentina',
        flagCode: 'AR',
        dataYear: '2024',
        healthIndex: 32.1,
        status: 'Danger',
        pillars: {
            liquidity: 20,
            burnRate: 15,
            debtStructure: 30,
            realGrowth: 40,
            demographics: 65
        },
        metrics: {
            reservesMonths: 0.8,
            gdpGrowth: -3.5,
            inflation: 211.4,
            debtToGdp: 85.0,
            currentAccount: -3.5,
            deficitGdp: -4.2,
            debtUsdShare: 70.0,
            dependencyRatio: 56.4,
            creditToGdpGap: 15.3,
            debtServiceRatio: 45.0,
            reerMisalignment: 25.0
        },
        metaphor: "Taket läcker kraftigt och banken knackar på dörren varje dag."
    },
    {
        id: 'TUR',
        name: 'Turkiet',
        flagCode: 'TR',
        dataYear: '2024',
        healthIndex: 45.6,
        status: 'Warning',
        pillars: {
            liquidity: 40,
            burnRate: 35,
            debtStructure: 40,
            realGrowth: 65,
            demographics: 80
        },
        metrics: {
            reservesMonths: 12.5,
            gdpGrowth: 2.5,
            inflation: 4.5,
            debtToGdp: 35.0,
            currentAccount: 4.2,
            deficitGdp: -3.8,
            debtUsdShare: 45.0,
            dependencyRatio: 48.0,
            creditToGdpGap: 12.0,
            debtServiceRatio: 28.0,
            reerMisalignment: 10.0
        },
        metaphor: "Fasaden är nymålad men grunden skakar vid minsta vindpust."
    },
    {
        id: 'NOR',
        name: 'Norge',
        flagCode: 'NO',
        dataYear: '2024',
        healthIndex: 92.4,
        status: 'Success',
        pillars: {
            liquidity: 95,
            burnRate: 98,
            debtStructure: 95,
            realGrowth: 75,
            demographics: 72
        },
        metrics: {
            reservesMonths: 12.0,
            gdpGrowth: 1.5, // Added
            inflation: 3.0, // Added
            debtToGdp: 40.0, // Added
            currentAccount: 15.0, // Added
            deficitGdp: 12.0,
            debtUsdShare: 2.0,
            dependencyRatio: 55.0,
            creditToGdpGap: -5.0,
            debtServiceRatio: 8.0,
            reerMisalignment: -2.0
        },
        metaphor: "Ett slott byggt av olja och guld, säkrat för generationer."
    },
    {
        id: 'DEU',
        name: 'Tyskland',
        flagCode: 'DE',
        dataYear: '2024',
        healthIndex: 68.0,
        status: 'Warning', // Due to low growth and demographics
        pillars: {
            liquidity: 80,
            burnRate: 75,
            debtStructure: 85,
            realGrowth: 30, // Low growth
            demographics: 40 // Bad demographics
        },
        metrics: {
            reservesMonths: 6.0,
            gdpGrowth: -0.3,
            inflation: 2.5,
            debtToGdp: 66.0,
            currentAccount: 6.5,
            deficitGdp: -1.5,
            debtUsdShare: 0.0, // Eurozone
            dependencyRatio: 70.0,
            creditToGdpGap: -2.0,
            debtServiceRatio: 18.0,
            reerMisalignment: -5.0
        },
        metaphor: "Motorn hackar och föraren har pensionerat sig."
    }
];
