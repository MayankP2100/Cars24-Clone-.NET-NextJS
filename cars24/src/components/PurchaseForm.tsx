import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check, Loader, ShoppingCart, Trash2 } from "lucide-react";
import * as api from "@/lib/purchaseapi";
import * as referralApi from "@/lib/referralapi";

interface PurchaseFormProps {
  onSuccess?: (purchaseId: string) => void;
  defaultCarId?: string;
  defaultCarTitle?: string;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({
  onSuccess,
  defaultCarId,
  defaultCarTitle,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    carId: defaultCarId || "",
    carTitle: defaultCarTitle || "",
    price: "",
    purchaseType: "buy" as "buy" | "sell",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPurchaseId(null);

    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    if (!formData.carId.trim() || !formData.carTitle.trim() || !formData.price) {
      setError("Please fill in all fields");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create purchase record
      const purchase = await api.createPurchase(
        user.id,
        formData.carId,
        formData.carTitle,
        price,
        formData.purchaseType
      );

      setPurchaseId(purchase.id);

      // Step 2: Check if this is first transaction and trigger referral bonus
      try {
        await referralApi.processFirstTransaction(user.id, purchase.id);
        console.log("First transaction processed - referral bonuses awarded");
      } catch (referralError) {
        console.log("Note: User may not have a referral", referralError);
        // Not a fatal error - user just doesn't have a referral
      }

      setSuccess(
        `${formData.purchaseType === "buy" ? "Purchase" : "Sale"} recorded successfully!`
      );
      setFormData({
        carId: "",
        carTitle: "",
        price: "",
        purchaseType: "buy",
      });

      if (onSuccess) {
        onSuccess(purchase.id);
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create purchase";
      setError(errorMessage);
      console.error("Purchase creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <ShoppingCart className="text-blue-600" />
          {formData.purchaseType === "buy" ? "Record Purchase" : "Record Sale"}
        </h2>
        <p className="text-gray-600">
          Record a {formData.purchaseType === "buy" ? "purchase" : "sale"} to earn referral bonuses
        </p>
      </div>

      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✓ {success}
            {purchaseId && (
              <div className="mt-2 text-xs font-mono">
                Transaction ID: {purchaseId}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Purchase Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, purchaseType: "buy" }))
              }
              className={`py-2 px-4 rounded-lg font-medium transition ${
                formData.purchaseType === "buy"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ShoppingCart className="inline mr-2 h-4 w-4" />
              Buy
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, purchaseType: "sell" }))
              }
              className={`py-2 px-4 rounded-lg font-medium transition ${
                formData.purchaseType === "sell"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Trash2 className="inline mr-2 h-4 w-4" />
              Sell
            </button>
          </div>
        </div>

        {/* Car ID */}
        <div>
          <label htmlFor="carId" className="block text-sm font-medium text-gray-700 mb-2">
            Car ID
          </label>
          <input
            type="text"
            id="carId"
            name="carId"
            value={formData.carId}
            onChange={handleChange}
            placeholder="e.g., CAR123456"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Car Title */}
        <div>
          <label htmlFor="carTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Car Title/Model
          </label>
          <input
            type="text"
            id="carTitle"
            name="carTitle"
            value={formData.carTitle}
            onChange={handleChange}
            placeholder="e.g., 2022 Toyota Camry"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Recording...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Record {formData.purchaseType === "buy" ? "Purchase" : "Sale"}
            </>
          )}
        </Button>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Recording your first{" "}
          {formData.purchaseType === "buy" ? "purchase" : "sale"} will automatically award referral
          bonuses if you have an active referral code.
        </p>
      </div>
    </Card>
  );
};

export default PurchaseForm;

