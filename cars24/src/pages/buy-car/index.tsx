import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Slider} from "@/components/ui/slider";
import {getCarSummaries} from "@/lib/carapi";
import {ChevronDown, Heart, Search, Sliders} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import CitySelect from "@/components/buy-car/CitySelect";
import CarCard from "@/components/buy-car/CarCard";

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
  const [city, setCity] = useState<string>("All");
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2025]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([0, 200000]);

  useEffect(() => {
    const fetchCars = async () => {
      const car = await getCarSummaries(city);
      setCars(car);
    };

    fetchCars().then();
  }, [city]);

  function getUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log('User location:', {latitude, longitude});
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('Permission denied to access location. Please enable it in your browser settings.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable. Please select a city manually.');
              break;
            case error.TIMEOUT:
              alert('The request to get user location timed out.');
              break;
            default:
              alert('An unknown error occurred. Please try again.');
          }
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  const brandList = [
    "Maruti", "Suzuki", "Tata", "Hyundai", "Mahindra", "Honda",
    "Toyota", "Kia", "Ford", "Skoda", "Volkswagen", "Nissan", "Renault",
    "MG", "Jeep", "BMW", "Mercedes", "Mercedes-Benz", "Audi", "Jaguar",
    "Land Rover", "Volvo", "Lexus", "Mini", "Porsche", "Tesla", "Maserati",
    "Chevrolet", "Fiat", "Mitsubishi", "Subaru", "Datsun", "Buick", "Acura",
    "Cadillac", "Infiniti", "Mazda", "Chrysler", "Dodge", "Ram", "Genesis", "Lincoln"
  ];

  function getBrandFromTitle(title) {
    const lower = title.toLowerCase();
    for (const brand of brandList) {
      if (lower.includes(brand.toLowerCase())) return brand;
    }
    return "";
  }


  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`http://localhost:5207/api/search/suggestions?query=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => setSuggestions(Array.isArray(data) ? data : []))
        .catch(() => setSuggestions([]));
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  function handleSubmit(searchText) {
    setSelectedBrands([]);
    fetch(`http://localhost:5207/api/search?query=${encodeURIComponent(searchText)}&city=${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then(data => setResults(Array.isArray(data) ? data : []));
  }

  const idOrderMap = new Map(results.map((id, idx) => [id, idx]));

  const displayCars = cars && results.length > 0
    ? cars.filter(c => results.includes(c.id)).sort((a, b) => idOrderMap.get(a.id) - idOrderMap.get(b.id))
    : cars || [];

  let displayCarsFiltered = displayCars;

// Brand filter (if used)
  if (selectedBrands.length > 0) {
    displayCarsFiltered = displayCarsFiltered.filter(car =>
      selectedBrands.some(brand =>
        brand.toLowerCase() === getBrandFromTitle(car.title).toLowerCase()
      )
    );
  }

// Fuel type
  if (selectedFuels.length > 0) {
    displayCarsFiltered = displayCarsFiltered.filter(car =>
      selectedFuels.some(fuel =>
        (car.specs.fuel || "").toLowerCase() === fuel.toLowerCase()
      )
    );
  }

// Transmission type
  if (selectedTransmissions.length > 0) {
    displayCarsFiltered = displayCarsFiltered.filter(car =>
      selectedTransmissions.some(tran =>
        (car.specs.transmission || "").toLowerCase() === tran.toLowerCase()
      )
    );
  }

// Year range
  displayCarsFiltered = displayCarsFiltered.filter(car =>
    (car.specs.year || 0) >= yearRange[0] && (car.specs.year || 0) <= yearRange[1]
  );

// Mileage range
  displayCarsFiltered = displayCarsFiltered.filter(car => {
    const mileage = parseInt((car.specs.km || "0").replace(/,/g, "")) || 0;
    return mileage >= mileageRange[0] && mileage <= mileageRange[1];
  });

// Price range
  displayCarsFiltered = displayCarsFiltered.filter(car => {
    const price = parseInt(String(car.price || "0").replace(/[^0-9]/g, "")) || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });


  return (
    <div className="bg-gray-100">
      <div className="text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter */}
          <div className="md:col-span-1 space-y-6">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className={'flex flex-col mt-4 gap-1'}>
                  <Button onClick={getUserLocation} className={'w-fit'}>Use my location</Button>
                  <p className={'text-sm'}>or manually select your city</p>
                  <CitySelect value={city} setValue={setCity}/>
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
                        onChange={e => {
                          const value = e.target.value;
                          setSelectedFuels(prev =>
                            prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
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
                  {["Manual", "Automatic"].map(transmission => (
                    <label key={transmission} className="flex items-center">
                      <input
                        type="checkbox"
                        value={transmission}
                        checked={selectedTransmissions.includes(transmission)}
                        onChange={e => {
                          const value = e.target.value;
                          setSelectedTransmissions(prev =>
                            prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
                          );
                        }}
                        className="mr-2"
                      />
                      <span>{transmission}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Slider
                  min={2000}
                  max={2025}
                  step={1}
                  value={yearRange}
                  onValueChange={setYearRange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>

              {/* Mileage Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Mileage (km)</label>
                <Slider
                  min={0}
                  max={200000}
                  step={1000}
                  value={mileageRange}
                  onValueChange={setMileageRange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{mileageRange[0].toLocaleString()}</span>
                  <span>{mileageRange[1].toLocaleString()}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {displayCarsFiltered.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No cars found for your search or filters.
          </div>
        )}

        {/* car grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {displayCarsFiltered.map(car => <CarCard key={car.id} car={car}/>)}
          </div>

        ) : (
          <div className="md:col-span-3 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Used Cars in Delhi NCR</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">

                  {/* Search Bar */}
                  <Input
                    type="text"
                    placeholder="Search cars..."
                    className="pl-10"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmit(query);
                      }
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>

                  {suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 bg-white border rounded shadow mt-1 z-20">
                      {suggestions.map((s, idx) => (
                        <li
                          key={s + idx}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setQuery(s);
                            setSuggestions([]);
                            handleSubmit(s);
                          }}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4">
                    {Array.isArray(results) && results.map(r => (
                      <div key={r.id} className="p-2 border-b">
                        <strong>{r.brand} {r.model}</strong> — {r.location}
                        <div>{r.title}</div>
                      </div>
                    ))}
                  </div>

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
                : displayCarsFiltered.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
    ;
};
export default index;
