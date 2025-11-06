import { BASE_URL } from './utils';

export interface PricingAdjustmentRequest {
  basePrice: number;
  city: string;
  carTitle: string;
  yearOfManufacture: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  mileageKm: number;
}

export interface PricingAdjustmentResponse {
  id: string;
  carId: string;
  basePrice: number;
  region: string;
  season: string;
  vehicleType: string;
  regionMultiplier: number;
  seasonalMultiplier: number;
  recommendedPrice: number;
  priceChange: number;
  percentageChange: number;
}

/**
 * Calculate adjusted price for a car based on region, season, and other factors
 */
export const calculatePricingAdjustment = async (
  carId: string,
  request: PricingAdjustmentRequest
): Promise<PricingAdjustmentResponse> => {
  try {
    // Ensure basePrice is a valid number
    const payload = {
      basePrice: Number(request.basePrice),
      city: request.city.trim(),
      carTitle: request.carTitle.trim(),
      yearOfManufacture: Number(request.yearOfManufacture),
      condition: request.condition,
      mileageKm: Number(request.mileageKm),
    };

    console.log('=== PRICING API DEBUG ===');
    console.log('CarID:', carId);
    console.log('Payload:', payload);
    console.log('BasePrice Type:', typeof payload.basePrice);
    console.log('BasePrice Value:', payload.basePrice);
    console.log('========================');

    const response = await fetch(`${BASE_URL}/api/pricing/adjustment/${carId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Pricing API Error:', errorData);
      throw new Error(`Failed to calculate pricing adjustment: ${JSON.stringify(errorData.errors || errorData.title)}`);
    }

    const data = await response.json();
    console.log('Pricing API Response:', data);
    return data;
  } catch (error) {
    console.error('Error calculating pricing adjustment:', error);
    throw error;
  }
};

/**
 * Get existing pricing adjustment for a car
 */
export const getPricingAdjustment = async (
  carId: string
): Promise<PricingAdjustmentResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/pricing/adjustment/${carId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get pricing adjustment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting pricing adjustment:', error);
    throw error;
  }
};

/**
 * Get all pricing multipliers
 */
export const getPricingMultipliers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/pricing/multipliers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get pricing multipliers: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting pricing multipliers:', error);
    throw error;
  }
};

