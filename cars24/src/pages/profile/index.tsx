import {useAuth} from "@/context/AuthContext";
import {AlertCircle, Bell, Calendar, Car, Check, LogOut, Mail, Settings, User,} from "lucide-react";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {BASE_URL} from "@/lib/utils";

type NotificationPreferences = {
  id?: string;
  pushNotification: boolean;
  appointmentReminder: boolean;
  priceDropReminder: boolean;
};

const index = () => {
  const {user} = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    id: undefined,
    pushNotification: true,
    appointmentReminder: true,
    priceDropReminder: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchPreferences();
    }
  }, [user?.id]);

  const fetchPreferences = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/notificationpreference/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPreferences({
          id: data.id,
          pushNotification: data.pushNotification ?? true,
          appointmentReminder: data.appointmentReminder ?? true,
          priceDropReminder: data.priceDropReminder ?? true,
        });
      } else if (response.status === 404) {
        setPreferences({
          id: undefined,
          pushNotification: true,
          appointmentReminder: true,
          priceDropReminder: true,
        });
      } else {
        setError("Failed to load notification preferences");
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      setError("Failed to load notification preferences");
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

  const handleSavePreferences = async () => {
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    if (!preferences.id) {
      setError("Preference ID not loaded");
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
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const errorData = await response.text();
        setError(`Failed to save notification preferences`);
      }
    } catch (error) {
      setError("Failed to save notification preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-blue-600 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600"/>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {user?.fullName}
                  </h1>
                  <p className="text-blue-100">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Information */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg space-y-6">
                    {/* Profile Info Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                          Profile Information
                        </h2>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-gray-400"/>
                          <span className="text-gray-600">Full Name:</span>
                          <span className="font-medium">{user?.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-5 h-5 text-gray-400"/>
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{user?.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Bell className="w-5 h-5 text-gray-400"/>
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{user?.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notification Settings Section */}
                    <div className="border-t pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-blue-600"/>
                        <h2 className="text-xl font-semibold">
                          Notification Settings
                        </h2>
                      </div>

                      {isLoading && (
                        <div className="text-center py-6">
                          <p className="text-gray-600">Loading preferences...</p>
                        </div>
                      )}

                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
                          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0"/>
                          <p className="text-sm text-red-600">{error}</p>
                        </div>
                      )}

                      {!isLoading && (
                        <div className="space-y-4">
                          {/* Master Toggle */}
                          <div className="border rounded-lg p-4 bg-blue-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Push Notifications
                                </p>
                                <p className="text-sm text-gray-600">
                                  Enable/disable all push notifications
                                </p>
                              </div>
                              <input
                                type="checkbox"
                                checked={preferences.pushNotification}
                                onChange={() => handleToggle("pushNotification")}
                                className="h-5 w-5 rounded border-gray-300 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Appointment Reminder */}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Appointment Reminders
                                </p>
                                <p className="text-sm text-gray-600">
                                  Get notified about upcoming appointments
                                </p>
                              </div>
                              <input
                                type="checkbox"
                                checked={preferences.appointmentReminder}
                                onChange={() =>
                                  handleToggle("appointmentReminder")
                                }
                                disabled={!preferences.pushNotification}
                                className="h-5 w-5 rounded border-gray-300 cursor-pointer disabled:opacity-50"
                              />
                            </div>
                          </div>

                          {/* Price Drop Reminder */}
                          <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Price Drop Alerts
                                </p>
                                <p className="text-sm text-gray-600">
                                  Get notified when car prices drop
                                </p>
                              </div>
                              <input
                                type="checkbox"
                                checked={preferences.priceDropReminder}
                                onChange={() =>
                                  handleToggle("priceDropReminder")
                                }
                                disabled={!preferences.pushNotification}
                                className="h-5 w-5 rounded border-gray-300 cursor-pointer disabled:opacity-50"
                              />
                            </div>
                          </div>

                          {/* Save Button */}
                          <div className="flex gap-3 pt-4">
                            <Button
                              onClick={handleSavePreferences}
                              disabled={isSaving || saved}
                              className="flex-1 flex items-center justify-center gap-2"
                            >
                              {saved ? (
                                <>
                                  <Check className="h-4 w-4"/>
                                  Saved
                                </>
                              ) : (
                                "Save Preferences"
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50">
                      <Settings className="w-5 h-5 text-gray-400"/>
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={() => router.push("/bookings")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50"
                    >
                      <Car className="w-5 h-5 text-gray-400"/>
                      <span>My Cars</span>
                    </button>

                    <button
                      onClick={() => router.push("/appointments")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50"
                    >
                      <Calendar className="w-5 h-5 text-gray-400"/>
                      <span>Appointments</span>
                    </button>

                    <button
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50 text-red-600">
                      <LogOut className="w-5 h-5"/>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default index;
