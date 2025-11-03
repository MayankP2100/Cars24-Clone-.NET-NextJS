import { Car } from "@/types/car";
import { getBrandFromTitle } from "@/lib/cars";

// Available sorting options for cars
export type SortOption = 'default' | 'price-low-high' | 'price-high-low' | 'year-new-old' | 'year-old-new' | 'mileage-low-high' | 'mileage-high-low';

// Filter criteria type definition
export type Filters = {
  priceRange: [number, number];
  selectedBrands: string[];
  selectedFuels: string[];
  selectedTransmissions: string[];
  yearRange: [number, number];
  mileageRange: [number, number];
  sortBy?: SortOption;
};

/**
 * Filters and orders the provided cars based on search results and filter criteria.
 * When search results are present, they take priority in ordering.
 * Otherwise, sorting is applied based on the sortBy option.
 *
 * @param cars - The array of cars to filter and sort
 * @param results - Search results IDs (if any) that prioritize ordering
 * @param filters - All filtering and sorting criteria
 * @returns Filtered and sorted array of cars
 */
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

  // Create a copy of cars array, or start with empty array if null/undefined
  const list: Car[] = Array.isArray(cars) ? cars.slice() : [];

  // Create a map of result IDs to their order index for prioritized ordering
  const idOrderMap = new Map(results.map((id, idx) => [id, idx] as const));

  let filtered = list;

  // Filter by selected car brands
  if (selectedBrands?.length) {
    filtered = filtered.filter((car) =>
      selectedBrands.some(
        (brand) => brand.toLowerCase() === getBrandFromTitle(car.title).toLowerCase()
      )
    );
  }

  // Filter by selected fuel types
  if (selectedFuels?.length) {
    filtered = filtered.filter((car) =>
      selectedFuels.some(
        (fuel) => (car.specs.fuel || "").toLowerCase() === fuel.toLowerCase()
      )
    );
  }

  // Filter by selected transmission types
  if (selectedTransmissions?.length) {
    filtered = filtered.filter((car) =>
      selectedTransmissions.some(
        (tran) => (car.specs.transmission || "").toLowerCase() === tran.toLowerCase()
      )
    );
  }

  // Filter by year range
  filtered = filtered.filter(
    (car) => (car.specs.year || 0) >= yearRange[0] && (car.specs.year || 0) <= yearRange[1]
  );

  // Filter by mileage range
  filtered = filtered.filter((car) => {
    const mileage = parseInt((car.specs.km || "0").replace(/,/g, "")) || 0;
    return mileage >= mileageRange[0] && mileage <= mileageRange[1];
  });

  // Filter by price range
  filtered = filtered.filter((car) => {
    const price = parseInt(String(car.price || "0").replace(/[^0-9]/g, "")) || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Apply sorting logic
  // Priority 1: If search results exist, order by search result ranking
  // Priority 2: Otherwise, apply the selected sort option
  if (results?.length) {
    filtered.sort((a, b) => (idOrderMap.get(a.id) ?? 0) - (idOrderMap.get(b.id) ?? 0));
  } else {
    // Apply sorting based on sortBy option
    switch (sortBy) {
      // Sort by price from lowest to highest
      case 'price-low-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(String(a.price || "0").replace(/[^0-9]/g, "")) || 0;
          const priceB = parseInt(String(b.price || "0").replace(/[^0-9]/g, "")) || 0;
          return priceA - priceB;
        });
        break;
      // Sort by price from highest to lowest
      case 'price-high-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(String(a.price || "0").replace(/[^0-9]/g, "")) || 0;
          const priceB = parseInt(String(b.price || "0").replace(/[^0-9]/g, "")) || 0;
          return priceB - priceA;
        });
        break;
      // Sort by year from newest to oldest
      case 'year-new-old':
        filtered.sort((a, b) => (b.specs.year || 0) - (a.specs.year || 0));
        break;
      // Sort by year from oldest to newest
      case 'year-old-new':
        filtered.sort((a, b) => (a.specs.year || 0) - (b.specs.year || 0));
        break;
      // Sort by mileage from lowest to highest
      case 'mileage-low-high':
        filtered.sort((a, b) => {
          const mileageA = parseInt((a.specs.km || "0").replace(/,/g, "")) || 0;
          const mileageB = parseInt((b.specs.km || "0").replace(/,/g, "")) || 0;
          return mileageA - mileageB;
        });
        break;
      // Sort by mileage from highest to lowest
      case 'mileage-high-low':
        filtered.sort((a, b) => {
          const mileageA = parseInt((a.specs.km || "0").replace(/,/g, "")) || 0;
          const mileageB = parseInt((b.specs.km || "0").replace(/,/g, "")) || 0;
          return mileageB - mileageA;
        });
        break;
      default:
        // 'default' - no additional sorting applied
        break;
    }
  }

  return filtered;
}
