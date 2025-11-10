import React, { useEffect } from 'react';
import { usePricing } from '@/hooks/usePricing';
import { CalculatePriceRequest } from '@/lib/pricingapi';
import PricingDisplay from '@/components/PricingDisplay';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface PricingInsightProps {
  carId: string;
  car: {
    id: string;
    title: string;
    price: number;
    year: number;
    location: string;
    specs?: {
      km?: number;
    };
  };
}

const PricingInsight: React.FC<PricingInsightProps> = ({ carId, car }) => {
  const { loading: isLoading, error, calculatePrice } = usePricing();
  const [pricing, setPricing] = useState<any>(null);

  // Extract and validate data - strip commas from formatted numbers
  const basePrice = Number(String(car.price).replace(/,/g, ''));

  const calculatePricing = async () => {
    const request: CalculatePriceRequest = {
      BasePrice: basePrice,
      City: (car.location || 'Mumbai').trim(),
      CarTitle: (car.title || 'Car').trim(),
    };
    const result = await calculatePrice(request);
    if (result) {
      setPricing(result);
    }
  };

  useEffect(() => {
    calculatePricing();
  }, [carId]);

  return (
    <div className="space-y-6">
      {/* Pricing Display */}
      <PricingDisplay
        pricing={pricing}
        isLoading={isLoading}
        error={error}
        showDetails={true}
        compact={false}
      />

      {/* Refresh Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => calculatePricing()}
          disabled={isLoading}
          className="w-full h-14 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            {!isLoading && <RefreshCw className="w-4 h-4" />}
          </div>
          <span>{isLoading ? "Recalculating..." : "Recalculate Price"}</span>
        </button>
      </div>
    </div>
  );
};

export default PricingInsight;

