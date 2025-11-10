import { useEffect, useState } from 'react';
import {
  calculatePricingAdjustment,
  PricingAdjustmentRequest,
  PricingAdjustmentResponse,
} from '@/lib/pricingapi';

interface UsePricingAdjustmentProps {
  carId: string;
  request: PricingAdjustmentRequest;
  autoCalculate?: boolean;
}

interface UsePricingAdjustmentReturn {
  pricing: PricingAdjustmentResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to calculate pricing adjustment for a car
 */
export const usePricingAdjustment = ({
  carId,
  request,
  autoCalculate = true,
}: UsePricingAdjustmentProps): UsePricingAdjustmentReturn => {
  const [pricing, setPricing] = useState<PricingAdjustmentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate request data
  const validateRequest = (req: PricingAdjustmentRequest): boolean => {
    const basePrice = Number(req.basePrice);

    if (isNaN(basePrice) || basePrice <= 0) {
      console.error('Invalid basePrice:', { received: req.basePrice, converted: basePrice });
      setError('Invalid base price - must be a number greater than 0');
      return false;
    }
    if (!req.city || req.city.trim() === '') {
      setError('City is required');
      return false;
    }
    if (!req.carTitle || req.carTitle.trim() === '') {
      setError('Car title is required');
      return false;
    }
    const year = Number(req.yearOfManufacture);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      setError(`Invalid year of manufacture (must be between 1900 and ${new Date().getFullYear()})`);
      return false;
    }
    if (!req.condition) {
      setError('Condition is required');
      return false;
    }
    if (req.mileageKm < 0) {
      setError('Mileage cannot be negative');
      return false;
    }
    return true;
  };

  const refetch = async () => {
    if (!validateRequest(request)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const adjustmentRequest = {
        BasePrice: Number(request.basePrice),
        City: request.city,
        CarTitle: request.carTitle,
        YearOfManufacture: request.yearOfManufacture,
        MileageKm: request.mileageKm,
      };
      const result = await calculatePricingAdjustment(carId, adjustmentRequest);
      setPricing(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate pricing';
      setError(errorMessage);
      setPricing(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoCalculate && validateRequest(request)) {
      refetch();
    }
  }, [carId, request.basePrice, request.city, request.condition]);

  return {
    pricing,
    isLoading,
    error,
    refetch,
  };
};

