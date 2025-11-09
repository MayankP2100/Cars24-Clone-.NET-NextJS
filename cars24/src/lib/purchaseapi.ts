import { BASE_URL } from "./utils";

export interface Purchase {
  id: string;
  userId: string;
  carId: string;
  carTitle: string;
  purchasePrice: number;
  purchaseType: "buy" | "sell";
  purchaseDate: string;
  status: "completed" | "pending" | "cancelled";
}

export interface CreatePurchaseRequest {
  UserId: string;
  CarId: string;
  CarTitle: string;
  Price: number;
  PurchaseType: "buy" | "sell";
  Status?: "completed" | "pending" | "cancelled";
}

export const createPurchase = async (
  userId: string,
  carId: string,
  carTitle: string,
  price: number,
  purchaseType: "buy" | "sell",
  status: "completed" | "pending" | "cancelled" = "completed"
): Promise<Purchase> => {
  try {
    const request: CreatePurchaseRequest = {
      UserId: userId,
      CarId: carId,
      CarTitle: carTitle,
      Price: price,
      PurchaseType: purchaseType,
      Status: status,
    };

    console.log("Creating purchase with request:", request);

    const res = await fetch(`${BASE_URL}/api/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      let errorMessage = `Failed to create purchase: ${res.status} ${res.statusText}`;
      let errorDetails = {};

      try {
        const errorData = await res.json();
        console.error("Backend error response:", errorData);
        errorDetails = errorData;
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
        try {
          const textError = await res.text();
          console.error("Raw error response:", textError);
          errorMessage = textError || errorMessage;
        } catch (e) {
          console.error("Could not read error response");
        }
      }

      console.error("Create purchase error:", {
        status: res.status,
        statusText: res.statusText,
        message: errorMessage,
        details: errorDetails,
        request,
      });

      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log("Purchase created successfully:", data);
    return data;
  } catch (error) {
    console.error("Create purchase exception:", error);
    throw error;
  }
};

export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/purchase/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch purchases");
    }

    const data = await res.json();
    console.log("Fetched purchases:", data);
    return data || [];
  } catch (error) {
    console.error("Fetch purchases error:", error);
    throw error;
  }
};

export const getPurchaseById = async (purchaseId: string): Promise<Purchase> => {
  try {
    const res = await fetch(`${BASE_URL}/api/purchase/${purchaseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch purchase");
    }

    const data = await res.json();
    console.log("Fetched purchase:", data);
    return data;
  } catch (error) {
    console.error("Fetch purchase error:", error);
    throw error;
  }
};

