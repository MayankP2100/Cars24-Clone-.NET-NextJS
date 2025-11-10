'use client';

import React, { useEffect } from 'react';
import { usePoints } from '@/hooks/usePoints';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';

interface PointsBalanceProps {
  userId: string;
  className?: string;
}

export const PointsBalance: React.FC<PointsBalanceProps> = ({ userId, className = '' }) => {
  const { balance, loading, error, fetchBalance } = usePoints();

  useEffect(() => {
    if (userId) {
      fetchBalance(userId);
    }
  }, [userId, fetchBalance]);

  if (loading && balance === null) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-center">
          <Loader className="h-4 w-4 animate-spin" />
          <span className="ml-2">Loading balance...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Available Points</p>
          <p className="text-2xl font-bold text-blue-600">{balance ?? 0}</p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Card>
  );
};

export default PointsBalance;

