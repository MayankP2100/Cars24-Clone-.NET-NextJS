import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationCenter from '@/components/NotificationCenter';
import NotificationPreferencesModal from '@/components/NotificationPreferencesModal';
import { useNotificationContext } from '@/context/NotificationContext';
import type { NotificationPreferences } from '@/components/NotificationPreferencesModal';

export const NotificationBell: React.FC = () => {
  const { notifications } = useNotificationContext();
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handlePreferencesSave = (preferences: NotificationPreferences) => {
    console.log('Preferences saved:', preferences);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="relative text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          onClick={() => setNotificationCenterOpen(true)}
          title="Notifications"
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 flex items-center justify-center">
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </div>
            )}
          </div>
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

