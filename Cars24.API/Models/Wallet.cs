using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24.API.Models;

public class Wallet
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public long BalancePoints { get; set; }
}