import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useReferral } from "@/context/ReferralContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Loader, Gift } from "lucide-react";
import * as api from "@/lib/referralapi";

const ReferralClaim = () => {
  const router = useRouter();
  const { code } = router.query;
  const { user } = useAuth();
  const { fetchWalletData } = useReferral();

  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatedBalance, setUpdatedBalance] = useState<number | null>(null);

  const handleClaimCode = async () => {
    if (!code || typeof code !== "string" || !user?.id) {
      setError("Invalid referral code or user not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setUpdatedBalance(null);

    try {
      // Step 1: Claim the referral code
      await api.claimReferralCode(code, user.id);

      // Step 2: Fetch updated wallet data
      const wallet = await api.getWallet(user.id);
      setUpdatedBalance(wallet.balancePoints);

      // Step 3: Set success message
      setSuccess(
        `Referral code claimed successfully! You'll earn bonus points on your first purchase.${
          updatedBalance !== null ? ` Your current balance: ${updatedBalance} points` : ""
        }`
      );
      setClaimed(true);

      // Step 4: Refresh context data
      await fetchWalletData(user.id);

      // Step 5: Redirect to referrals page after 3 seconds
      setTimeout(() => {
        router.push("/referrals");
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to claim referral code";
      setError(errorMessage);
      console.error("Error claiming referral code:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-md">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Please log in to claim this referral code.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => router.push("/login")}
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-md">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Invalid referral link. Please check the code and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-md min-h-screen flex items-center justify-center">
      <Card className="p-6 md:p-8 w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Claim Referral Bonus
          </h1>
          <p className="text-gray-600">
            You've been invited to join Cars24! Claim your bonus points.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Referral Code</p>
          <p className="text-2xl font-mono font-bold text-gray-900 break-all">
            {code}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            🎉 Bonus Rewards
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Get 50 points for signing up</li>
            <li>✓ Get 50 more points on your first purchase</li>
          </ul>
        </div>

        <Button
          onClick={handleClaimCode}
          disabled={loading || claimed}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2"
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : claimed ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Claimed!
            </>
          ) : (
            "Claim Bonus"
          )}
        </Button>

        {claimed && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Redirecting to referral program...
          </p>
        )}
      </Card>
    </div>
  );
};

export default ReferralClaim;

