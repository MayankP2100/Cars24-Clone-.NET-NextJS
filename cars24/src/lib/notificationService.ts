// filepath: src/lib/notificationService.ts

export type NotificationType = 'appointment' | 'bid' | 'price_drop' | 'message' | 'purchase' | 'sale' | 'referral' | 'booking';

export interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  url?: string;
}

/**
 * For production: Backend should send notifications via Firebase Admin SDK
 * This service is a placeholder for future backend integration
 *
 * Current implementation: Use notification context directly in components
 * Example: const { addNotification } = useNotificationContext();
 */
export const sendNotification = async (payload: NotificationPayload) => {
  try {
    console.log('Notification logged:', payload);
    return { success: true, message: 'Notification processed' };
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

export const sendPurchaseConfirmation = async (
  userId: string,
  purchaseDetails: {
    carTitle: string;
    price: string;
    purchaseId: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'purchase',
    title: 'Purchase Confirmed',
    message: `You successfully purchased ${purchaseDetails.carTitle} for ₹${purchaseDetails.price}`,
    url: `/purchases`,
  });
};

export const sendSaleConfirmation = async (
  userId: string,
  saleDetails: {
    carTitle: string;
    price: string;
    purchaseId: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'sale',
    title: 'Sale Confirmed',
    message: `You successfully sold ${saleDetails.carTitle} for ₹${saleDetails.price}`,
    url: `/purchases`,
  });
};

export const sendReferralBonusNotification = async (
  userId: string,
  bonusDetails: {
    points: number;
    reason: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'referral',
    title: 'Referral Bonus Earned!',
    message: `You earned ${bonusDetails.points} points for ${bonusDetails.reason}`,
    url: `/referrals`,
  });
};

export const sendBookingConfirmation = async (
  userId: string,
  bookingDetails: {
    carTitle: string;
    date: string;
    time: string;
    bookingId: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'booking',
    title: 'Booking Confirmed',
    message: `Your booking for ${bookingDetails.carTitle} on ${bookingDetails.date} at ${bookingDetails.time} is confirmed`,
    url: `/bookings/${bookingDetails.bookingId}`,
  });
};

