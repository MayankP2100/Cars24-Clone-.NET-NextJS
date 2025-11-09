using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24.API.Models;

public class Referral
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string Code { get; set; } = string.Empty;

    public string ReferrerUserId { get; set; } = string.Empty;

    public string? ReferredUserId { get; set; }

    public bool IsRedeemed { get; set; }
}