import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/lib/utils';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigValid = () => {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

let app: any = null;
let messaging: Messaging | null = null;

const initializeFirebase = () => {
  try {
    if (!isFirebaseConfigValid()) {
      console.warn('Firebase config is incomplete. Notifications disabled.');
      return null;
    }

    if (!app) {
      app = initializeApp(firebaseConfig);
    }
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
};

export type UserNotificationPreferences = {
  id?: string;
  pushNotification: boolean;
  appointmentReminder: boolean;
  priceDropReminder: boolean;
};

export const useNotifications = () => {
  const { user } = useAuth();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<UserNotificationPreferences | null>(null);

  // Fetch user preferences
  const fetchPreferences = async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/notificationpreference/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  // Check if notification type is allowed based on preferences
  const isNotificationTypeAllowed = (type: string): boolean => {
    if (!preferences?.pushNotification) {
      return false;
    }

    switch (type) {
      case 'appointment':
        return preferences.appointmentReminder;
      case 'price':
        return preferences.priceDropReminder;
      default:
        return true;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPreferences(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setIsSupported(false);
      return;
    }

    const initNotifications = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        });

        const msg = initializeFirebase();

        if (!msg) {
          console.log('Firebase not configured. Notifications disabled.');
          setIsSupported(false);
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          try {
            const token = await getToken(msg, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });

            if (token) {
              setFcmToken(token);
              if (user?.id) {
                await saveFcmTokenToBackend(token);
              }
            }
          } catch (error: any) {
            console.warn('Failed to get FCM token. VAPID key may be invalid:', error.message);
            console.log('Notifications disabled. Please verify your Firebase VAPID key.');
            setIsSupported(false);
            return;
          }
        }

        onMessage(msg, (payload) => {
          // Check preferences before displaying notification
          const notificationType = (payload.data?.type || 'default').toLowerCase();
          if (isNotificationTypeAllowed(notificationType)) {
            setNotifications((prev) => [...prev, payload]);

            if (registration.active) {
              registration.active.postMessage({
                type: 'NOTIFICATION_RECEIVED',
                payload,
              });
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initNotifications();
  }, [user?.id]);

  return {
    fcmToken,
    isSupported,
    notifications,
    preferences,
    isNotificationTypeAllowed,
  };
};

const saveFcmTokenToBackend = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/notifications/register-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fcmToken: token }),
    });
    if (!response.ok) {
      console.error('Failed to save FCM token');
    }
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

