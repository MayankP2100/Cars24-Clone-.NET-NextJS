import { useState, useCallback } from "react";
import {
  getPointsBalance,
  applyPointsToPurchase,
  redeemPointsToWallet,
  purchaseServiceWithPoints,
  ApplyPointsResponse,
  ServicePurchaseResponse,
} from "@/lib/pointsapi";

interface UsePointsResult {
  balance: number | null;
  loading: boolean;
  error: string | null;
  fetchBalance: (userId: string) => Promise<void>;
  applyPoints: (
    userId: string,
    price: number,
    maxPointsToUse?: number
  ) => Promise<ApplyPointsResponse | null>;
  redeemPoints: (userId: string, pointsToRedeem: number) => Promise<boolean>;
  purchaseService: (
    userId: string,
    serviceId: string
  ) => Promise<ServicePurchaseResponse | null>;
  clearError: () => void;
}

export const usePoints = (): UsePointsResult => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchBalance = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPointsBalance(userId);
        setBalance(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch balance";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const applyPoints = useCallback(
    async (
      userId: string,
      price: number,
      maxPointsToUse?: number
    ): Promise<ApplyPointsResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await applyPointsToPurchase(userId, price, maxPointsToUse);
        setBalance(result.RemainingBalance);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to apply points";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const redeemPoints = useCallback(
    async (userId: string, pointsToRedeem: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await redeemPointsToWallet(userId, pointsToRedeem);
        // Refresh balance after redeem
        await fetchBalance(userId);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to redeem points";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchBalance]
  );

  const purchaseService = useCallback(
    async (
      userId: string,
      serviceId: string
    ): Promise<ServicePurchaseResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await purchaseServiceWithPoints(userId, serviceId);
        setBalance(result.RemainingBalance);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to purchase service";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    balance,
    loading,
    error,
    fetchBalance,
    applyPoints,
    redeemPoints,
    purchaseService,
    clearError,
  };
};

