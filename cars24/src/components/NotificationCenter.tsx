import React, { useState, useEffect } from 'react';
import { Bell, X, Trash2, CheckCircle, AlertCircle, Info, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type NotificationType = 'appointment' | 'bid' | 'price_drop' | 'message' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  url?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onDeleteNotification?: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'appointment':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'bid':
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    case 'price_drop':
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-blue-600" />;
    default:
      return <Info className="h-5 w-5 text-gray-600" />;
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onDeleteNotification,
}) => {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const unreadCount = localNotifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick?.(notification);
    if (notification.url) {
      window.location.href = notification.url;
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteNotification?.(id);
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setLocalNotifications([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-96 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {localNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No notifications yet</p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {localNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(notification.id, e)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {localNotifications.length > 0 && (
          <div className="border-t p-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="w-full text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;

