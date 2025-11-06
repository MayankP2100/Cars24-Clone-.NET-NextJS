using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24.API.Models;

public class PricingMultiplier
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public required string Region { get; set; }
    
    public required string Season { get; set; }
    
    public required string VehicleType { get; set; }
    
    public decimal Multiplier { get; set; }
    
    public string? Description { get; set; }
}