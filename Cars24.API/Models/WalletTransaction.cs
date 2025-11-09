using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using static System.String;

namespace Cars24.API.Models;

public class WalletTransaction
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string WalletId { get; set; } = Empty;
    
    public string UserId { get; set; } = Empty;
    
    public long Change { get; set; }
    
    public string Type { get; set; } = Empty;
    
    public string? ReferenceId { get; set; }
    
    public string? Description { get; set; }
}