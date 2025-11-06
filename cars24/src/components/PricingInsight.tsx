import React from 'react';
import { usePricingAdjustment } from '@/hooks/usePricingAdjustment';
import PricingDisplay from '@/components/PricingDisplay';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

/**
 * Component to show detailed pricing insights for a car
 */
const PricingInsight: React.FC<PricingInsightProps> = ({ carId, car }) => {
  // Extract and validate data - strip commas from formatted numbers
  const basePrice = Number(String(car.price).replace(/,/g, ''));
  const year = Number(car.year);
  const km = Number(String(car.specs?.km || 0).replace(/,/g, ''));

  const { pricing, isLoading, error, refetch } = usePricingAdjustment({
    carId,
    request: {
      basePrice: basePrice,
      city: (car.location || 'Mumbai').trim(),
      carTitle: (car.title || 'Car').trim(),
      yearOfManufacture: year,
      condition: 'good',
      mileageKm: km,
    },
    autoCalculate: true,
  });

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
      <div className="flex justify-center">
        <Button
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Recalculate Price
        </Button>
      </div>
    </div>
  );
};

export default PricingInsight;

