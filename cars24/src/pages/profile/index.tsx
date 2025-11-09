import {useAuth} from "@/context/AuthContext";
import {useReferral} from "@/context/ReferralContext";
import {AlertCircle, Bell, Calendar, Car, Check, LogOut, Mail, Settings, User, Coins, Gift, ShoppingCart,} from "lucide-react";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {BASE_URL} from "@/lib/utils";
import NotificationPreferencesModal from "@/components/NotificationPreferencesModal";

const index = () => {
  const {user} = useAuth();
  const {balancePoints, fetchWalletData} = useReferral();
  const router = useRouter();
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchWalletData(user.id);
    }
  }, [user?.id]);


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
                      <Button
                        onClick={() => setPreferencesModalOpen(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                      >
                        <Bell className="w-4 h-4" />
                        Manage All Notification Preferences
                      </Button>
                      <p className="text-sm text-gray-600 mt-3">
                        Configure push notifications, appointment reminders, price drop alerts, purchase & sale notifications, referral bonuses, booking confirmations, and notification frequency.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  {/* Balance Points Card */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Balance Points</p>
                        <p className="text-2xl font-bold">{balancePoints}</p>
                      </div>
                      <Coins className="w-10 h-10 opacity-20" />
                    </div>
                  </div>

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
                      onClick={() => router.push("/referrals")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Gift className="w-5 h-5"/>
                      <span>Referral Program</span>
                    </button>

                    <button
                      onClick={() => router.push("/purchases")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-green-50 text-green-600 hover:text-green-700 font-medium"
                    >
                      <ShoppingCart className="w-5 h-5"/>
                      <span>My Purchases & Sales</span>
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

      <NotificationPreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
      />
    </div>
  );
};

export default index;
