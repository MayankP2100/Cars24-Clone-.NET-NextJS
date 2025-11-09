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
  const res = await fetch(`${BASE_URL}/api/referral?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to create referral code");
  }

  const data = await res.json();
  return data.code;
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
    }
  );

  if (!res.ok) {
    throw new Error("Failed to claim referral code");
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

