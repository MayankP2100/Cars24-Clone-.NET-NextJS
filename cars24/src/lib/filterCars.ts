import { Car } from "@/types/car";
import { getBrandFromTitle } from "@/lib/cars";

export type SortOption = 'default' | 'price-low-high' | 'price-high-low' | 'year-new-old' | 'year-old-new' | 'mileage-low-high' | 'mileage-high-low';

export type Filters = {
  priceRange: [number, number];
  selectedBrands: string[];
  selectedFuels: string[];
  selectedTransmissions: string[];
  yearRange: [number, number];
  mileageRange: [number, number];
  sortBy?: SortOption;
};

export function filterAndOrderCars(
  cars: Car[] | null | undefined,
  results: string[],
  filters: Filters
): Car[] {
  const {
    priceRange,
    selectedBrands,
    selectedFuels,
    selectedTransmissions,
    yearRange,
    mileageRange,
    sortBy = 'default',
  } = filters;

  const list: Car[] = Array.isArray(cars) ? cars.slice() : [];

  const idOrderMap = new Map(results.map((id, idx) => [id, idx] as const));

  let filtered = list;

  if (selectedBrands?.length) {
    filtered = filtered.filter((car) =>
      selectedBrands.some(
        (brand) => brand.toLowerCase() === getBrandFromTitle(car.title).toLowerCase()
      )
    );
  }

  if (selectedFuels?.length) {
    filtered = filtered.filter((car) =>
      selectedFuels.some(
        (fuel) => (car.specs.fuel || "").toLowerCase() === fuel.toLowerCase()
      )
    );
  }

  if (selectedTransmissions?.length) {
    filtered = filtered.filter((car) =>
      selectedTransmissions.some(
        (tran) => (car.specs.transmission || "").toLowerCase() === tran.toLowerCase()
      )
    );
  }

  // Year range
  filtered = filtered.filter(
    (car) => (car.specs.year || 0) >= yearRange[0] && (car.specs.year || 0) <= yearRange[1]
  );

  // Mileage range
  filtered = filtered.filter((car) => {
    const mileage = parseInt((car.specs.km || "0").replace(/,/g, "")) || 0;
    return mileage >= mileageRange[0] && mileage <= mileageRange[1];
  });

  // Price range
  filtered = filtered.filter((car) => {
    const price = parseInt(String(car.price || "0").replace(/[^0-9]/g, "")) || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Order by search results if available, otherwise as-is
  if (results?.length) {
    filtered.sort((a, b) => (idOrderMap.get(a.id) ?? 0) - (idOrderMap.get(b.id) ?? 0));
  } else {
    // Apply sorting based on sortBy option
    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(String(a.price || "0").replace(/[^0-9]/g, "")) || 0;
          const priceB = parseInt(String(b.price || "0").replace(/[^0-9]/g, "")) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(String(a.price || "0").replace(/[^0-9]/g, "")) || 0;
          const priceB = parseInt(String(b.price || "0").replace(/[^0-9]/g, "")) || 0;
          return priceB - priceA;
        });
        break;
      case 'year-new-old':
        filtered.sort((a, b) => (b.specs.year || 0) - (a.specs.year || 0));
        break;
      case 'year-old-new':
        filtered.sort((a, b) => (a.specs.year || 0) - (b.specs.year || 0));
        break;
      case 'mileage-low-high':
        filtered.sort((a, b) => {
          const mileageA = parseInt((a.specs.km || "0").replace(/,/g, "")) || 0;
          const mileageB = parseInt((b.specs.km || "0").replace(/,/g, "")) || 0;
          return mileageA - mileageB;
        });
        break;
      case 'mileage-high-low':
        filtered.sort((a, b) => {
          const mileageA = parseInt((a.specs.km || "0").replace(/,/g, "")) || 0;
          const mileageB = parseInt((b.specs.km || "0").replace(/,/g, "")) || 0;
          return mileageB - mileageA;
        });
        break;
      default:
        // 'default' - no additional sorting
        break;
    }
  }

  return filtered;
}
