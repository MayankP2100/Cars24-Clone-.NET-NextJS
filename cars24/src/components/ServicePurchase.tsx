'use client';

import React, { useState, useEffect } from 'react';
import { usePoints } from '@/hooks/usePoints';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader, Check } from 'lucide-react';

interface ServicePurchaseProps {
  userId: string;
  serviceId: string;
  serviceName: string;
  costInPoints: number;
  onServicePurchased?: (pointsSpent: number, remainingBalance: number) => void;
  className?: string;
}

export const ServicePurchase: React.FC<ServicePurchaseProps> = ({
  userId,
  serviceId,
  serviceName,
  costInPoints,
  onServicePurchased,
  className = '',
}) => {
  const { balance, loading, error, purchaseService, fetchBalance} = usePoints();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [pointsSpent, setPointsSpent] = useState<number>(0);

  useEffect(() => {
    if (userId) {
      fetchBalance(userId);
    }
  }, [userId, fetchBalance]);

  const canPurchase = (balance ?? 0) >= costInPoints;

  const handlePurchase = async () => {
    if (!userId || !canPurchase) {
      return;
    }

    setIsPurchasing(true);
    try {
      const result = await purchaseService(userId, serviceId);
      if (result) {
        setPointsSpent(result.PointsSpent);
        setPurchaseSuccess(true);
        onServicePurchased?.(result.PointsSpent, result.RemainingBalance);
        setTimeout(() => setPurchaseSuccess(false), 4000);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{serviceName}</h3>
          <Badge variant="secondary" className="mt-2">
            Premium Service
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Cost in Points</p>
          <p className="text-2xl font-bold text-blue-600">{costInPoints}</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Your Points Balance</span>
            <span className="text-sm font-bold text-blue-600">{balance ?? 0}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                canPurchase ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{
                width: `${Math.min(100, ((balance ?? 0) / costInPoints) * 100)}%`,
              }}
            />
          </div>
          {!canPurchase && (
            <p className="text-xs text-red-600 mt-2">
              You need {costInPoints - (balance ?? 0)} more points
            </p>
          )}
        </div>

        <Button
          onClick={handlePurchase}
          disabled={isPurchasing || loading || !canPurchase}
          className="w-full"
          variant={canPurchase ? 'default' : 'secondary'}
        >
          {isPurchasing || loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Purchase with ${costInPoints} Points`
          )}
        </Button>

        {purchaseSuccess && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              <div>
                <p className="font-semibold">Purchase Successful!</p>
                <p className="text-sm">
                  {pointsSpent} points spent. {balance ? `${balance - pointsSpent} points remaining` : ''}
                </p>
              </div>
            </div>
          </Alert>
        )}
      </div>
    </Card>
  );
};

export default ServicePurchase;

