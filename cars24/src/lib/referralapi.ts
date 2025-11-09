import {BASE_URL} from "./utils";

export interface ReferralCode {
  code: string;
  referrerId: string;
  referredUserId?: string;
  isRedeemed: boolean;
}

export interface ReferralData {
  referralCode: ReferralCode;
  referralPoints: number;
  referralBonusPoints: number;
}

export interface Wallet {
  userId: string;
  balancePoints: number;
}

export const createReferralCode = async (userId: string): Promise<string> => {
  try {
    const res = await fetch(`${BASE_URL}/api/referral/create?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      let errorMessage = `Failed to create referral code: ${res.status} ${res.statusText}`;

      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // If JSON parsing fails, just use the status text
        console.error("Could not parse error response:", parseError);
      }

      console.error("Create referral code error:", {
        status: res.status,
        statusText: res.statusText,
        message: errorMessage,
        userId,
      });

      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log("Referral code created successfully:", data.code);
    return data.code;
  } catch (error) {
    console.error("Create referral code exception:", error);
    throw error;
  }
};

export const claimReferralCode = async (
  code: string,
  referredUserId: string
): Promise<void> => {
  const res = await fetch(
    `${BASE_URL}/api/referral/claim?code=${code}&referredUserId=${referredUserId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, referredUserId }),
    }
  );

  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || `Failed to claim referral code: ${res.status}`);
    } catch (e) {
      if (e instanceof Error && e.message.includes("Failed to claim")) {
        throw e;
      }
      throw new Error(`Failed to claim referral code: ${res.statusText}`);
    }
  }
};

export const processFirstTransaction = async (
  referredUserId: string,
  referenceId: string
): Promise<void> => {
  const res = await fetch(
    `${BASE_URL}/api/referral/first-transaction?referredUserId=${referredUserId}&referenceId=${referenceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to process first transaction");
  }
};

export const getWallet = async (userId: string): Promise<Wallet> => {
  const res = await fetch(`${BASE_URL}/api/referral/wallet?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch wallet");
  }

  return res.json();
};

export const redeemPoints = async (
  userId: string,
  points: number,
  referenceId: string
): Promise<void> => {
  const res = await fetch(
    `${BASE_URL}/api/referral/redeem?userId=${userId}&points=${points}&referenceId=${referenceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to redeem points");
  }
};

export const checkFirstTransaction = async (userId: string): Promise<boolean> => {
  const res = await fetch(`${BASE_URL}/api/referral/first-transaction?userId=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to check first transaction status");
  }

  const data = await res.json();
  return data.isFirstTransaction;
};

