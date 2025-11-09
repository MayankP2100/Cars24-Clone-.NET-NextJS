import React, { useEffect, useState } from 'react';
import { AlertCircle, Bell, Check, Clock, Gift, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from "@/lib/utils";

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
        setPreferences(data);
      } else if (response.status === 404) {
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

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const savedData = await response.json();
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
      <div className="bg-white rounded-xl shadow-2xl w-full h-screen md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
              <p className="text-xs text-gray-600 mt-0.5">Manage how you receive updates</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-gray-600 mt-3">Loading preferences...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!isLoading && (
            <div className="space-y-5">
              {/* Section 1: Core Notifications */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Core Notifications</h3>
                <div className="space-y-2">
                  {/* Master Toggle - Push Notifications */}
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.pushNotifications}
                        onChange={() => handleToggle('pushNotifications')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">Push Notifications</span>
                        <p className="text-xs text-gray-600">Master toggle for all notifications</p>
                      </div>
                    </label>
                  </div>

                  {/* Appointment Reminder */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.appointmentReminder}
                        onChange={() => handleToggle('appointmentReminder')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!preferences.pushNotifications}
                      />
                      <div className="flex-1">
                        <span className={`font-semibold ${!preferences.pushNotifications ? 'text-gray-500' : 'text-gray-900'}`}>
                          Appointment Reminders
                        </span>
                        <p className="text-xs text-gray-600">Upcoming bookings and appointments</p>
                      </div>
                    </label>
                  </div>

                  {/* Price Drop Reminder */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.priceDropReminder}
                        onChange={() => handleToggle('priceDropReminder')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!preferences.pushNotifications}
                      />
                      <div className="flex-1">
                        <span className={`font-semibold ${!preferences.pushNotifications ? 'text-gray-500' : 'text-gray-900'}`}>
                          Price Drop Alerts
                        </span>
                        <p className="text-xs text-gray-600">When car prices decrease</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Section 2: Transaction Notifications */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Transactions</h3>
                <div className="space-y-2">
                  {/* Purchase Notification */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.purchaseNotification}
                        onChange={() => handleToggle('purchaseNotification')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!preferences.pushNotifications}
                      />
                      <div className="flex-1">
                        <span className={`font-semibold flex items-center gap-2 ${!preferences.pushNotifications ? 'text-gray-500' : 'text-gray-900'}`}>
                          <ShoppingCart className="h-4 w-4 text-blue-600" />
                          Purchase Confirmations
                        </span>
                        <p className="text-xs text-gray-600">When you complete a purchase</p>
                      </div>
                    </label>
                  </div>

                  {/* Sale Notification */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.saleNotification}
                        onChange={() => handleToggle('saleNotification')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!preferences.pushNotifications}
                      />
                      <div className="flex-1">
                        <span className={`font-semibold flex items-center gap-2 ${!preferences.pushNotifications ? 'text-gray-500' : 'text-gray-900'}`}>
                          <ShoppingCart className="h-4 w-4 text-green-600" />
                          Sale Confirmations
                        </span>
                        <p className="text-xs text-gray-600">When you list a car for sale</p>
                      </div>
                    </label>
                  </div>

                  {/* Booking Notification */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.bookingNotification}
                        onChange={() => handleToggle('bookingNotification')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!preferences.pushNotifications}
                      />
                      <div className="flex-1">
                        <span className={`font-semibold ${!preferences.pushNotifications ? 'text-gray-500' : 'text-gray-900'}`}>
                          Booking Confirmations
                        </span>
                        <p className="text-xs text-gray-600">When you book a car</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Section 3: Rewards */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Rewards & Bonuses</h3>
                <div className="space-y-2">
                  {/* Referral Notification */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.referralNotification}
                        onChange={() => handleToggle('referralNotification')}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={!preferences.pushNotifications}
                      />
                      <div className="flex-1">
                        <span className={`font-semibold flex items-center gap-2 ${!preferences.pushNotifications ? 'text-gray-500' : 'text-gray-900'}`}>
                          <Gift className="h-4 w-4 text-purple-600" />
                          Referral Bonuses
                        </span>
                        <p className="text-xs text-gray-600">Rewards and referral earnings</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Section 4: Frequency */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Frequency
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="Instant"
                      checked={preferences.frequency === 'Instant'}
                      onChange={() => setPreferences(prev => ({ ...prev, frequency: 'Instant' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">Instant</span>
                      <p className="text-xs text-gray-600">Notifications immediately</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="Daily"
                      checked={preferences.frequency === 'Daily'}
                      onChange={() => setPreferences(prev => ({ ...prev, frequency: 'Daily' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">Daily Digest</span>
                      <p className="text-xs text-gray-600">Once per day summary</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value="Weekly"
                      checked={preferences.frequency === 'Weekly'}
                      onChange={() => setPreferences(prev => ({ ...prev, frequency: 'Weekly' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">Weekly Digest</span>
                      <p className="text-xs text-gray-600">Once per week summary</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 flex-shrink-0 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
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

