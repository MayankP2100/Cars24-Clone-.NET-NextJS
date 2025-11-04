// filepath: src/lib/NOTIFICATION_SETUP.md
# Real-Time Push Notification System Setup Guide

## Overview
This guide explains how to set up and use the real-time push notification system for Cars24. The system supports Firebase Cloud Messaging (FCM) for browser and mobile notifications.

## Features
- ✅ Real-time push notifications via Firebase Cloud Messaging
- ✅ Customizable notification preferences
- ✅ Multiple notification types (appointments, bids, price drops, messages)
- ✅ Notification Center UI for viewing all notifications
- ✅ Service Worker integration for background notifications
- ✅ Email and SMS notification support

## Setup Instructions

### 1. Firebase Configuration

Add these environment variables to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key
API_SECRET=your_api_secret_for_backend
```

### 2. Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a new project or select an existing one
3. Enable Cloud Messaging
4. Generate VAPID key in Cloud Messaging settings
5. Download service account key for backend integration

### 3. Backend Integration

Install Firebase Admin SDK:
```bash
npm install firebase-admin
```

### 4. Service Worker

The service worker is located at `public/firebase-messaging-sw.ts`. It handles:
- Background push notifications
- Notification clicks
- Notification interactions

## Usage Examples

### Sending Notifications Programmatically

```typescript
import {
  sendAppointmentConfirmation,
  sendBidUpdate,
  sendPriceDropAlert,
  sendNewMessageNotification,
} from '@/lib/notificationService';

// Appointment confirmation
await sendAppointmentConfirmation('user-id', {
  carTitle: '2021 Honda City',
  dateTime: 'Dec 15, 2024 at 2:30 PM',
  location: 'Mumbai',
  appointmentId: 'apt-123',
});

// Bid update
await sendBidUpdate('user-id', {
  carTitle: '2019 Maruti Swift',
  bidAmount: '650,000',
  bidId: 'bid-456',
});

// Price drop alert
await sendPriceDropAlert('user-id', {
  carTitle: '2018 Hyundai Creta',
  oldPrice: '1,200,000',
  newPrice: '1,150,000',
  carId: 'car-789',
  savings: '50,000',
});

// New message
await sendNewMessageNotification('user-id', {
  senderName: 'Seller Name',
  preview: 'Is this car still available?',
  conversationId: 'conv-321',
});
```

### Using Notifications in Components

```typescript
import { useNotificationContext } from '@/context/NotificationContext';

export const MyComponent = () => {
  const { notifications, addNotification, removeNotification } = useNotificationContext();

  const handleAction = () => {
    addNotification({
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from John',
      timestamp: new Date(),
      read: false,
      url: '/messages/123',
    });
  };

  return (
    <div>
      <button onClick={handleAction}>Trigger Notification</button>
      <p>You have {notifications.length} notifications</p>
    </div>
  );
};
```

### User Notification Preferences

Users can customize their notification preferences through the modal in the header. The preferences are:

1. **Push Notifications**
   - Appointment Confirmations
   - Bid Updates
   - Price Drop Alerts
   - New Messages

2. **Other Channels**
   - Email Notifications
   - SMS Notifications

## API Endpoints

### Register FCM Token
**POST** `/api/notifications/register-token`
```json
{
  "fcmToken": "token_string"
}
```

### Get User Preferences
**GET** `/api/notifications/preferences`

### Update User Preferences
**POST** `/api/notifications/preferences`
```json
{
  "appointmentConfirmations": true,
  "bidUpdates": true,
  "priceDrop": true,
  "newMessages": true,
  "emailNotifications": false,
  "smsNotifications": false
}
```

### Send Notification (Backend Only)
**POST** `/api/notifications/send`
```json
{
  "userId": "user-id",
  "type": "appointment",
  "title": "Appointment Confirmed",
  "message": "Your appointment is confirmed",
  "url": "/appointments/123"
}
```

## Database Schema (Recommended)

```sql
-- User FCM Tokens
CREATE TABLE user_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  fcm_token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, fcm_token)
);

-- Notification Preferences
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  appointment_confirmations BOOLEAN DEFAULT true,
  bid_updates BOOLEAN DEFAULT true,
  price_drop BOOLEAN DEFAULT true,
  new_messages BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification History (optional)
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Frontend Integration Points

1. **Header Component**: Notification bell with unread count
2. **Notification Center**: View all notifications in a modal
3. **Preferences Modal**: Customize notification settings
4. **Context Provider**: Global notification state management
5. **Hooks**: useNotifications for FCM token registration

## Browser Support

- Chrome: ✅ Full support
- Firefox: ✅ Full support
- Safari: ⚠️ Limited support (requires HTTPS)
- Edge: ✅ Full support
- Mobile Browsers: ✅ Full support (with HTTPS)

## Troubleshooting

### Notifications not received
1. Check browser notification permissions
2. Verify VAPID key is correct
3. Check service worker is registered
4. Verify FCM token is saved to backend

### Service Worker issues
1. Clear browser cache
2. Re-register service worker
3. Check browser console for errors
4. Ensure HTTPS is enabled (required for production)

### Push notifications not working
1. Verify Firebase project configuration
2. Check network tab for API failures
3. Verify user permissions are granted
4. Check browser DevTools for service worker errors

## Security Considerations

1. Always validate FCM tokens on backend
2. Use HTTPS for all notification endpoints
3. Implement rate limiting to prevent spam
4. Store encrypted user preferences
5. Validate all notification payloads
6. Use API secret key for internal endpoints

## Future Enhancements

- [ ] In-app notification toast component
- [ ] Notification scheduling
- [ ] Notification templates
- [ ] Analytics and tracking
- [ ] A/B testing for notification content
- [ ] Notification grouping and threading

