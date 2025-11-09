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

    public bool PurchaseNotification { get; set; } = true;

    public bool SaleNotification { get; set; } = true;

    public bool ReferralNotification { get; set; } = true;

    public bool BookingNotification { get; set; } = true;

    public NotificationFrequency Frequency { get; set; } = NotificationFrequency.Instant;
}

public enum NotificationFrequency
{
    Instant,
    Daily,
    Weekly
}