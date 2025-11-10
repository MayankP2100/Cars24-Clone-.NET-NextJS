'use client';

import React, { useState, useEffect } from 'react';
import { usePoints } from '@/hooks/usePoints';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Loader } from 'lucide-react';

interface RedeemPointsProps {
  userId: string;
  onPointsRedeemed?: (pointsRedeemed: number, remainingBalance: number) => void;
  className?: string;
}

export const RedeemPoints: React.FC<RedeemPointsProps> = ({
  userId,
  onPointsRedeemed,
  className = '',
}) => {
  const { balance, loading, error, redeemPoints, fetchBalance} = usePoints();
  const [pointsToRedeem, setPointsToRedeem] = useState<string>('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchBalance(userId);
    }
  }, [userId, fetchBalance]);

  const handleRedeem = async () => {
    if (!userId || !pointsToRedeem) {
      return;
    }

    const points = parseInt(pointsToRedeem);
    if (points <= 0 || (balance && points > balance)) {
      return;
    }

    setIsRedeeming(true);
    try {
      const success = await redeemPoints(userId, points);
      if (success) {
        setRedeemSuccess(true);
        setPointsToRedeem('');
        onPointsRedeemed?.(points, balance ? balance - points : 0);
        setTimeout(() => setRedeemSuccess(false), 3000);
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  const canRedeem = balance && parseInt(pointsToRedeem || '0') > 0 && parseInt(pointsToRedeem || '0') <= balance;

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Redeem Points to Wallet</h3>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {redeemSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          ✓ Points successfully redeemed to your wallet!
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Current Balance</label>
          <p className="text-2xl font-bold text-blue-600">{balance ?? 0} points</p>
        </div>

        <div>
          <label htmlFor="pointsToRedeem" className="text-sm font-medium text-gray-700">
            Points to Redeem
          </label>
          <Input
            id="pointsToRedeem"
            type="number"
            placeholder="Enter points amount"
            value={pointsToRedeem}
            onChange={(e) => setPointsToRedeem(e.target.value)}
            disabled={isRedeeming || loading}
            min="0"
            max={balance || 0}
          />
          <p className="text-xs text-gray-500 mt-1">
            1 point = $0.01 (Max redeemable: {balance ?? 0} points)
          </p>
        </div>

        <Button
          onClick={handleRedeem}
          disabled={isRedeeming || loading || !canRedeem}
          className="w-full"
        >
          {isRedeeming || loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Redeem ${pointsToRedeem ? parseInt(pointsToRedeem) : 0} Points`
          )}
        </Button>

        {pointsToRedeem && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              You will receive: <span className="font-bold">${(parseInt(pointsToRedeem || '0') * 0.01).toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RedeemPoints;

