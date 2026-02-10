import { useState } from 'react';
import type { CountryData } from './lib/types';
import { CountryCard } from './components/CountryCard';
import { DetailView } from './components/DetailView';
import { CountrySelector } from './components/CountrySelector';
import { Activity, Globe, RefreshCcw, LayoutGrid, Map as MapIcon, TrendingUp } from 'lucide-react';
import { useCountryData } from './hooks/useCountryData';
import { WorldMap } from './components/WorldMap';
import { ComparisonView } from './components/ComparisonView';
import { PowerhouseView } from './components/PowerhouseView';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';

// Default initial countries
const DEFAULT_COUNTRIES = ['SWE', 'USA', 'CHN', 'DEU', 'BRA', 'ARG', 'TUR', 'NOR', 'FRA', 'GBR', 'JPN', 'IND'];

function App() {
  const [selectedCodes, setSelectedCodes] = useState<string[]>(DEFAULT_COUNTRIES);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const { countries, loading, error, refresh } = useCountryData(selectedCodes);

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

  const selectAllCountries = (codes: string[]) => {
    setSelectedCodes(codes);
  };

  const clearAllCountries = () => {
    setSelectedCodes([]);
  };

  return (
    <div className="min-h-screen bg-[var(--color-eco-dark)] text-[var(--color-eco-text)] p-4 md:p-8">
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
          {loading && <span className="text-sm text-[var(--color-eco-text-muted)] animate-pulse">Uppdaterar data...</span>}

          {/* View Toggle */}
          <div className="bg-slate-800 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                "p-1.5 rounded-md transition-colors",
                viewMode === 'grid' ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
              )}
              title="Rutnät"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={clsx(
                "p-1.5 rounded-md transition-colors",
                viewMode === 'map' ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
              )}
              title="Karta"
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={refresh}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            title="Uppdatera data"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsSelectorOpen(true)}
            className="px-4 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Välj Länder ({selectedCodes.length})
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
            Jämför {countries.length > 0 && `(${countries.length})`}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-[var(--color-eco-danger)] rounded-lg text-[var(--color-eco-danger)]">
            {error}
          </div>
        )}

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

        {loading && countries.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-eco-success)]"></div>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  onClick={handleCountryClick}
                />
              ))}
            </div>
          ) : (
            <WorldMap
              countries={countries}
              onCountryClick={handleCountryClick}
              selectedCodes={selectedCodes}
            />
          )
        )}
      </main>

      <DetailView country={selectedCountry} onClose={() => setSelectedCountry(null)} />

      <CountrySelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        selectedCodes={selectedCodes}
        onToggle={toggleCountry}
        onSelectAll={selectAllCountries}
        onClear={clearAllCountries}
      />
    </div>
  );
}

export default App;
