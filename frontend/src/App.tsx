import { useState, useEffect } from 'react';
import { analytics } from './lib/firebase';
import { logEvent } from 'firebase/analytics';
import type { CountryData } from './lib/types';
import { CountryCard } from './components/CountryCard';
import { LoadingCard } from './components/LoadingCard';
import { DetailView } from './components/DetailView';
import { CountrySelector } from './components/CountrySelector';
import { Activity, Globe, RefreshCcw, LayoutGrid, Map as MapIcon, TrendingUp } from 'lucide-react';
import { useCountryData } from './hooks/useCountryData';
import { WorldMap } from './components/WorldMap';
import { ComparisonView } from './components/ComparisonView';
import { PowerhouseView } from './components/PowerhouseView';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';
import { AboutOverlay } from './components/AboutOverlay';

// Default initial countries (Empty to keep start page clean per user request)
const DEFAULT_COUNTRIES: string[] = [];

function App() {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view');
    }
  }, []);

  const [selectedCodes, setSelectedCodes] = useState<string[]>(DEFAULT_COUNTRIES);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const { countries, loading, loadingCodes, error, refresh } = useCountryData(selectedCodes);

  const handleCountryClick = (country: CountryData) => {
    setSelectedCountry(country);
  };

  const toggleCountry = (code: string) => {
    setSelectedCodes(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const clearAllCountries = () => {
    setSelectedCodes([]);
  };

  return (
    <div className="min-h-screen bg-[var(--color-eco-dark)] text-[var(--color-eco-text)] p-4 md:p-8">
      <AboutOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-eco-success)]/10 rounded-lg">
            <Activity className="w-8 h-8 text-[var(--color-eco-success)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">EcoHealth Monitor</h1>
            <p className="text-sm text-[var(--color-eco-text-muted)]">Global Economic Vitality Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAboutOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-sm font-medium text-slate-300"
          >
            <Activity className="w-4 h-4" />
            <span>About Project</span>
          </button>

          {loading && <span className="text-sm text-[var(--color-eco-text-muted)] animate-pulse">Updating data...</span>}

          {/* View Toggle */}
          <div className="bg-slate-800 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                "p-1.5 rounded-md transition-colors",
                viewMode === 'grid' ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
              )}
              title="Grid"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={clsx(
                "p-1.5 rounded-md transition-colors",
                viewMode === 'map' ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
              )}
              title="Map"
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={refresh}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            title="Refresh data"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="px-4 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Select Countries ({selectedCodes.length})
          </button>
          <button
            onClick={() => setIsComparisonOpen(!isComparisonOpen)}
            disabled={countries.length < 2}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              isComparisonOpen
                ? "bg-[var(--color-eco-success)] text-black"
                : "bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <TrendingUp className="w-4 h-4" />
            Compare {countries.length > 0 && `(${countries.length})`}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-[var(--color-eco-danger)] rounded-lg text-[var(--color-eco-danger)]">
            {error}
          </div>
        )}

        {/* Powerhouse View (Always Visible) */}
        <PowerhouseView />

        <AnimatePresence>
          {isComparisonOpen && countries.length >= 2 && (
            <div className="mb-12">
              <ComparisonView
                countries={countries}
                onClose={() => setIsComparisonOpen(false)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Loading / Empty State / Grid / Map */}
        {loading && countries.length === 0 && selectedCodes.length > 0 && loadingCodes.size > 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-eco-success)]"></div>
          </div>
        ) : (
          <>
            {(countries.length > 0 || loadingCodes.size > 0) && (
              <div className="mt-8 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl font-bold text-slate-200">Selected Countries</h2>
                {loadingCodes.size > 0 && (
                  <span className="ml-2 text-xs text-blue-400 animate-pulse flex items-center gap-1">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
                    Fetching {loadingCodes.size} {loadingCodes.size === 1 ? 'country' : 'countries'}...
                  </span>
                )}
              </div>
            )}

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countries.map((country) => (
                  <CountryCard
                    key={country.id}
                    country={country}
                    onClick={handleCountryClick}
                  />
                ))}
                {/* Show loading skeletons for countries still being fetched */}
                {Array.from(loadingCodes)
                  .filter(code => !countries.some(c => c.id === code))
                  .map(code => (
                    <LoadingCard key={`loading-${code}`} code={code} />
                  ))}
              </div>
            ) : (
              /* Only show map if there are countries to show, or simplified map? 
                 If no countries selected, map might be empty.
                 Let's keep it simple: render map if viewMode is map.
              */
              <div className={countries.length === 0 ? "hidden" : "block"}>
                <WorldMap
                  countries={countries}
                  onCountryClick={handleCountryClick}
                  selectedCodes={selectedCodes}
                />
              </div>
            )}
          </>
        )}
      </main>

      <DetailView country={selectedCountry} onClose={() => setSelectedCountry(null)} />

      <CountrySelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        selectedCodes={selectedCodes}
        onToggle={toggleCountry}
        onClear={clearAllCountries}
      />
      <footer className="mt-20 py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-4">
            Data provided by <a href="https://data.worldbank.org/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-eco-success)] hover:underline">World Bank Open Data</a>.
          </p>
          <p className="text-xs text-slate-600">
            Supplementary data for Q3 2024 from Eurostat, IMF, NBS China, St. Louis Fed, Rosstat, FocusEconomics and CBR.
          </p>
          <p className="mt-4 text-xs">
            © 2026 EcoHealth Monitor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
