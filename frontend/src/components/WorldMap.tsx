import React from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from "react-simple-maps";
import type { CountryData } from "../lib/types";
import { getStatusColor } from "../lib/healthEngine";

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/master/world.json";

interface WorldMapProps {
    countries: CountryData[];
    onCountryClick: (country: CountryData) => void;
    selectedCodes: string[];
}

export const WorldMap: React.FC<WorldMapProps> = ({
    countries,
    onCountryClick,
    selectedCodes
}) => {
    const countryMap = countries.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
    }, {} as Record<string, CountryData>);

    return (
        <div className="w-full aspect-[16/9] bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl relative">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-lg font-bold text-white">Global Health Map</h3>
                <p className="text-xs text-[var(--color-eco-text-muted)]">Click a country to select/view details</p>
            </div>

            <div className="absolute bottom-4 left-4 z-10 flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-eco-success)]" />
                    <span className="text-slate-300">Success</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-eco-warning)]" />
                    <span className="text-slate-300">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-eco-danger)]" />
                    <span className="text-slate-300">Danger</span>
                </div>
            </div>

            <ComposableMap
                projectionConfig={{ scale: 200 }}
                className="w-full h-full"
            >
                <ZoomableGroup>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const countryId = geo.id || geo.properties.ISO_A3 || geo.properties.iso_a3;
                                const country = countryMap[countryId];
                                const isSelected = selectedCodes.includes(countryId);

                                let fillColor = "#1e293b"; // Slate-800 equivalent
                                if (country) {
                                    fillColor = getStatusColor(country.status).replace('text-', '').replace('[var(--color-', '').replace(')]', '');
                                    // Map Tailwind status colors to hex for SVG
                                    if (country.status === 'Success') fillColor = "#2ECC71";
                                    else if (country.status === 'Warning') fillColor = "#F1C40F";
                                    else if (country.status === 'Danger') fillColor = "#E74C3C";
                                }

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onClick={() => {
                                            if (country) {
                                                onCountryClick(country);
                                            } else {
                                                // If not in current fetched list, maybe we should still allow selecting?
                                                // For now, only interact with fetched countries
                                            }
                                        }}
                                        style={{
                                            default: {
                                                fill: isSelected ? fillColor : "#1e293b",
                                                stroke: isSelected ? "#fff" : "#334155",
                                                strokeWidth: isSelected ? 1 : 0.5,
                                                outline: "none",
                                                transition: "all 250ms",
                                                opacity: country ? 1 : 0.3
                                            },
                                            hover: {
                                                fill: country ? fillColor : "#334155",
                                                stroke: "#fff",
                                                strokeWidth: 1,
                                                outline: "none",
                                                cursor: country ? "pointer" : "default",
                                                opacity: 1
                                            },
                                            pressed: {
                                                fill: fillColor,
                                                outline: "none",
                                            }
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </div>
    );
};
