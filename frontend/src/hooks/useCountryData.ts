import { useState, useEffect, useCallback, useRef } from 'react';
import type { CountryData } from '../lib/types';
import { fetchCountryData } from '../lib/dataService';

export function useCountryData(countryCodes: string[]) {
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [loadingCodes, setLoadingCodes] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef(0); // Generation counter to handle stale results

    const fetchData = useCallback(async () => {
        const generation = ++abortRef.current;
        setLoading(true);
        setError(null);

        // Mark all codes as loading
        setLoadingCodes(new Set(countryCodes));

        // Keep already-loaded countries that are still selected (instant display)
        setCountries(prev => prev.filter(c => countryCodes.includes(c.id)));

        try {
            // Fire off all fetches, but process results as they arrive
            const promises = countryCodes.map(async (code) => {
                try {
                    const result = await fetchCountryData(code);
                    // Only update if this is still the current generation
                    if (generation === abortRef.current && result) {
                        setCountries(prev => {
                            const filtered = prev.filter(c => c.id !== result.id);
                            return [...filtered, result];
                        });
                    }
                    // Remove from loading set
                    if (generation === abortRef.current) {
                        setLoadingCodes(prev => {
                            const next = new Set(prev);
                            next.delete(code.toUpperCase());
                            return next;
                        });
                    }
                    return result;
                } catch (err) {
                    console.error(`Failed to fetch ${code}:`, err);
                    if (generation === abortRef.current) {
                        setLoadingCodes(prev => {
                            const next = new Set(prev);
                            next.delete(code.toUpperCase());
                            return next;
                        });
                    }
                    return null;
                }
            });

            await Promise.all(promises);
        } catch (err) {
            console.error("Failed to fetch country data", err);
            if (generation === abortRef.current) {
                setError("Failed to fetch data from World Bank.");
            }
        } finally {
            if (generation === abortRef.current) {
                setLoading(false);
                setLoadingCodes(new Set());
            }
        }
    }, [countryCodes.join(',')]);

    useEffect(() => {
        if (countryCodes.length > 0) {
            fetchData();
        } else {
            setCountries([]);
            setLoadingCodes(new Set());
            setLoading(false);
        }
    }, [fetchData]);

    return { countries, loading, loadingCodes, error, refresh: fetchData };
}
