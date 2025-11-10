'use client';

import React, { useState } from 'react';
import { usePricing } from '@/hooks/usePricing';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Loader } from 'lucide-react';
import { CalculatePriceRequest, CalculatePriceWithPointsRequest } from '@/lib/pricingapi';

interface PriceCalculatorProps {
  userId?: string;
  className?: string;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  userId,
  className = '',
}) => {
  const { loading, error, calculatePrice, calculatePriceWithPoints, clearError } = usePricing();

  const [basePrice, setBasePrice] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [carTitle, setCarTitle] = useState<string>('');
  const [maxPointsToUse, setMaxPointsToUse] = useState<string>('');
  const [calculatedPrice, setCalculatedPrice] = useState<any>(null);
  const [calculatedPriceWithPoints, setCalculatedPriceWithPoints] = useState<any>(null);

  const handleCalculatePrice = async () => {
    if (!basePrice || !city || !carTitle) {
      return;
    }

    clearError();
    const request: CalculatePriceRequest = {
      BasePrice: parseFloat(basePrice),
      City: city,
      CarTitle: carTitle,
    };

    const result = await calculatePrice(request);
    if (result) {
      setCalculatedPrice(result);
    }
  };

  const handleCalculatePriceWithPoints = async () => {
    if (!userId || !basePrice || !city || !carTitle) {
      return;
    }

    clearError();
    const request: CalculatePriceWithPointsRequest = {
      UserId: userId,
      BasePrice: parseFloat(basePrice),
      City: city,
      CarTitle: carTitle,
      MaxPointsToUse: maxPointsToUse ? parseInt(maxPointsToUse) : undefined,
    };

    const result = await calculatePriceWithPoints(request);
    if (result) {
      setCalculatedPriceWithPoints(result);
    }
  };

  const canCalculate = basePrice && city && carTitle;
  const canCalculateWithPoints = userId && canCalculate;

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Car Price Calculator</h3>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Base Price</label>
          <Input
            type="number"
            placeholder="Enter base price"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            disabled={loading}
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">City</label>
          <Input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Car Title/Model</label>
          <Input
            type="text"
            placeholder="Enter car model"
            value={carTitle}
            onChange={(e) => setCarTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCalculatePrice}
            disabled={loading || !canCalculate}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Calculating...
              </>
            ) : (
              'Calculate Price'
            )}
          </Button>
        </div>

        {calculatedPrice && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-900 mb-3">Price Calculation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Base Price:</span>
                <span className="font-semibold">${calculatedPrice.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Region:</span>
                <span className="font-semibold">{calculatedPrice.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Season:</span>
                <span className="font-semibold">{calculatedPrice.season}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Vehicle Type:</span>
                <span className="font-semibold">{calculatedPrice.vehicleType}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between">
                <span className="text-gray-700 font-semibold">Recommended Price:</span>
                <span className="font-bold text-lg text-blue-600">
                  ${calculatedPrice.recommendedPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Price Change:</span>
                <span
                  className={`font-semibold ${
                    calculatedPrice.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {calculatedPrice.priceChange >= 0 ? '+' : ''}${calculatedPrice.priceChange.toFixed(2)} (
                  {calculatedPrice.percentageChange >= 0 ? '+' : ''}
                  {calculatedPrice.percentageChange}%)
                </span>
              </div>
            </div>
          </div>
        )}

        {userId && (
          <>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-3">Apply Points Discount (Optional)</h4>

              <div>
                <label className="text-sm font-medium text-gray-700">Max Points to Use</label>
                <Input
                  type="number"
                  placeholder="Leave empty for maximum allowed"
                  value={maxPointsToUse}
                  onChange={(e) => setMaxPointsToUse(e.target.value)}
                  disabled={loading}
                  min="0"
                />
              </div>

              <Button
                onClick={handleCalculatePriceWithPoints}
                disabled={loading || !canCalculateWithPoints}
                className="w-full mt-3"
                variant="secondary"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  'Calculate with Points'
                )}
              </Button>
            </div>

            {calculatedPriceWithPoints && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-green-900 mb-3">Price with Points Discount</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Recommended Price:</span>
                    <span className="font-semibold">${calculatedPriceWithPoints.recommendedPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Points Used:</span>
                    <span className="font-semibold text-blue-600">{calculatedPriceWithPoints.pointsUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Remaining Balance:</span>
                    <span className="font-semibold">{calculatedPriceWithPoints.remainingBalance}</span>
                  </div>
                  <div className="border-t border-green-200 pt-2 flex justify-between">
                    <span className="text-gray-700 font-semibold">Final Price:</span>
                    <span className="font-bold text-lg text-green-600">
                      ${calculatedPriceWithPoints.finalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Total Savings:</span>
                    <span className="font-bold text-green-600">
                      ${calculatedPriceWithPoints.savings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default PriceCalculator;

