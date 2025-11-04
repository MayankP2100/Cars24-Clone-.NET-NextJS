import {Button} from "@/components/ui/button";
import {ChevronDown, Sliders} from "lucide-react";
import {useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import CarCard from "@/components/buy-car/CarCard";
import LoaderCard from "@/components/buy-car/LoaderCard";
import FiltersPanel from "@/components/buy-car/FiltersPanel";
import SearchBar from "@/components/buy-car/SearchBar";
import {useCarSummaries} from "@/hooks/useCarSummaries";
import {useSearchSuggestions} from "@/hooks/useSearchSuggestions";
import {filterAndOrderCars, SortOption} from "@/lib/filterCars";
import {brandList} from "@/lib/cars";
import {searchCars} from "@/lib/carapi";

const index = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3_000_000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [city, setCity] = useState<string>("All");
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1900, 2025]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([0, 200000]);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const {cars} = useCarSummaries(city);

  function getUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log('User location:', {latitude, longitude});
        },
        (error) => {
          // show relevant error message based on the error type
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

  // search query and suggestions
  const [query, setQuery] = useState('');
  const suggestions = useSearchSuggestions(query);
  const [results, setResults] = useState<string[]>([]);

  // search and filter cars by query
  function handleSubmit() {
    setSelectedBrands([]);
    searchCars(query, city).then(data => setResults(Array.isArray(data) ? data : []));
  }

  const displayCarsFiltered = filterAndOrderCars(cars, results, {
    priceRange,
    selectedBrands,
    selectedFuels,
    selectedTransmissions,
    yearRange,
    mileageRange,
    sortBy,
  });


  return (
    <div className="bg-gray-100">
      <div className="text-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8bg-white">

        {/* Filters Options */}
        <div className="flex flex-wrap gap-6">
          <FiltersPanel
            priceRange={priceRange as [number, number]}
            setPriceRange={(v) => setPriceRange(v)}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            city={city}
            setCity={setCity}
            selectedFuels={selectedFuels}
            setSelectedFuels={setSelectedFuels}
            selectedTransmissions={selectedTransmissions}
            setSelectedTransmissions={setSelectedTransmissions}
            yearRange={yearRange}
            setYearRange={(v) => setYearRange(v)}
            mileageRange={mileageRange}
            setMileageRange={(v) => setMileageRange(v)}
            brandList={brandList}
            onUseMyLocation={getUserLocation}
          />
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {displayCarsFiltered.map(car => <CarCard key={car.id} car={car}/>)}
          </div>

        ) : (
          <div className="md:col-span-3 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Used Cars in Delhi NCR</h1>
              <div className="flex items-center space-x-4">

                <SearchBar
                  query={query}
                  setQuery={setQuery}
                  suggestions={suggestions}
                  onSubmit={handleSubmit}
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center text-white"
                    >
                      <Sliders className="h-4 w-4 mr-2"/>
                      Sort
                      <ChevronDown className="h-4 w-4 ml-2"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('default')}>
                      Default
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('price-low-high')}>
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('price-high-low')}>
                      Price: High to Low
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('year-new-old')}>
                      Year: Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('year-old-new')}>
                      Year: Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('mileage-low-high')}>
                      Mileage: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('mileage-high-low')}>
                      Mileage: High to Low
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars === null
                ?
                Array.from({length: 6}).map((_, index) => (
                  <LoaderCard key={index}/>
                ))
                :
                displayCarsFiltered.map((car) => (
                  <CarCard key={car.id} car={car}/>
                ))}
            </div>

            {displayCarsFiltered.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No cars found for your search or filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default index;
