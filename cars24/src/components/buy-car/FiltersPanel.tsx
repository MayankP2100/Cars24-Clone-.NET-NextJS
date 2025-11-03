import React from "react";
import {Slider} from "@/components/ui/slider";
import {Button} from "@/components/ui/button";
import CitySelect from "@/components/buy-car/CitySelect";

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
  return (
    <div className="w-full space-y-6">
      <h3 className="font-semibold mb-4">Filters</h3>
      <div className="flex flex-wrap w-fit sm:gap-16 gap-4">
        {/* Brand */}
        <div className={'w-96'}>
          <label>Brand</label>
          <div className={'flex flex-wrap gap-4 gap-y-1'}>
            {brandList.slice(0, 12).map((brand) => (
              <label key={brand} className="flex items-center">
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
                  className="mr-2"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fuel Type */}
        <div>
          <label>Fuel</label>
          <div>
            {["petrol", "diesel", "cng", "electric", "hybrid"].map((fuel) => (
              <label key={fuel} className="flex items-center">
                <input
                  type="checkbox"
                  value={fuel}
                  checked={selectedFuels.includes(fuel)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedFuels((prev) =>
                      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
                    );
                  }}
                  className="mr-2"
                />
                <span>{fuel.charAt(0).toUpperCase() + fuel.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div>
          <label>Transmission</label>
          <div>
            {["Manual", "Automatic"].map((transmission) => (
              <label key={transmission} className="flex items-center">
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
                  className="mr-2"
                />
                <span>{transmission}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={'flex flex-col flex-wrap sm:gap-8 gap-4'}>
          {/* Year Range */}
          <div className={'w-96'}>
            <label className="text-sm font-medium mb-2 block">Year</label>
            <Slider
              min={2000}
              max={2025}
              step={1}
              value={yearRange}
              onValueChange={(v) => setYearRange(v as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>

          {/* Mileage Range */}
          <div className={'w-96'}>
            <label className="text-sm font-medium mb-2 block">Mileage (km)</label>
            <Slider
              min={0}
              max={200000}
              step={1000}
              value={mileageRange}
              onValueChange={(v) => setMileageRange(v as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{mileageRange[0]}</span>
              <span>{mileageRange[1]}</span>
            </div>
          </div>

          {/* Price */}
          <div className={'w-96'}>
            <label className="text-sm font-medium mb-2 block">Price Range</label>
            <Slider
              defaultValue={[0, 1_000_000]}
              max={1_000_000}
              step={10_000}
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{priceRange[0]}</span>
              <span>{priceRange[1]}</span>
            </div>
          </div>
        </div>

      </div>
      {/* Location */}
      <div className={"flex flex-col mt-4 gap-1"}>
        <Button onClick={onUseMyLocation} className={"w-fit"}>
          Use my location
        </Button>
        <div className={'flex gap-2 items-center'}>
          <p className={"text-sm"}>or manually select your city</p>
          <CitySelect value={city} setValue={setCity}/>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
