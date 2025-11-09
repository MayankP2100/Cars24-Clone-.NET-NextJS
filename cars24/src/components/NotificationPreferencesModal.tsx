import React, { useEffect, useState } from 'react';
import { Bell, Check, AlertCircle, Clock, Gift, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {BASE_URL} from "@/lib/utils";

export type NotificationPreferences = {
  id?: string;
  userId?: string;
  pushNotifications: boolean;
  appointmentReminder: boolean;
  priceDropReminder: boolean;
  purchaseNotification: boolean;
  saleNotification: boolean;
  referralNotification: boolean;
  bookingNotification: boolean;
  frequency: 'Instant' | 'Daily' | 'Weekly';
};

const defaultPreferences: NotificationPreferences = {
  id: undefined,
  userId: undefined,
  pushNotifications: true,
  appointmentReminder: true,
  priceDropReminder: true,
  purchaseNotification: true,
  saleNotification: true,
  referralNotification: true,
  bookingNotification: true,
  frequency: 'Instant',
};

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (preferences: NotificationPreferences) => void;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchPreferences();
    }
  }, [isOpen, user?.id]);

  const fetchPreferences = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/notificationpreference/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched preferences:', data);
        setPreferences(data);
      } else if (response.status === 404) {
        console.log('No preferences found, creating new ones...');
        // Create new preferences if they don't exist
        const newPrefs = { ...defaultPreferences, userId: user.id };
        setPreferences(newPrefs);
      } else {
        setError('Failed to load preferences');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const requestBody = {
        userId: user.id,
        pushNotifications: preferences.pushNotifications,
        appointmentReminder: preferences.appointmentReminder,
        priceDropReminder: preferences.priceDropReminder,
        purchaseNotification: preferences.purchaseNotification,
        saleNotification: preferences.saleNotification,
        referralNotification: preferences.referralNotification,
        bookingNotification: preferences.bookingNotification,
        frequency: preferences.frequency,
      };

      let url = `${BASE_URL}/api/notificationpreference`;
      let method = 'POST';

      if (preferences.id) {
        url = `${BASE_URL}/api/notificationpreference/${preferences.id}`;
        method = 'PUT';
        requestBody.id = preferences.id;
      }

      console.log(`${method} request to ${url}:`, requestBody);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const savedData = await response.json();
        console.log('Preferences saved successfully:', savedData);
        setPreferences(savedData);
        setSaved(true);
        onSave?.(preferences);
        setTimeout(() => onClose(), 1500);
      } else {
        setError('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-screen md:h-auto md:max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl md:text-2xl font-bold">Notification Preferences</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading preferences...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-3">
              {/* Master Toggle - Push Notifications */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={() => handleToggle('pushNotifications')}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Push Notifications</span>
                    <p className="text-xs text-gray-600">Enable/disable all push notifications</p>
                  </div>
                </label>
              </div>

              {/* Appointment Reminder */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.appointmentReminder}
                    onChange={() => handleToggle('appointmentReminder')}
                    className="h-4 w-4 rounded border-gray-300"
                    disabled={!preferences.pushNotifications}
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Appointment Reminders</span>
                    <p className="text-xs text-gray-600">Get notified about upcoming appointments</p>
                  </div>
                </label>
              </div>

              {/* Price Drop Reminder */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.priceDropReminder}
                    onChange={() => handleToggle('priceDropReminder')}
                    className="h-4 w-4 rounded border-gray-300"
                    disabled={!preferences.pushNotifications}
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Price Drop Alerts</span>
                    <p className="text-xs text-gray-600">Get notified when car prices drop</p>
                  </div>
                </label>
              </div>

              {/* Purchase Notification */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.purchaseNotification}
                    onChange={() => handleToggle('purchaseNotification')}
                    className="h-4 w-4 rounded border-gray-300"
                    disabled={!preferences.pushNotifications}
                  />
                  <div>
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Purchase Notifications
                    </span>
                    <p className="text-xs text-gray-600">Get notified when you complete a purchase</p>
                  </div>
                </label>
              </div>

              {/* Sale Notification */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.saleNotification}
                    onChange={() => handleToggle('saleNotification')}
                    className="h-4 w-4 rounded border-gray-300"
                    disabled={!preferences.pushNotifications}
                  />
                  <div>
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Sale Notifications
                    </span>
                    <p className="text-xs text-gray-600">Get notified when you list a car for sale</p>
                  </div>
                </label>
              </div>

              {/* Referral Notification */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.referralNotification}
                    onChange={() => handleToggle('referralNotification')}
                    className="h-4 w-4 rounded border-gray-300"
                    disabled={!preferences.pushNotifications}
                  />
                  <div>
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Referral Bonuses
                    </span>
                    <p className="text-xs text-gray-600">Get notified about referral rewards and bonuses</p>
                  </div>
                </label>
              </div>

              {/* Booking Notification */}
              <div className="border rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.bookingNotification}
                    onChange={() => handleToggle('bookingNotification')}
                    className="h-4 w-4 rounded border-gray-300"
                    disabled={!preferences.pushNotifications}
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Booking Confirmations</span>
                    <p className="text-xs text-gray-600">Get notified when you book a car</p>
                  </div>
                </label>
              </div>

              {/* Divider */}
              <div className="border-t my-3"></div>

              {/* Notification Frequency */}
              <div className="border rounded-lg p-4">
                <div className="mb-3">
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Notification Frequency
                  </span>
                  <p className="text-xs text-gray-600 mt-1">How often would you like to receive notifications?</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="Instant"
                      checked={preferences.frequency === 'Instant'}
                      onChange={() => setPreferences(prev => ({ ...prev, frequency: 'Instant' }))}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">Instant - Get notified immediately</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="Daily"
                      checked={preferences.frequency === 'Daily'}
                      onChange={() => setPreferences(prev => ({ ...prev, frequency: 'Daily' }))}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">Daily - Get a daily digest</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="Weekly"
                      checked={preferences.frequency === 'Weekly'}
                      onChange={() => setPreferences(prev => ({ ...prev, frequency: 'Weekly' }))}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">Weekly - Get a weekly digest</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferencesModal;

