export interface PointsBalance {
  userId: string;
  balance: number;
}

export interface ApplyPointsRequest {
  UserId: string;
  Price: number;
  MaxPointsToUse?: number;
}

export interface ApplyPointsResponse {
  FinalPrice: number;
  PointsUsed: number;
  RemainingBalance: number;
}

export interface RedeemRequest {
  UserId: string;
  PointsToRedeem: number;
}

export interface ServicePurchaseRequest {
  UserId: string;
  ServiceId: string;
}

export interface ServicePurchaseResponse {
  ServiceId: string;
  PointsSpent: number;
  RemainingBalance: number;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  type: "earn" | "spend" | "redeem" | "service_purchase";
  amount: number;
  description: string;
  transactionDate: string;
  balance: number;
}

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

export interface PricingCalculation {
  basePrice: number;
  city: string;
  region: string;
  season: string;
  vehicleType: string;
  recommendedPrice: number;
  priceChange: number;
  percentageChange: number;
}

export interface PriceWithPointsCalculation {
  basePrice: number;
  recommendedPrice: number;
  finalPrice: number;
  pointsUsed: number;
  remainingBalance: number;
  savings: number;
}

export type ServiceId = "premium_listing" | "featured" | "verification" | string;

export interface ServiceCost {
  serviceId: ServiceId;
  pointsCost: number;
  currencyCost: number;
  description: string;
}

