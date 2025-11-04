import React, { useState } from "react";
import {Slider} from "@/components/ui/slider";
import {Button} from "@/components/ui/button";
import CitySelect from "@/components/buy-car/CitySelect";
import { ChevronDown } from "lucide-react";

export type FiltersPanelProps = {
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;

  selectedBrands: string[];
  setSelectedBrands: (updater: (prev: string[]) => string[]) => void;

  city: string;
  setCity: (city: string) => void;

  selectedFuels: string[];
  setSelectedFuels: (updater: (prev: string[]) => string[]) => void;

  selectedTransmissions: string[];
  setSelectedTransmissions: (updater: (prev: string[]) => string[]) => void;

  yearRange: [number, number];
  setYearRange: (v: [number, number]) => void;

  mileageRange: [number, number];
  setMileageRange: (v: [number, number]) => void;

  brandList: string[];
  onUseMyLocation: () => void;
};

const FiltersPanel: React.FC<FiltersPanelProps> = ({
                                                     priceRange,
                                                     setPriceRange,
                                                     selectedBrands,
                                                     setSelectedBrands,
                                                     city,
                                                     setCity,
                                                     selectedFuels,
                                                     setSelectedFuels,
                                                     selectedTransmissions,
                                                     setSelectedTransmissions,
                                                     yearRange,
                                                     setYearRange,
                                                     mileageRange,
                                                     setMileageRange,
                                                     brandList,
                                                     onUseMyLocation,
                                                   }) => {
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    price: true,
    specs: false,
    location: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Filters</h3>

      {/* Location */}
      <div className="pb-3 border-b">
        <label className="text-sm font-medium text-gray-700 block mb-2">Location</label>
        <div className="flex gap-2 items-center flex-wrap">
          <Button onClick={onUseMyLocation} size="sm" className="text-xs h-8">
            My Location
          </Button>
          <CitySelect value={city} setValue={setCity}/>
        </div>
      </div>

      {/* Price Range */}
      <div className="pb-3 border-b">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-2 hover:text-blue-600"
        >
          <label className="text-sm font-medium text-gray-700">Price</label>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.price && (
          <div className="space-y-2">
            <Slider
              min={0}
              max={3_000_000}
              step={50_000}
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              className="mt-1"
            />
            <div className="flex justify-between text-xs text-gray-600 gap-2">
              <span>₹{(priceRange[0] / 100_000).toFixed(1)}L</span>
              <span>₹{(priceRange[1] / 100_000).toFixed(1)}L</span>
            </div>
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="pb-3 border-b">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full mb-2 hover:text-blue-600"
        >
          <label className="text-sm font-medium text-gray-700">
            Brand {selectedBrands.length > 0 && <span className="text-blue-600 ml-1">({selectedBrands.length})</span>}
          </label>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.brand ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.brand && (
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
            {brandList.slice(0, 12).map((brand) => (
              <label key={brand} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  value={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedBrands((prev) =>
                      prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
                    );
                  }}
                  className="mr-2 h-3 w-3 cursor-pointer"
                />
                <span className="cursor-pointer">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Specifications */}
      <div className="pb-3 border-b">
        <button
          onClick={() => toggleSection('specs')}
          className="flex items-center justify-between w-full mb-2 hover:text-blue-600"
        >
          <label className="text-sm font-medium text-gray-700">Specifications</label>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.specs ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.specs && (
          <div className="space-y-3 mt-2">
            {/* Fuel Type */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Fuel</p>
              <div className="flex flex-wrap gap-2">
                {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((fuel) => (
                  <label key={fuel} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      value={fuel.toLowerCase()}
                      checked={selectedFuels.includes(fuel.toLowerCase())}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedFuels((prev) =>
                          prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
                        );
                      }}
                      className="mr-1 h-3 w-3 cursor-pointer"
                    />
                    <span className="cursor-pointer text-xs">{fuel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Transmission</p>
              <div className="flex gap-2">
                {["Manual", "Automatic"].map((transmission) => (
                  <label key={transmission} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      value={transmission}
                      checked={selectedTransmissions.includes(transmission)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedTransmissions((prev) =>
                          prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
                        );
                      }}
                      className="mr-1 h-3 w-3 cursor-pointer"
                    />
                    <span className="cursor-pointer text-xs">{transmission}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Year */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Year: {yearRange[0]} - {yearRange[1]}</p>
              <Slider
                min={1900}
                max={2025}
                step={1}
                value={yearRange}
                onValueChange={(v) => setYearRange(v as [number, number])}
                className="mt-1"
              />
            </div>

            {/* Mileage */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Mileage: {mileageRange[0]} - {mileageRange[1]} km</p>
              <Slider
                min={0}
                max={200000}
                step={5000}
                value={mileageRange}
                onValueChange={(v) => setMileageRange(v as [number, number])}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;
