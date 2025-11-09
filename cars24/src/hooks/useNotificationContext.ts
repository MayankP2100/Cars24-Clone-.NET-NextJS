import { useContext } from 'react';
import { useNotificationContext as useContextHook } from '@/context/NotificationContext';

export const useNotifications = () => {
  const { addNotification } = useContextHook();

  return {
    addNotification,
    sendPurchaseNotification: (carTitle: string, price: string) => {
      addNotification({
        type: 'purchase',
        title: 'Purchase Confirmed',
        message: `You successfully purchased ${carTitle} for ₹${price}`,
        read: false,
      });
    },
    sendSaleNotification: (carTitle: string, price: string) => {
      addNotification({
        type: 'sale',
        title: 'Sale Confirmed',
        message: `You successfully sold ${carTitle} for ₹${price}`,
        read: false,
      });
    },
    sendReferralNotification: (points: number, reason: string) => {
      addNotification({
        type: 'referral',
        title: 'Referral Bonus Earned!',
        message: `You earned ${points} points for ${reason}`,
        read: false,
      });
    },
    sendBookingNotification: (carTitle: string, date: string, time: string) => {
      addNotification({
        type: 'appointment',
        title: 'Booking Confirmed',
        message: `Your booking for ${carTitle} on ${date} at ${time} is confirmed`,
        read: false,
      });
    },
  };
};

