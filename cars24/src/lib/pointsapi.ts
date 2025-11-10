import {BASE_URL} from "./utils";

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

export const getPointsBalance = async (userId: string): Promise<number> => {
  try {
    const res = await fetch(`${BASE_URL}/api/points/balance/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Failed to get points balance: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to get points balance: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error getting points balance:", error);
    throw error;
  }
};

export const applyPointsToPurchase = async (
  userId: string,
  price: number,
  maxPointsToUse?: number
): Promise<ApplyPointsResponse> => {
  try {
    const request: ApplyPointsRequest = {
      UserId: userId,
      Price: price,
      MaxPointsToUse: maxPointsToUse,
    };

    const res = await fetch(`${BASE_URL}/api/points/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      console.error(`Failed to apply points: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to apply points: ${res.status}`);
    }

    const rawResponse = await res.json();

    console.log("Apply points API raw response:", rawResponse);

    const response: ApplyPointsResponse = {
      FinalPrice: rawResponse.FinalPrice ?? rawResponse.finalPrice ?? rawResponse.final_price ?? 0,
      PointsUsed: rawResponse.PointsUsed ?? rawResponse.pointsUsed ?? rawResponse.points_used ?? 0,
      RemainingBalance: rawResponse.RemainingBalance ?? rawResponse.remainingBalance ?? rawResponse.remaining_balance ?? 0,
    };

    console.log("Apply points API parsed response:", response);

    if (!response || typeof response.FinalPrice !== 'number' || typeof response.PointsUsed !== 'number') {
      console.error("Invalid API response after parsing:", response);
      throw new Error("Invalid response from server - expected numeric values");
    }

    return response;
  } catch (error) {
    console.error("Error applying points to purchase:", error);
    throw error;
  }
};

export const redeemPointsToWallet = async (
  userId: string,
  pointsToRedeem: number
): Promise<void> => {
  try {
    const request: RedeemRequest = {
      UserId: userId,
      PointsToRedeem: pointsToRedeem,
    };

    const res = await fetch(`${BASE_URL}/api/points/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      console.error(`Failed to redeem points: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to redeem points: ${res.status}`);
    }
  } catch (error) {
    console.error("Error redeeming points to wallet:", error);
    throw error;
  }
};

export const purchaseServiceWithPoints = async (
  userId: string,
  serviceId: string
): Promise<ServicePurchaseResponse> => {
  try {
    const request: ServicePurchaseRequest = {
      UserId: userId,
      ServiceId: serviceId,
    };

    const res = await fetch(`${BASE_URL}/api/points/service/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      let errorMessage = `Failed to purchase service: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
      }
      console.error("Purchase service error:", errorMessage);
      throw new Error(errorMessage);
    }

    const response: ServicePurchaseResponse = await res.json();
    return response;
  } catch (error) {
    console.error("Error purchasing service with points:", error);
    throw error;
  }
};

