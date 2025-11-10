using System.Collections.Generic;

namespace Cars24.API.Services;

public static class ServicePointCosts
{
    public const string VehicleInspection = "vehicle_inspection";
    public const string PriorityListing = "priority_listing";
    public const string FeaturedBanner = "featured_banner";
    public const string ExtendedWarrantyDemo = "extended_warranty_demo";
    public const string SellerBoost = "seller_boost";

    private static readonly Dictionary<string, long> _points = new()
    {
        [VehicleInspection] = 20,
        [PriorityListing] = 50,
        [FeaturedBanner] = 100,
        [ExtendedWarrantyDemo] = 150,
        [SellerBoost] = 75
    };

    public static long GetPointsCost(string serviceId)
        => _points.TryGetValue(serviceId, out var p) ? p : 0;

    public static decimal GetCurrencyCost(string serviceId)
        => GetPointsCost(serviceId) * PointsConfig.CurrencyPerPoint;
}