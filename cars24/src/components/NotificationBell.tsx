// filepath: src/components/NotificationBell.tsx
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationCenter from '@/components/NotificationCenter';
import NotificationPreferencesModal from '@/components/NotificationPreferencesModal';
import { useNotificationContext } from '@/context/NotificationContext';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationPreferences } from '@/components/NotificationPreferencesModal';

export const NotificationBell: React.FC = () => {
  const { notifications } = useNotificationContext();
  const { isSupported } = useNotifications();
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isSupported) {
    return null;
  }

  const handlePreferencesSave = (preferences: NotificationPreferences) => {
    console.log('Preferences saved:', preferences);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="relative text-gray-700 hover:text-blue-600"
          onClick={() => setNotificationCenterOpen(true)}
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>

      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
        notifications={notifications}
        onDeleteNotification={() => {}}
      />

      <NotificationPreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        onSave={handlePreferencesSave}
      />
    </>
  );
};

export default NotificationBell;

