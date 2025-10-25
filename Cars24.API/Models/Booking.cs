using System.Reflection.Metadata;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24API.Models;

public class Booking
{
  [BsonId]
  [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
  public string? Id { get; set; }

  public string CarId { get; set; } = null!;

  public decimal BookingAmount { get; set; }

  public bool IsRefunded { get; set; }

  public string BookingStatus { get; set; } = string.Empty;

  public string DeliveryStatus { get; set; } = string.Empty;

  public DateTime? DeliveryDate { get; set; }

  public string Location { get; set; } = string.Empty;

  public Document Documents { get; set; } = new Document();

  public DateTime? NextServiceDate { get; set; }

  public string Warranty { get; set; } = string.Empty;

  public Specs Specs { get; set; } = new Specs();

  public DateTime BookedAt { get; set; } = DateTime.UtcNow;
}