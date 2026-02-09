import { useState, useEffect, useCallback } from 'react';
import type { CountryData } from '../lib/types';
import { fetchCountryData } from '../lib/dataService';

export function useCountryData(countryCodes: string[]) {
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const promises = countryCodes.map(code => fetchCountryData(code));
            const results = await Promise.all(promises);
            const validCountries = results.filter((c): c is CountryData => c !== null);
            setCountries(validCountries);
        } catch (err) {
            console.error("Failed to fetch country data", err);
            setError("Misslyckades att hämta data från World Bank.");
        } finally {
            setLoading(false);
        }
    }, [countryCodes.join(',')]); // Depend on the list of codes stringified

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { countries, loading, error, refresh: fetchData };
}
