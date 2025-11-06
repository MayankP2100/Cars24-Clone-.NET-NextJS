import React, { useEffect, useState } from 'react';
import { Bell, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {BASE_URL} from "@/lib/utils";

export type NotificationPreferences = {
  id?: string;
  pushNotification: boolean;
  appointmentReminder: boolean;
  priceDropReminder: boolean;
};

const defaultPreferences: NotificationPreferences = {
  id: undefined,
  pushNotification: true,
  appointmentReminder: true,
  priceDropReminder: true,
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
      } else if (response.status !== 404) {
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

    if (!preferences.id) {
      setError('Preference ID not loaded');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const requestBody = {
        id: preferences.id,
        userId: user.id,
        pushNotification: preferences.pushNotification,
        appointmentReminder: preferences.appointmentReminder,
        priceDropReminder: preferences.priceDropReminder,
      };

      const response = await fetch(`${BASE_URL}/api/notificationpreference/${preferences.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setSaved(true);
        onSave?.(preferences);
        setTimeout(() => onClose(), 1500);
      } else {
        setError('Failed to save preferences');
      }
    } catch (error) {
      setError('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
        </div>

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
          <>
            <div className="space-y-4 mb-6">
              {/* Master Toggle - Push Notifications */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.pushNotification}
                    onChange={() => handleToggle('pushNotification')}
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
                    disabled={!preferences.pushNotification}
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
                    disabled={!preferences.pushNotification}
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Price Drop Alerts</span>
                    <p className="text-xs text-gray-600">Get notified when car prices drop</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
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
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPreferencesModal;

