import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Slider} from "@/components/ui/slider";
import {getCarSummaries} from "@/lib/carapi";
import {ChevronDown, Heart, Search, Sliders} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

type Car = {
  id: string;
  title: string;
  images: string[];
  price: string;
  emi: string;
  location: string;
  specs: {
    year: number;
    km: string;
    fuel: string;
    transmission: string;
    owner: string;
    insurance: string;
  };
  features: string[];
  highlights: string[];
  tag: string;
  maintenanceInsights: {
    monthlyMaintenanceCost: number;
    serviceInsight: string;
    tireInsight: string;
    batteryInsight: string;
  }
};

function LoaderCard() {
  return (
    <div className="bg-white rounded-lg shadow-md animate-pulse overflow-hidden">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

const index = () => {
  const [priceRange, setPriceRange] = useState([0, 1_000_000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [cars, setCars] = useState<Car[] | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      const car = await getCarSummaries();
      setCars(car);
    };

    fetchCars();
  });

  return (
    <div className="bg-gray-100">
      <div className="text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter */}
          <div className="md:col-span-1 space-y-6">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Range
                </label>
                <Slider
                  defaultValue={[0, 1_000_000]}
                  max={1_000_000}
                  step={10_000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{priceRange[0]}</span>
                  <span>{priceRange[1]}</span>
                </div>
              </div>
              <div>
                <label>Brand</label>
                <div>
                  {["Maruti", "Hyundai", "Honda", "Tata"].map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        value={brand}
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedBrands((prev) =>
                            prev.includes(value)
                              ? prev.filter((b) => b !== value)
                              : [...prev, value]
                          );
                        }}
                        className="mr-2"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* cars grid */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Used Cars in Delhi NCR</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search cars..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
              </div>
              <Button
                variant="outline"
                className="flex items-center  text-white"
              >
                <Sliders className="h-4 w-4 mr-2"/>
                Sort
                <ChevronDown className="h-4 w-4 ml-2"/>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars === null
              ? Array.from({length: 6}).map((_, index) => (
                <LoaderCard key={index}/>
              ))
              : cars.map((car) => (
                <Link
                  key={car.id}
                  href={`/buy-car/${car.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={car.images[0]}
                      alt={car.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      title={car.title}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white"
                    >
                      <Heart className="h-4 w-4 text-gray-500 hover:text-red-500"/>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {car.title}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-600">{car.specs.km} km</div>
                      <div className="text-sm text-gray-600">
                        {car.specs.transmission}
                      </div>
                      <div className="text-sm text-gray-600">
                        {car.specs.fuel}
                      </div>
                      <div className="text-sm text-gray-600">
                        {car.specs.owner}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">EMI from</div>
                        <div className="font-semibold">₹{car.emi}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Price</div>
                        <div className="font-semibold">₹{car.price}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {car.location}
                    </div>
                    <div>
                      {car.tag && (
                        <div
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1.5 w-fit rounded-full mt-2">
                          {car.tag}
                        </div>
                      )}
                    </div>
                    <div>
                      {car.maintenanceInsights.monthlyMaintenanceCost !== 0 ? (
                        <div
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1.5 w-fit rounded-full mt-2">
                          Estimated maintenance cost: ₹{car.maintenanceInsights.monthlyMaintenanceCost.toString()}/mo
                        </div>
                      ) : (
                        <div
                          className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1.5 w-fit rounded-full mt-2">
                          Estimated maintenance cost not available.
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 bg-blue-100 p-2 rounded-lg mt-4">
                      <p className="text-blue-800 text-sm">Insights</p>
                      <ul className="list-disc list-outside ps-4">
                        {car.maintenanceInsights.serviceInsight && (
                          <li className="text-sm text-gray-600">{car.maintenanceInsights.serviceInsight}</li>
                        )}
                        {car.maintenanceInsights.tireInsight && (
                          <li className="text-sm text-gray-600">{car.maintenanceInsights.tireInsight}</li>
                        )}
                        {car.maintenanceInsights.batteryInsight && (
                          <li className="text-sm text-gray-600 ">{car.maintenanceInsights.batteryInsight}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default index;
