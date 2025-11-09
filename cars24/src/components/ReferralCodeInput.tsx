import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useReferral } from "@/context/ReferralContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Loader, Gift } from "lucide-react";
import * as api from "@/lib/referralapi";

interface ReferralCodeInputProps {
  onSuccess?: () => void;
  buttonText?: string;
  showTitle?: boolean;
}

const ReferralCodeInput: React.FC<ReferralCodeInputProps> = ({
  onSuccess,
  buttonText = "Claim Referral Code",
  showTitle = true,
}) => {
  const { user } = useAuth();
  const { refreshWalletData } = useReferral();
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClaimCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!referralCode.trim()) {
      setError("Please enter a referral code");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.claimReferralCode(referralCode.trim(), user.id);
      setSuccess(true);
      setReferralCode("");

      // Refresh wallet data to show updated balance
      await refreshWalletData(user.id);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to claim referral code";

      // Parse error messages from API
      if (errorMessage.includes("401") || errorMessage.includes("403")) {
        setError("You are not authorized to claim this code");
      } else if (errorMessage.includes("400")) {
        setError("Invalid referral code or code already claimed");
      } else if (errorMessage.includes("404")) {
        setError("Referral code not found");
      } else {
        setError(errorMessage);
      }

      console.error("Error claiming referral code:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {showTitle && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Gift className="text-orange-500" size={20} />
            Have a Referral Code?
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Enter a referral code to claim your bonus points
          </p>
        </div>
      )}

      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✓ Referral code claimed successfully! You received bonus points.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleClaimCode} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter referral code (e.g., ABC123XYZ)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
          disabled={loading || success}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <Button
          type="submit"
          disabled={loading || success || !referralCode.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6"
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : success ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Claimed!
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>
    </div>
  );
};

export default ReferralCodeInput;

