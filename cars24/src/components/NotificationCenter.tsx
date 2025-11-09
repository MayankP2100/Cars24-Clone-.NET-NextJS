import React, {useEffect, useState} from 'react';
import {AlertCircle, Bell, CheckCircle, Gift, Info, MessageSquare, ShoppingCart, Trash2, X} from 'lucide-react';

export type NotificationType =
  'appointment'
  | 'bid'
  | 'price_drop'
  | 'message'
  | 'info'
  | 'purchase'
  | 'sale'
  | 'referral'
  | 'booking';

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
    case 'booking':
      return <CheckCircle className="h-5 w-5 text-green-600"/>;
    case 'bid':
      return <AlertCircle className="h-5 w-5 text-orange-600"/>;
    case 'price_drop':
      return <AlertCircle className="h-5 w-5 text-red-600"/>;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-blue-600"/>;
    case 'purchase':
    case 'sale':
      return <ShoppingCart className="h-5 w-5 text-blue-600"/>;
    case 'referral':
      return <Gift className="h-5 w-5 text-purple-600"/>;
    default:
      return <Info className="h-5 w-5 text-gray-600"/>;
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
      {/* ...existing code... */}
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bell className="h-6 w-6 text-white"/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="text-sm text-gray-600">{unreadCount} new notifications</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6"/>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {localNotifications.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="bg-gray-200 p-6 rounded-full w-fit mx-auto mb-4">
                  <Bell className="h-12 w-12 text-gray-400"/>
                </div>
                <p className="text-xl font-semibold text-gray-900">No notifications yet</p>
                <p className="text-gray-500 mt-2">Stay tuned for updates</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {localNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 cursor-pointer border-l-4 ${
                    !notification.read ? 'border-l-blue-600 bg-blue-50' : 'border-l-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-lg font-semibold text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-gray-600 mt-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-400 mt-3 font-medium">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDelete(notification.id, e)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-all flex-shrink-0"
                          title="Delete notification"
                        >
                          <Trash2 className="h-5 w-5 text-red-600"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {localNotifications.length > 0 && (
        <div className="border-t border-gray-200 bg-white p-6 sticky bottom-0">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleClearAll}
              className="w-full px-6 py-3 text-lg font-medium bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-colors"
            >
              Clear All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

