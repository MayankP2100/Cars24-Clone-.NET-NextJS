using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24.API.Models;

public class PricingAdjustment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public required string CarId { get; set; }

    public decimal BasePrice { get; set; }

    public required string Region { get; set; }

    public required string Season { get; set; }

    public required string VehicleType { get; set; }

    public decimal RegionMultiplier { get; set; }

    public decimal SeasonalMultiplier { get; set; }

    public decimal RecommendedPrice { get; set; }

    public decimal PriceChange { get; set; }

    public decimal PercentageChange { get; set; }
}