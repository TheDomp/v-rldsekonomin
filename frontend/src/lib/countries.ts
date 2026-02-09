export interface CountryOption {
    code: string;
    name: string;
    region: string;
}

export const AVAILABLE_COUNTRIES: CountryOption[] = [
    // Nordics
    { code: 'SWE', name: 'Sverige', region: 'Europe' },
    { code: 'NOR', name: 'Norge', region: 'Europe' },
    { code: 'DNK', name: 'Danmark', region: 'Europe' },
    { code: 'FIN', name: 'Finland', region: 'Europe' },
    { code: 'ISL', name: 'Island', region: 'Europe' },

    // Europe
    { code: 'DEU', name: 'Tyskland', region: 'Europe' },
    { code: 'FRA', name: 'Frankrike', region: 'Europe' },
    { code: 'GBR', name: 'Storbritannien', region: 'Europe' },
    { code: 'ITA', name: 'Italien', region: 'Europe' },
    { code: 'ESP', name: 'Spanien', region: 'Europe' },
    { code: 'NLD', name: 'Nederländerna', region: 'Europe' },
    { code: 'CHE', name: 'Schweiz', region: 'Europe' },
    { code: 'POL', name: 'Polen', region: 'Europe' },
    { code: 'PRT', name: 'Portugal', region: 'Europe' },
    { code: 'GRC', name: 'Grekland', region: 'Europe' },
    { code: 'UKR', name: 'Ukraina', region: 'Europe' },
    { code: 'IRL', name: 'Irland', region: 'Europe' },
    { code: 'AUT', name: 'Österrike', region: 'Europe' },

    // Eurasia
    { code: 'RUS', name: 'Ryssland', region: 'Eurasia' },
    { code: 'TUR', name: 'Turkiet', region: 'Asia' },

    // Asia
    { code: 'CHN', name: 'Kina', region: 'Asia' },
    { code: 'JPN', name: 'Japan', region: 'Asia' },
    { code: 'IND', name: 'Indien', region: 'Asia' },
    { code: 'KOR', name: 'Sydkorea', region: 'Asia' },
    { code: 'IDN', name: 'Indonesien', region: 'Asia' },
    { code: 'SAU', name: 'Saudiarabien', region: 'Asia' },
    { code: 'ISR', name: 'Israel', region: 'Asia' },
    { code: 'ARE', name: 'Förenade Arabemiraten', region: 'Asia' },
    { code: 'SGP', name: 'Singapore', region: 'Asia' },
    { code: 'THA', name: 'Thailand', region: 'Asia' },
    { code: 'VNM', name: 'Vietnam', region: 'Asia' },
    { code: 'PHL', name: 'Filippinerna', region: 'Asia' },
    { code: 'PAK', name: 'Pakistan', region: 'Asia' },
    { code: 'MYS', name: 'Malaysia', region: 'Asia' },

    // North America
    { code: 'USA', name: 'USA', region: 'North America' },
    { code: 'CAN', name: 'Kanada', region: 'North America' },
    { code: 'MEX', name: 'Mexiko', region: 'North America' },

    // South & Central America
    { code: 'BRA', name: 'Brasilien', region: 'South America' },
    { code: 'ARG', name: 'Argentina', region: 'South America' },
    { code: 'CHL', name: 'Chile', region: 'South America' },
    { code: 'COL', name: 'Colombia', region: 'South America' },
    { code: 'PER', name: 'Peru', region: 'South America' },

    // Africa
    { code: 'ZAF', name: 'Sydafrika', region: 'Africa' },
    { code: 'NGA', name: 'Nigeria', region: 'Africa' },
    { code: 'EGY', name: 'Egypten', region: 'Africa' },
    { code: 'KEN', name: 'Kenya', region: 'Africa' },
    { code: 'MAR', name: 'Marocko', region: 'Africa' },
    { code: 'ETH', name: 'Etiopien', region: 'Africa' },
    { code: 'GHA', name: 'Ghana', region: 'Africa' },

    // Oceania
    { code: 'AUS', name: 'Australien', region: 'Oceania' },
    { code: 'NZL', name: 'Nya Zeeland', region: 'Oceania' },
];
