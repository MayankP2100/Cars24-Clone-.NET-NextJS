"use client";

import { createContext, useContext, useEffect, useState } from "react";
import * as api from "@/lib/referralapi";

type ReferralContextType = {
  referralCode: string | null;
  balancePoints: number;
  referredUsers: string[];
  referrerUser: string | null;
  loading: boolean;
  error: string | null;
  generateReferralCode: (userId: string) => Promise<void>;
  claimReferralCode: (code: string, userId: string) => Promise<void>;
  fetchWalletData: (userId: string) => Promise<void>;
  refreshWalletData: (userId: string) => Promise<void>;
};

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [balancePoints, setBalancePoints] = useState<number>(0);
  const [referredUsers, setReferredUsers] = useState<string[]>([]);
  const [referrerUser, setReferrerUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateReferralCode = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const code = await api.createReferralCode(userId);
      setReferralCode(code);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate referral code";
      setError(errorMessage);
      console.error("Error generating referral code:", err);
    } finally {
      setLoading(false);
    }
  };

  const claimReferralCode = async (code: string, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      await api.claimReferralCode(code, userId);
      setReferrerUser(userId);
      await fetchWalletData(userId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to claim referral code";
      setError(errorMessage);
      console.error("Error claiming referral code:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletData = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const wallet = await api.getWallet(userId);
      setBalancePoints(wallet.balancePoints);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch wallet data";
      setError(errorMessage);
      console.error("Error fetching wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshWalletData = async (userId: string) => {
    try {
      const wallet = await api.getWallet(userId);
      setBalancePoints(wallet.balancePoints);
    } catch (err) {
      console.error("Error refreshing wallet data:", err);
    }
  };

  return (
    <ReferralContext.Provider
      value={{
        referralCode,
        balancePoints,
        referredUsers,
        referrerUser,
        loading,
        error,
        generateReferralCode,
        claimReferralCode,
        fetchWalletData,
        refreshWalletData,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error("useReferral must be used within a ReferralProvider");
  }
  return context;
};

