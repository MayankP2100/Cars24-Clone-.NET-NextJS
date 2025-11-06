using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24.API.Models;

public class NotificationPreference
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    public required string UserId { get; set; }

    public bool PushNotifications { get; set; } = true;
    
    public bool AppointmentReminder { get; set; } = true;
    
    public bool PriceDropReminder { get; set; } = true;
}