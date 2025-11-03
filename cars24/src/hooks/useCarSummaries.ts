import { useEffect, useState } from "react";
import { getCarSummaries } from "@/lib/carapi";
import type { Car } from "@/types/car";

/**
 * Fetches car summaries for a given city and exposes loading state.
 */
export function useCarSummaries(city: string) {
  const [cars, setCars] = useState<Car[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCarSummaries(city)
      .then((data) => {
        if (!cancelled) setCars(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city]);

  return { cars, loading, error } as const;
}
