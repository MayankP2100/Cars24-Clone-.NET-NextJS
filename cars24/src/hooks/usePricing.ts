import { useState, useCallback } from "react";
import {
  calculatePrice,
  calculatePriceWithPoints,
  CalculatePriceRequest,
  CalculatePriceResponse,
  CalculatePriceWithPointsRequest,
  CalculatePriceWithPointsResponse,
} from "@/lib/pricingapi";

interface UsePricingResult {
  loading: boolean;
  error: string | null;
  calculatePrice: (request: CalculatePriceRequest) => Promise<CalculatePriceResponse | null>;
  calculatePriceWithPoints: (
    request: CalculatePriceWithPointsRequest
  ) => Promise<CalculatePriceWithPointsResponse | null>;
  clearError: () => void;
}

export const usePricing = (): UsePricingResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const calculatePriceHandler = useCallback(
    async (request: CalculatePriceRequest): Promise<CalculatePriceResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await calculatePrice(request);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to calculate price";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const calculatePriceWithPointsHandler = useCallback(
    async (
      request: CalculatePriceWithPointsRequest
    ): Promise<CalculatePriceWithPointsResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await calculatePriceWithPoints(request);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to calculate price with points";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    calculatePrice: calculatePriceHandler,
    calculatePriceWithPoints: calculatePriceWithPointsHandler,
    clearError,
  };
};

