importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the Service Worker
const firebaseConfig = {
    apiKey: "AIzaSyDgCkdO7_FI-xyNVtdQ-x6vD_x_sWc_9b0",
    authDomain: "cars24-da6da.firebaseapp.com",
    projectId: "cars24-da6da",
    storageBucket: "cars24-da6da.firebasestorage.app",
    messagingSenderId: "2085094695",
    appId: "1:2085094695:web:d2e720a0d99334f99c5502"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle incoming push messages
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.data?.tag || 'notification',
        data: payload.data || {},
        requireInteraction: payload.data?.requireInteraction === 'true' || false,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({type: 'window', includeUncontrolled: true}).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                if (clientList[i].url === urlToOpen && 'focus' in clientList[i]) {
                    return clientList[i].focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    // Notification closed
});

