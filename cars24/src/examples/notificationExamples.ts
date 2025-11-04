// filepath: src/examples/notificationExamples.ts
/**
 * Example usage of the notification system
 * This file demonstrates how to integrate notifications into different parts of the app
 */

import { useNotificationContext } from '@/context/NotificationContext';
import {
  sendAppointmentConfirmation,
  sendBidUpdate,
  sendPriceDropAlert,
  sendNewMessageNotification,
} from '@/lib/notificationService';

// Example 1: Send notification when appointment is confirmed
export const handleAppointmentConfirmation = async (
  userId: string,
  appointmentData: any
) => {
  try {
    await sendAppointmentConfirmation(userId, {
      carTitle: appointmentData.car.title,
      dateTime: new Date(appointmentData.dateTime).toLocaleDateString(),
      location: appointmentData.location,
      appointmentId: appointmentData.id,
    });

    console.log('Appointment confirmation notification sent');
  } catch (error) {
    console.error('Failed to send appointment notification:', error);
  }
};

// Example 2: Send notification when bid is placed
export const handleBidPlaced = async (
  sellerId: string,
  bidData: any
) => {
  try {
    await sendBidUpdate(sellerId, {
      carTitle: bidData.car.title,
      bidAmount: bidData.amount.toLocaleString('en-IN'),
      bidId: bidData.id,
    });

    console.log('Bid update notification sent');
  } catch (error) {
    console.error('Failed to send bid notification:', error);
  }
};

// Example 3: Send notification when price is reduced
export const handlePriceReduction = async (
  userId: string,
  carData: any,
  oldPrice: number,
  newPrice: number
) => {
  try {
    const savings = oldPrice - newPrice;

    await sendPriceDropAlert(userId, {
      carTitle: carData.title,
      oldPrice: oldPrice.toLocaleString('en-IN'),
      newPrice: newPrice.toLocaleString('en-IN'),
      carId: carData.id,
      savings: savings.toLocaleString('en-IN'),
    });

    console.log('Price drop notification sent');
  } catch (error) {
    console.error('Failed to send price drop notification:', error);
  }
};

// Example 4: Send notification for new message
export const handleNewMessage = async (
  receiverId: string,
  messageData: any
) => {
  try {
    await sendNewMessageNotification(receiverId, {
      senderName: messageData.sender.name,
      preview: messageData.content.substring(0, 100),
      conversationId: messageData.conversationId,
    });

    console.log('New message notification sent');
  } catch (error) {
    console.error('Failed to send message notification:', error);
  }
};

// Example 5: Using notification context in a component
export const NotificationExampleComponent = () => {
  const { addNotification } = useNotificationContext();

  const showCustomNotification = () => {
    addNotification({
      type: 'info',
      title: 'Custom Notification',
      message: 'This is a custom notification example',
      timestamp: new Date(),
      read: false,
      url: '/dashboard',
    });
  };

  return (
    <button onClick={showCustomNotification}>
      Show Notification
    </button>
  );
};

// Example 6: Batch sending notifications to multiple users
export const sendBulkNotifications = async (
  userIds: string[],
  notificationData: {
    type: 'appointment' | 'bid' | 'price_drop' | 'message';
    title: string;
    message: string;
    url?: string;
  }
) => {
  const promises = userIds.map(userId =>
    fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET || '',
      },
      body: JSON.stringify({
        userId,
        ...notificationData,
      }),
    })
  );

  try {
    const results = await Promise.all(promises);
    console.log(`Sent ${results.length} notifications`);
  } catch (error) {
    console.error('Failed to send bulk notifications:', error);
  }
};

// Example 7: Subscribe to appointment confirmations in appointments page
export const useAppointmentNotifications = () => {
  const { addNotification } = useNotificationContext();

  const showAppointmentNotification = (appointmentData: any) => {
    addNotification({
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: `Your appointment for ${appointmentData.carTitle} is confirmed for ${appointmentData.dateTime}`,
      timestamp: new Date(),
      read: false,
      url: `/appointments/${appointmentData.id}`,
    });
  };

  return { showAppointmentNotification };
};

// Example 8: Price drop tracking for saved cars
export const usePriceDropNotifications = () => {
  const { addNotification } = useNotificationContext();

  const checkAndNotifyPriceDrop = (
    previousPrice: number,
    currentPrice: number,
    carData: any
  ) => {
    if (currentPrice < previousPrice) {
      const savings = previousPrice - currentPrice;

      addNotification({
        type: 'price_drop',
        title: 'Price Drop!',
        message: `${carData.title} is now ₹${currentPrice.toLocaleString('en-IN')}! Save ₹${savings.toLocaleString('en-IN')}`,
        timestamp: new Date(),
        read: false,
        url: `/buy-car/${carData.id}`,
      });
    }
  };

  return { checkAndNotifyPriceDrop };
};

