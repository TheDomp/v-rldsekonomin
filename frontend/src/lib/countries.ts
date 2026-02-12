export interface CountryOption {
    code: string;
    name: string;
    region: string;
}

export const AVAILABLE_COUNTRIES: CountryOption[] = [
    // Nordics
    { code: 'SWE', name: 'Sweden', region: 'Europe' },
    { code: 'NOR', name: 'Norway', region: 'Europe' },
    { code: 'DNK', name: 'Denmark', region: 'Europe' },
    { code: 'FIN', name: 'Finland', region: 'Europe' },
    { code: 'ISL', name: 'Iceland', region: 'Europe' },

    // Europe
    { code: 'DEU', name: 'Germany', region: 'Europe' },
    { code: 'FRA', name: 'France', region: 'Europe' },
    { code: 'GBR', name: 'United Kingdom', region: 'Europe' },
    { code: 'ITA', name: 'Italy', region: 'Europe' },
    { code: 'ESP', name: 'Spain', region: 'Europe' },
    { code: 'NLD', name: 'Netherlands', region: 'Europe' },
    { code: 'CHE', name: 'Switzerland', region: 'Europe' },
    { code: 'POL', name: 'Poland', region: 'Europe' },
    { code: 'PRT', name: 'Portugal', region: 'Europe' },
    { code: 'GRC', name: 'Greece', region: 'Europe' },
    { code: 'UKR', name: 'Ukraine', region: 'Europe' },
    { code: 'IRL', name: 'Ireland', region: 'Europe' },
    { code: 'AUT', name: 'Austria', region: 'Europe' },

    // Eurasia
    { code: 'RUS', name: 'Russia', region: 'Eurasia' },
    { code: 'TUR', name: 'Turkey', region: 'Asia' },

    // Asia
    { code: 'CHN', name: 'China', region: 'Asia' },
    { code: 'JPN', name: 'Japan', region: 'Asia' },
    { code: 'IND', name: 'India', region: 'Asia' },
    { code: 'KOR', name: 'South Korea', region: 'Asia' },
    { code: 'IDN', name: 'Indonesia', region: 'Asia' },
    { code: 'SAU', name: 'Saudi Arabia', region: 'Asia' },
    { code: 'ISR', name: 'Israel', region: 'Asia' },
    { code: 'ARE', name: 'United Arab Emirates', region: 'Asia' },
    { code: 'SGP', name: 'Singapore', region: 'Asia' },
    { code: 'THA', name: 'Thailand', region: 'Asia' },
    { code: 'VNM', name: 'Vietnam', region: 'Asia' },
    { code: 'PHL', name: 'Philippines', region: 'Asia' },
    { code: 'PAK', name: 'Pakistan', region: 'Asia' },
    { code: 'MYS', name: 'Malaysia', region: 'Asia' },

    // North America
    { code: 'USA', name: 'USA', region: 'North America' },
    { code: 'CAN', name: 'Canada', region: 'North America' },
    { code: 'MEX', name: 'Mexico', region: 'North America' },

    // South & Central America
    { code: 'BRA', name: 'Brazil', region: 'South America' },
    { code: 'ARG', name: 'Argentina', region: 'South America' },
    { code: 'CHL', name: 'Chile', region: 'South America' },
    { code: 'COL', name: 'Colombia', region: 'South America' },
    { code: 'PER', name: 'Peru', region: 'South America' },

    // Africa
    { code: 'ZAF', name: 'South Africa', region: 'Africa' },
    { code: 'NGA', name: 'Nigeria', region: 'Africa' },
    { code: 'EGY', name: 'Egypt', region: 'Africa' },
    { code: 'KEN', name: 'Kenya', region: 'Africa' },
    { code: 'MAR', name: 'Morocco', region: 'Africa' },
    { code: 'ETH', name: 'Ethiopia', region: 'Africa' },
    { code: 'GHA', name: 'Ghana', region: 'Africa' },

    // Oceania
    { code: 'AUS', name: 'Australia', region: 'Oceania' },
    { code: 'NZL', name: 'New Zealand', region: 'Oceania' },
];
