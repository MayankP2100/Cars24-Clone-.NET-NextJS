import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingCart,
  Trash2,
  AlertCircle,
  Loader,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react";
import * as api from "@/lib/purchaseapi";
import PurchaseForm from "@/components/PurchaseForm";

interface Purchase {
  id: string;
  userId: string;
  carId: string;
  carTitle: string;
  purchasePrice: number;
  purchaseType: "buy" | "sell";
  purchaseDate: string;
  status: "completed" | "pending" | "cancelled";
}

const Purchases = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPurchases();
    }
  }, [user?.id]);

  const fetchPurchases = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await api.getUserPurchases(user.id);
      setPurchases(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch purchases";
      setError(errorMessage);
      console.error("Error fetching purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSuccess = (purchaseId: string) => {
    setShowForm(false);
    fetchPurchases();
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Please log in to view your purchases.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ShoppingCart className="text-blue-600" />
          My Purchases & Sales
        </h1>
        <p className="text-gray-600">
          Track all your vehicle purchases and sales
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Add Purchase Button */}
      <div className="mb-8">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {showForm ? "Cancel" : "+ Record New Transaction"}
        </Button>
      </div>

      {/* Purchase Form */}
      {showForm && (
        <div className="mb-8">
          <PurchaseForm onSuccess={handlePurchaseSuccess} />
        </div>
      )}

      {/* Purchases List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Transaction History ({purchases.length})
        </h2>

        {loading && (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        )}

        {!loading && purchases.length === 0 && (
          <Card className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              No purchases or sales recorded yet.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Record Your First Transaction
            </Button>
          </Card>
        )}

        {!loading && purchases.length > 0 && (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card
                key={purchase.id}
                className={`p-6 border-2 ${
                  purchase.purchaseType === "buy"
                    ? "border-green-200 bg-green-50"
                    : "border-orange-200 bg-orange-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {purchase.purchaseType === "buy" ? (
                        <ShoppingCart className="h-5 w-5 text-green-600" />
                      ) : (
                        <Trash2 className="h-5 w-5 text-orange-600" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {purchase.purchaseType === "buy" ? "Purchase" : "Sale"} -{" "}
                        {purchase.carTitle}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          purchase.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : purchase.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Car ID</p>
                        <p className="font-mono text-sm font-semibold text-gray-900">
                          {purchase.carId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Price
                        </p>
                        <p className="font-bold text-lg text-gray-900">
                          ${purchase.purchasePrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Date
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          Transaction ID
                        </p>
                        <p className="font-mono text-xs font-semibold text-gray-600">
                          {purchase.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 How It Works</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Record any vehicle purchase or sale you make</li>
          <li>• Your first transaction will automatically award referral bonuses</li>
          <li>• If you were referred, both you and your referrer get points!</li>
          <li>• Use these points to get discounts on future transactions</li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default Purchases;

