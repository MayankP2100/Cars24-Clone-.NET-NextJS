# Real-Time Push Notification System - Integration Guide

## 🎯 Quick Integration Steps

### Step 1: Environment Setup
Copy `.env.example` to `.env.local` and fill in your Firebase credentials:
```bash
cp .env.example .env.local
```

### Step 2: Install Dependencies
```bash
npm install firebase firebase-admin
```

### Step 3: Test the System
Visit: `http://localhost:3000/test/notifications`

---

## 📱 Features Implemented

### 1. **Real-Time Push Notifications**
- Firebase Cloud Messaging (FCM)
- Service Worker for background notifications
- Web Push API support
- Mobile browser support

### 2. **In-App Notification Center**
- Bell icon in header with unread badge
- Modal showing all notifications
- Delete individual notifications
- Clear all notifications
- Clickable notifications with URL navigation

### 3. **Notification Types**
- **Appointment**: Appointment confirmations
- **Bid**: New bids received
- **Price Drop**: Price reduction alerts
- **Message**: New messages
- **Info**: General notifications

### 4. **User Preferences**
- Customizable notification settings
- Control per notification type
- Email and SMS options
- Saved to database per user

### 5. **Global State Management**
- NotificationContext for app-wide state
- Add, remove, clear notifications
- Mark as read functionality
- Auto-dismiss timer for non-critical notifications

---

## 🔧 Integration Points

### In Appointment Confirmation
```typescript
// src/pages/book-appointment/[id]/index.tsx
import { sendAppointmentConfirmation } from '@/lib/notificationService';

// When appointment is confirmed:
await sendAppointmentConfirmation(userId, {
  carTitle: car.title,
  dateTime: appointmentDateTime,
  location: appointmentLocation,
  appointmentId: appointment.id,
});
```

### In Bid System
```typescript
// When someone places a bid
import { sendBidUpdate } from '@/lib/notificationService';

await sendBidUpdate(sellerUserId, {
  carTitle: car.title,
  bidAmount: bid.amount.toLocaleString('en-IN'),
  bidId: bid.id,
});
```

### In Price Update
```typescript
// When car price is reduced
import { sendPriceDropAlert } from '@/lib/notificationService';

await sendPriceDropAlert(watchingUserId, {
  carTitle: car.title,
  oldPrice: oldPrice.toLocaleString('en-IN'),
  newPrice: newPrice.toLocaleString('en-IN'),
  carId: car.id,
  savings: (oldPrice - newPrice).toLocaleString('en-IN'),
});
```

### In Messaging
```typescript
// When user receives a message
import { sendNewMessageNotification } from '@/lib/notificationService';

await sendNewMessageNotification(recipientUserId, {
  senderName: sender.name,
  preview: message.content.substring(0, 100),
  conversationId: conversation.id,
});
```

### Using in Components
```typescript
// src/components/MyComponent.tsx
import { useNotificationContext } from '@/context/NotificationContext';

export const MyComponent = () => {
  const { addNotification } = useNotificationContext();

  const handleAction = () => {
    addNotification({
      type: 'message',
      title: 'New Message',
      message: 'You have a new message',
      timestamp: new Date(),
      read: false,
      url: '/messages/123',
    });
  };

  return <button onClick={handleAction}>Trigger Notification</button>;
};
```

---

## 🗄️ Backend Integration

### Database Schema (PostgreSQL Example)
```sql
-- User FCM Tokens Table
CREATE TABLE user_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  fcm_token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, fcm_token)
);

-- Notification Preferences Table
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  appointment_confirmations BOOLEAN DEFAULT true,
  bid_updates BOOLEAN DEFAULT true,
  price_drop BOOLEAN DEFAULT true,
  new_messages BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications History Table (optional)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Backend Implementation (Node.js/Express)
```typescript
// Implement in your backend server

import * as admin from 'firebase-admin';

