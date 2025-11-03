import { Car } from "@/types/car";
import { getBrandFromTitle } from "@/lib/cars";

export type Filters = {
  priceRange: [number, number];
  selectedBrands: string[];
  selectedFuels: string[];
  selectedTransmissions: string[];
  yearRange: [number, number];
  mileageRange: [number, number];
};

/**
 * Filters and orders the provided cars using the search results order when provided.
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
  }

  return filtered;
}
