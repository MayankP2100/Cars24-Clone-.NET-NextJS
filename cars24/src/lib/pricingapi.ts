import { BASE_URL } from "./utils";

// Pricing API Types
export interface PricingMultiplier {
  id?: string;
  region: string;
  season: string;
  vehicleType: string;
  multiplier: number;
}

export interface PricingAdjustment {
  id?: string;
  carId: string;
  basePrice: number;
  adjustedPrice: number;
  adjustmentReason?: string;
  createdAt?: string;
}

export interface CreatePricingAdjustmentRequest {
  BasePrice: number;
  City: string;
  CarTitle: string;
  YearOfManufacture: number;
  MileageKm: number;
}

export interface CalculatePriceRequest {
  BasePrice: number;
  City: string;
  CarTitle: string;
}

export interface CalculatePriceResponse {
  basePrice: number;
  city: string;
  region: string;
  season: string;
  vehicleType: string;
  recommendedPrice: number;
  priceChange: number;
  percentageChange: number;
}

export interface CalculatePriceWithPointsRequest {
  UserId: string;
  BasePrice: number;
  City: string;
  CarTitle: string;
  MaxPointsToUse?: number;
}

export interface CalculatePriceWithPointsResponse {
  basePrice: number;
  recommendedPrice: number;
  finalPrice: number;
  pointsUsed: number;
  remainingBalance: number;
  savings: number;
}

export interface PricingAdjustmentRequest {
  basePrice: number | string;
  city: string;
  carTitle: string;
  yearOfManufacture: number;
  mileageKm: number;
  condition?: string;
}

export interface PricingAdjustmentResponse {
  id?: string;
  carId: string;
  basePrice: number;
  adjustedPrice: number;
  adjustmentReason?: string;
}

// Get all pricing multipliers
export const getAllMultipliers = async (): Promise<PricingMultiplier[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/pricing/multipliers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Failed to get multipliers: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to get multipliers: ${res.status}`);
    }

    const multipliers: PricingMultiplier[] = await res.json();
    return multipliers;
  } catch (error) {
    console.error("Error getting pricing multipliers:", error);
    throw error;
  }
};

// Get pricing multiplier by region, season, and vehicle type
export const getPricingMultiplier = async (
  region: string,
  season: string,
  vehicleType: string
): Promise<PricingMultiplier | null> => {
  try {
    const params = new URLSearchParams({
      region,
      season,
      vehicleType,
    });

    const res = await fetch(`${BASE_URL}/api/pricing/multiplier?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      console.error(`Failed to get pricing multiplier: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to get pricing multiplier: ${res.status}`);
    }

    const multiplier: PricingMultiplier = await res.json();
    return multiplier;
  } catch (error) {
    console.error("Error getting pricing multiplier:", error);
    throw error;
  }
};

// Create pricing multiplier
export const createPricingMultiplier = async (
  multiplier: PricingMultiplier
): Promise<PricingMultiplier> => {
  try {
    const res = await fetch(`${BASE_URL}/api/pricing/multiplier`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(multiplier),
    });

    if (!res.ok) {
      console.error(`Failed to create pricing multiplier: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to create pricing multiplier: ${res.status}`);
    }

    const created: PricingMultiplier = await res.json();
    return created;
  } catch (error) {
    console.error("Error creating pricing multiplier:", error);
    throw error;
  }
};

// Update pricing multiplier
export const updatePricingMultiplier = async (
  id: string,
  multiplier: PricingMultiplier
): Promise<PricingMultiplier> => {
  try {
    const res = await fetch(`${BASE_URL}/api/pricing/multiplier/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(multiplier),
    });

    if (!res.ok) {
      console.error(`Failed to update pricing multiplier: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to update pricing multiplier: ${res.status}`);
    }

    const updated: PricingMultiplier = await res.json();
    return updated;
  } catch (error) {
    console.error("Error updating pricing multiplier:", error);
    throw error;
  }
};

// Delete pricing multiplier
export const deletePricingMultiplier = async (id: string): Promise<void> => {
  try {
    const res = await fetch(`${BASE_URL}/api/pricing/multiplier/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Failed to delete pricing multiplier: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to delete pricing multiplier: ${res.status}`);
    }
  } catch (error) {
    console.error("Error deleting pricing multiplier:", error);
    throw error;
  }
};

// Create pricing adjustment for a car
export const createPricingAdjustment = async (
  carId: string,
  request: CreatePricingAdjustmentRequest
): Promise<PricingAdjustment> => {
  try {
    const res = await fetch(`${BASE_URL}/api/pricing/adjustment/${carId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      console.error(`Failed to create pricing adjustment: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to create pricing adjustment: ${res.status}`);
    }

    const adjustment: PricingAdjustment = await res.json();
    return adjustment;
  } catch (error) {
    console.error("Error creating pricing adjustment:", error);
    throw error;
  }
};

// Alias for backward compatibility
export const calculatePricingAdjustment = createPricingAdjustment;

// Get pricing adjustment for a car
export const getPricingAdjustment = async (carId: string): Promise<PricingAdjustment | null> => {
  try {
    const res = await fetch(`${BASE_URL}/api/pricing/adjustment/${carId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      console.error(`Failed to get pricing adjustment: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to get pricing adjustment: ${res.status}`);
    }

    const adjustment: PricingAdjustment = await res.json();
    return adjustment;
  } catch (error) {
    console.error("Error getting pricing adjustment:", error);
    throw error;
  }
};

// Calculate recommended price
export const calculatePrice = async (
  request: CalculatePriceRequest
): Promise<CalculatePriceResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/pricing/calculate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      console.error(`Failed to calculate price: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to calculate price: ${res.status}`);
    }

    const result: CalculatePriceResponse = await res.json();
    return result;
  } catch (error) {
    console.error("Error calculating price:", error);
    throw error;
  }
};

// Calculate price with points discount
export const calculatePriceWithPoints = async (
  request: CalculatePriceWithPointsRequest
): Promise<CalculatePriceWithPointsResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/pricing/calculate-with-points`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      let errorMessage = `Failed to calculate price with points: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Use default error message if JSON parsing fails
      }
      console.error("Calculate price with points error:", errorMessage);
      throw new Error(errorMessage);
    }

    const result: CalculatePriceWithPointsResponse = await res.json();
    return result;
  } catch (error) {
    console.error("Error calculating price with points:", error);
    throw error;
  }
};

