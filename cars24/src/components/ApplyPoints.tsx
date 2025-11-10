'use client';

import React, { useState, useEffect } from 'react';
import { usePoints } from '@/hooks/usePoints';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Loader } from 'lucide-react';

interface ApplyPointsProps {
  userId: string;
  purchasePrice: number;
  onPointsApplied?: (finalPrice: number, pointsUsed: number) => void;
  className?: string;
}

export const ApplyPoints: React.FC<ApplyPointsProps> = ({
  userId,
  purchasePrice,
  onPointsApplied,
  className = '',
}) => {
  const { balance, loading, error, fetchBalance, clearError } = usePoints();
  const [maxPointsInput, setMaxPointsInput] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<number>(purchasePrice);
  const [pointsUsed, setPointsUsed] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchBalance(userId);
    }
  }, [userId, fetchBalance]);

  const handleApplyPoints = async () => {
    if (!userId || !balance || balance === 0) {
      clearError();
      return;
    }

    setIsApplying(true);
    try {
      const maxPoints = maxPointsInput ? parseInt(maxPointsInput) : balance;

      // Calculate discount based on points (1 point = 10 rupees)
      const POINTS_CONVERSION_RATE = 10;
      const pointsToUse = Math.min(maxPoints, balance);
      const discount = pointsToUse * POINTS_CONVERSION_RATE;
      const calculatedFinalPrice = Math.max(0, purchasePrice - discount);

      setDiscountAmount(discount);
      setFinalPrice(calculatedFinalPrice);
      setPointsUsed(pointsToUse);
      onPointsApplied?.(calculatedFinalPrice, pointsToUse);

    } finally {
      setIsApplying(false);
    }
  };

  const savings = purchasePrice - finalPrice;

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Apply Points to Purchase</h3>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Original Price</label>
            <p className="text-2xl font-bold">₹{(purchasePrice || 0).toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Available Points</label>
            <p className="text-2xl font-bold text-blue-600">{balance ?? 0}</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Max Points to Use (Optional)</label>
          <Input
            type="number"
            placeholder="Leave empty to use max available"
            value={maxPointsInput}
            onChange={(e) => setMaxPointsInput(e.target.value)}
            disabled={isApplying || loading}
            min="0"
          />
        </div>

        <Button
          onClick={handleApplyPoints}
          disabled={isApplying || loading || !balance || balance === 0}
          className="w-full"
        >
          {isApplying || loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Applying...
            </>
          ) : (
            'Apply Points'
          )}
        </Button>

        {pointsUsed > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Points Applied Successfully!</h4>
            <div className="space-y-1 text-sm text-green-800">
              {(() => {
                return (
                  <>
                    <p>Points Used: <span className="font-bold">{pointsUsed}</span></p>
                    <p>Final Price: <span className="font-bold">₹{finalPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span></p>
                    <p>You Saved: <span className="font-bold text-green-600">₹{discountAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span></p>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ApplyPoints;

