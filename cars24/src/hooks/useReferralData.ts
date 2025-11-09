import { useEffect } from "react";
import { useReferral } from "@/context/ReferralContext";
import { useAuth } from "@/context/AuthContext";

export const useReferralData = () => {
  const { balancePoints, fetchWalletData, loading, error } = useReferral();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchWalletData(user.id);
    }
  }, [user?.id, fetchWalletData]);

  return { balancePoints, loading, error, userId: user?.id };
};

