import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useReferral } from "@/context/ReferralContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReferralCodeInput from "@/components/ReferralCodeInput";
import {
  Copy,
  Check,
  Gift,
  Users,
  AlertCircle,
  Loader,
  Coins,
} from "lucide-react";

const Referrals = () => {
  const { user } = useAuth();
  const {
    referralCode,
    balancePoints,
    generateReferralCode,
    fetchWalletData,
    loading,
    error,
  } = useReferral();

  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchWalletData(user.id);
    }
  }, [user?.id]);

  const handleGenerateCode = async () => {
    if (!user?.id) return;
    setIsGenerating(true);
    try {
      await generateReferralCode(user.id);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyShareLink = () => {
    if (referralCode && user?.id) {
      const shareLink = `${window.location.origin}/referral/${referralCode}`;
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Please log in to access the referral program.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Referral Program
        </h1>
        <p className="text-gray-600">
          Earn points by referring friends to Cars24. Both you and your friend
          will get bonus points!
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Balance Points Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 border-0 text-white p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Your Balance Points</p>
            <p className="text-4xl md:text-5xl font-bold">{balancePoints}</p>
          </div>
          <Coins className="w-16 h-16 opacity-20" />
        </div>
      </Card>

      {/* Referral Code Section */}
      <Card className="mb-8 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Gift className="text-orange-500" />
          Your Referral Code
        </h2>

        {!referralCode ? (
          <div className="text-center">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">
              Generate your unique referral code to start earning points.
            </p>
            <Button
              onClick={handleGenerateCode}
              disabled={isGenerating || loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              {isGenerating || loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Referral Code"
              )}
            </Button>
          </div>
        ) : (
          <div>
            {/* Referral Code Card */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 md:p-8 mb-6 border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-semibold mb-3 uppercase tracking-wide">
                Your Referral Code
              </p>
              <div className="flex items-center justify-between gap-4 mb-4">
                <p className="text-3xl md:text-4xl font-bold font-mono text-blue-900 break-all">
                  {referralCode}
                </p>
                <Button
                  onClick={handleCopyCode}
                  size="sm"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-blue-700">
                Share this code with friends to earn bonus points
              </p>
            </div>

            {/* Share Link Card */}
            <Card className="p-6 border-orange-200 bg-orange-50 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Share Your Referral Link
              </h3>
              <div className="bg-white rounded-lg p-3 mb-4 break-all text-sm text-gray-700 font-mono border border-orange-200">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/referral/${referralCode}`
                  : ""}
              </div>
              <Button
                onClick={handleCopyShareLink}
                className="w-full text-orange-600 border-2 border-orange-600 hover:bg-orange-100"
                variant="outline"
              >
                {copied ? "✓ Link Copied!" : "Copy Share Link"}
              </Button>
            </Card>

            {/* Share Instructions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">💡 How to Share:</span>
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Share your code directly with friends</li>
                <li>• Copy and paste the link in messages or social media</li>
                <li>• Friends can use the link or enter the code when signing up</li>
              </ul>
            </div>
          </div>
        )}
      </Card>

      {/* Claim Referral Code Section */}
      <Card className="mb-8 p-6 md:p-8 border-green-200 bg-green-50">
        <ReferralCodeInput
          onSuccess={() => fetchWalletData(user?.id || "")}
          buttonText="Claim Code"
          showTitle={true}
        />
      </Card>

      {/* Rewards Information */}
      <Card className="p-6 md:p-8 border-blue-200 bg-blue-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users className="text-blue-600" />
          How It Works
        </h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Share Your Code
              </h3>
              <p className="text-gray-600">
                Share your unique referral code with friends and family.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Friend Signs Up
              </h3>
              <p className="text-gray-600">
                Your friend uses your code to sign up on Cars24. They receive{" "}
                <span className="font-bold text-green-600">50 points</span> as a
                welcome bonus.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                First Purchase
              </h3>
              <p className="text-gray-600">
                When your friend makes their first purchase, both of you receive
                bonus points. You get{" "}
                <span className="font-bold text-orange-600">100 points</span> and
                they get an extra{" "}
                <span className="font-bold text-orange-600">50 points</span>.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Redeem Points
              </h3>
              <p className="text-gray-600">
                Use your accumulated points to get discounts on future purchases
                and services.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-blue-200">
          <p className="text-gray-600 mb-2">Referred Users</p>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500 mt-2">Coming soon</p>
        </Card>

        <Card className="p-6 border-orange-200">
          <p className="text-gray-600 mb-2">Referrer User</p>
          <p className="text-3xl font-bold text-orange-600">N/A</p>
          <p className="text-sm text-gray-500 mt-2">Coming soon</p>
        </Card>
      </div>
    </div>
  );
};

export default Referrals;

