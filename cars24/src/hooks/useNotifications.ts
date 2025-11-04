import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is properly loaded
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

export const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // check if notifications are supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setIsSupported(false);
      return;
    }

    const initNotifications = async () => {
      try {
        // register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        });

        // initialize Firebase and get messaging instance
        const msg = initializeFirebase();

        // if Firebase is not properly configured, disable notifications
        if (!msg) {
          console.log('Firebase not configured. Notifications disabled.');
          setIsSupported(false);
          return;
        }

        // request notification permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          try {
            // get FCM token
            const token = await getToken(msg, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });

            if (token) {
              setFcmToken(token);
              // save token to backend for this user
              await saveFcmTokenToBackend(token);
            }
          } catch (error: any) {
            console.warn('Failed to get FCM token. VAPID key may be invalid:', error.message);
            console.log('Notifications disabled. Please verify your Firebase VAPID key.');
            setIsSupported(false);
            return;
          }
        }

        // listen for messages when app is in foreground
        onMessage(msg, (payload) => {
          console.log('Message received:', payload);
          setNotifications((prev) => [...prev, payload]);

          // show custom notification
          if (registration.active) {
            registration.active.postMessage({
              type: 'NOTIFICATION_RECEIVED',
              payload,
            });
          }
        });
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initNotifications();
  }, []);

  return { fcmToken, isSupported, notifications };
};

const saveFcmTokenToBackend = async (token: string) => {
  try {
    const response = await fetch('/api/notifications/register-token', {
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

