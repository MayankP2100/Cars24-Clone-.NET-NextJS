// filepath: src/pages/test/notifications.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNotificationContext } from '@/context/NotificationContext';

export default function NotificationsTestPage() {
  const { addNotification, notifications } = useNotificationContext();
  const [loading, setLoading] = useState(false);

  const handleAppointmentNotification = async () => {
    setLoading(true);
    try {
      addNotification({
        type: 'appointment',
        title: 'Appointment Confirmed',
        message: '2021 Honda City appointment confirmed for Dec 15, 2024 at 2:30 PM',
        timestamp: new Date(),
        read: false,
        url: '/appointments/apt-123',
      });
      alert('Appointment notification sent!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleBidNotification = async () => {
    setLoading(true);
    try {
      addNotification({
        type: 'bid',
        title: 'New Bid Received',
        message: 'New bid of ₹650,000 received for 2019 Maruti Swift',
        timestamp: new Date(),
        read: false,
        url: '/bids/bid-456',
      });
      alert('Bid notification sent!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceDropNotification = async () => {
    setLoading(true);
    try {
      addNotification({
        type: 'price_drop',
        title: 'Price Drop Alert!',
        message: '2018 Hyundai Creta price dropped from ₹1,200,000 to ₹1,150,000. Save ₹50,000!',
        timestamp: new Date(),
        read: false,
        url: '/buy-car/car-789',
      });
      alert('Price drop notification sent!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageNotification = async () => {
    setLoading(true);
    try {
      addNotification({
        type: 'message',
        title: 'New message from John Seller',
        message: 'Is this car still available? I am very interested.',
        timestamp: new Date(),
        read: false,
        url: '/messages/conv-321',
      });
      alert('Message notification sent!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomNotification = () => {
    addNotification({
      type: 'info',
      title: 'Custom Test Notification',
      message: 'This is a test notification to verify the system is working correctly.',
      timestamp: new Date(),
      read: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Notification System Test</h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Info:</strong> Click any button below to trigger a notification. The notification will appear in the bell icon in the header and also show as a push notification if permissions are granted.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Test Different Notification Types:</h2>

            <Button
              onClick={handleAppointmentNotification}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              📅 Test Appointment Confirmation
            </Button>

            <Button
              onClick={handleBidNotification}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              💰 Test Bid Update
            </Button>

            <Button
              onClick={handlePriceDropNotification}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              📉 Test Price Drop Alert
            </Button>

            <Button
              onClick={handleMessageNotification}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              💬 Test New Message
            </Button>

            <Button
              onClick={handleCustomNotification}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              ✨ Test Custom Notification
            </Button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold mb-2">Current Notifications ({notifications.length})</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No notifications yet. Trigger one above to test.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notif) => (
                  <li key={notif.id} className="text-sm bg-white p-2 rounded border">
                    <strong>{notif.title}</strong>
                    <p className="text-gray-600">{notif.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-yellow-900 mb-2">Setup Checklist:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>✓ Check if notification bell appears in header</li>
              <li>✓ Allow notification permissions when prompted</li>
              <li>✓ Verify FCM token is logged in console</li>
              <li>✓ Check if push notifications appear</li>
              <li>✓ Click notification to navigate to URL</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