const serviceAccount = require('./firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Send notification to user
async function sendPushNotification(userId: string, notification: {
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  // Get user's FCM tokens from database
  const tokens = await db.userTokens.findMany({ where: { userId } });

  if (tokens.length === 0) return;

  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: notification.data || {},
  };

  // Send to all user's devices
  const results = await admin.messaging().sendMulticast({
    tokens: tokens.map(t => t.fcmToken),
    ...message,
  });

  console.log(`Sent notifications to ${results.successCount} devices`);
}
```

---

## 🧪 Testing

### Test Page
Visit: `http://localhost:3000/test/notifications`

This page allows you to:
- Trigger different notification types
- See notifications in real-time
- Test all functionality
- Verify setup

### Manual Testing Steps
1. Open app and grant notification permission
2. Check browser console for FCM token
3. Open DevTools > Application > Service Workers
4. Verify service worker is registered
5. Click test buttons on notification page
6. See notifications appear in bell icon
7. Click notifications to navigate

### Browser DevTools Checks
```
Chrome/Firefox DevTools:
- Application tab > Service Workers (should show registered)
- Application tab > Manifest (should show notification icon)
- Console (should show FCM token and status messages)
- Network tab (should show notification requests)
```

---

## 🔒 Security Considerations

1. **API Secret**: Used for backend-to-backend communication
2. **User Authentication**: All endpoints verify user ID
3. **Token Validation**: FCM tokens are verified
4. **HTTPS Required**: In production (localhost allowed in dev)
5. **CORS Protection**: Configure CORS headers properly

### API Endpoint Security
```typescript
// Verify API calls have proper headers
export const validateApiSecret = (req: NextApiRequest) => {
  const secret = req.headers['x-api-secret'];
  return secret === process.env.API_SECRET;
};

// Verify user is authenticated
export const validateUserAuth = (req: NextApiRequest) => {
  const userId = req.headers['x-user-id'];
  return userId && userId.length > 0;
};
```

---

## 🚀 Deployment Checklist

- [ ] Firebase project created and configured
- [ ] VAPID key generated in Firebase Console
- [ ] Environment variables set in production
- [ ] Service worker deployed and accessible at `/firebase-messaging-sw.js`
- [ ] HTTPS enabled
- [ ] Firebase Admin SDK credentials secured
- [ ] Backend API endpoints implemented
- [ ] Database tables created
- [ ] Notification preferences API implemented
- [ ] Token registration API implemented
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] Testing completed on multiple devices

---

## 📊 Monitoring & Analytics

### Key Metrics to Track
- FCM token registration rate
- Notification delivery rate
- Click-through rate
- Preference update frequency
- User engagement by notification type

### Debug Logging
```typescript
// Enable debug logging in NotificationContext
console.log('Notification added:', notification);
console.log('FCM token:', fcmToken);
console.log('Service Worker status:', registration);
```

---

## 🐛 Troubleshooting

### Issue: Notifications not appearing
**Solution:**
- Check browser notification permissions
- Verify FCM token is generated (check console)
- Ensure service worker is registered
- Check Firebase Console for errors
- Verify HTTPS is enabled (required for production)

### Issue: Service Worker not registering
**Solution:**
- Clear browser cache
- Check DevTools for registration errors
- Verify service worker file exists
- Ensure correct VAPID key
- Check browser console for errors

### Issue: Push notifications not working
**Solution:**
- Verify Firebase project is correctly configured
- Check VAPID key is valid
- Ensure backend has Firebase Admin SDK
- Check network requests in DevTools
- Verify FCM token is valid

### Issue: User preferences not saving
**Solution:**
- Check API endpoint is implemented
- Verify database connection
- Check user ID is passed correctly
- Look for database errors in logs

---

## 📚 Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

## 🎓 Learning Path

1. Understand Firebase Cloud Messaging basics
2. Set up Firebase project and get credentials
3. Implement frontend notification system
4. Set up backend APIs
5. Implement database persistence
6. Add user preferences
7. Test on multiple devices
8. Deploy to production
9. Monitor and optimize

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review Firebase Console logs
3. Check database for data persistence
4. Review implementation guide
5. Refer to test page for examples

