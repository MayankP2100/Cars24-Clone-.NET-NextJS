// filepath: src/lib/notificationService.ts

export type NotificationType = 'appointment' | 'bid' | 'price_drop' | 'message';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  url?: string;
}

/**
 * Send a push notification to a user via backend API
 * This should only be called from the backend/server
 */
export const sendNotification = async (payload: NotificationPayload) => {
  try {
    // For production: call your backend API, not the internal Next.js API
    // Example: const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    // This is a simplified version for demo purposes

    console.log('Notification would be sent:', payload);
    console.log('In production, this would call your backend API to send via Firebase Admin SDK');

    // Don't actually call the API from client-side for security
    // The test page will handle notifications client-side instead
    return { success: true, message: 'Notification logged (client-side only)' };
  } catch (error) {
    console.error('Error processing notification:', error);
    throw error;
  }
};

/**
 * Send appointment confirmation notification
 */
export const sendAppointmentConfirmation = async (
  userId: string,
  appointmentDetails: {
    carTitle: string;
    dateTime: string;
    location: string;
    appointmentId: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'appointment',
    title: 'Appointment Confirmed',
    message: `Your appointment for ${appointmentDetails.carTitle} is confirmed on ${appointmentDetails.dateTime} at ${appointmentDetails.location}`,
    url: `/appointments/${appointmentDetails.appointmentId}`,
  });
};

/**
 * Send bid update notification
 */
export const sendBidUpdate = async (
  userId: string,
  bidDetails: {
    carTitle: string;
    bidAmount: string;
    bidId: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'bid',
    title: 'Bid Update',
    message: `New bid of ₹${bidDetails.bidAmount} received for ${bidDetails.carTitle}`,
    url: `/bids/${bidDetails.bidId}`,
  });
};

/**
 * Send price drop notification
 */
export const sendPriceDropAlert = async (
  userId: string,
  priceDetails: {
    carTitle: string;
    oldPrice: string;
    newPrice: string;
    carId: string;
    savings: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'price_drop',
    title: 'Price Drop Alert!',
    message: `${priceDetails.carTitle} price dropped from ₹${priceDetails.oldPrice} to ₹${priceDetails.newPrice}. Save ₹${priceDetails.savings}!`,
    url: `/buy-car/${priceDetails.carId}`,
  });
};

/**
 * Send new message notification
 */
export const sendNewMessageNotification = async (
  userId: string,
  messageDetails: {
    senderName: string;
    preview: string;
    conversationId: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'message',
    title: `New message from ${messageDetails.senderName}`,
    message: messageDetails.preview,
    url: `/messages/${messageDetails.conversationId}`,
  });
};

