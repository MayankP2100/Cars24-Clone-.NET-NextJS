import React from 'react';
import { TrendingUp, TrendingDown, MapPin, Calendar, AlertCircle, Loader } from 'lucide-react';
import { CalculatePriceResponse } from '@/lib/pricingapi';

interface PricingDisplayProps {
  pricing: CalculatePriceResponse | null;
  isLoading: boolean;
  error: string | null;
  showDetails?: boolean;
  compact?: boolean;
}

/**
 * Component to display pricing information based on market conditions
 */
const PricingDisplay: React.FC<PricingDisplayProps> = ({
  pricing,
  isLoading,
  error,
  showDetails = true,
  compact = false,
}) => {
  if (isLoading) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} rounded-lg border border-gray-200 flex items-center justify-center gap-2 text-gray-600`}>
        <Loader className="w-4 h-4 animate-spin" />
        <span className="text-sm">Calculating price...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} rounded-lg border border-red-200 bg-red-50 flex items-start gap-2`}>
        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-900">Pricing Error</p>
          <p className="text-xs text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!pricing) {
    return null;
  }

  const isPositive = pricing.percentageChange >= 0;
  const trendIcon = isPositive ?
    <TrendingUp className="w-5 h-5 text-green-600" /> :
    <TrendingDown className="w-5 h-5 text-red-600" />;

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-600">Base Price:</span>
          <span className="font-semibold text-gray-900">₹{(pricing.basePrice / 100000).toFixed(2)}L</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-600">Recommended Price:</span>
          <span className="font-semibold text-blue-600">₹{(pricing.recommendedPrice / 100000).toFixed(2)}L</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
          <span className="text-xs text-gray-600">Market Adjustment:</span>
          <div className="flex items-center gap-1">
            {trendIcon}
            <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{pricing.percentageChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
          Market Pricing
        </h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isPositive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? '📈 Higher Demand' : '📉 Lower Demand'}
        </span>
      </div>

      {/* Price Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <p className="text-xs text-gray-600 mb-1">Base Price</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{(pricing.basePrice / 100000).toFixed(2)}L
          </p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <p className="text-xs text-gray-600 mb-1">Recommended Price</p>
          <p className="text-lg font-bold text-blue-600">
            ₹{(pricing.recommendedPrice / 100000).toFixed(2)}L
          </p>
        </div>
      </div>

      {/* Price Change Alert */}
      <div className={`flex items-start gap-3 p-3 rounded-lg ${
        isPositive ? 'bg-green-100' : 'bg-orange-100'
      }`}>
        {trendIcon}
        <div className="flex-1">
          <p className={`text-sm font-semibold ${isPositive ? 'text-green-900' : 'text-orange-900'}`}>
            Price Adjustment: {isPositive ? '+' : ''}₹{pricing.priceChange.toLocaleString()}
          </p>
          <p className={`text-xs mt-1 ${isPositive ? 'text-green-700' : 'text-orange-700'}`}>
            {isPositive ? '+' : ''}{pricing.percentageChange.toFixed(2)}% change based on market conditions
          </p>
        </div>
      </div>

      {/* Market Factors */}
      {showDetails && (
        <div className="bg-white rounded-lg p-4 border border-gray-100 space-y-3">
          <p className="text-sm font-semibold text-gray-900">Market Factors</p>

          <div className="grid grid-cols-2 gap-3">
            {/* Region Factor */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Region</p>
                <p className="text-sm font-semibold text-gray-900">
                  {pricing.region}
                </p>
                <p className="text-xs text-blue-600">
                  {pricing.city}
                </p>
              </div>
            </div>

            {/* Season Factor */}
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Season</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {pricing.season}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600">Vehicle Type Detected</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {pricing.vehicleType}
            </p>
          </div>
        </div>
      )}

      {/* Info Message */}
      <div className="p-3 bg-blue-100 rounded-lg">
        <p className="text-xs text-blue-900">
          💡 This market-adjusted price reflects current demand based on region, season, vehicle type, and condition.
          Use this as a guide for fair pricing.
        </p>
      </div>
    </div>
  );
};

export default PricingDisplay;

