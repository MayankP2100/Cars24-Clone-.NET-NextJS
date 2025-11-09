using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24.API.Models
{
    public class Purchase
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string UserId { get; set; } = default!;
        public string CarId { get; set; } = default!;
        public string CarTitle { get; set; } = default!;
        public decimal PurchasePrice { get; set; }
        public string PurchaseType { get; set; } = default!; // "buy" | "sell"
        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "completed"; // "completed" | "pending" | "cancelled"
    }
}