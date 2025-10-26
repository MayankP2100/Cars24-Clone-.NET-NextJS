using MongoDB.Bson.Serialization.Attributes;

namespace Cars24.API.Models;

public class Booking
{
  [BsonId]
  [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
  public string? Id { get; set; }
  public string CarId { get; set; } = null!;
  public string Name { get; set; } = string.Empty;
  public string Phone { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string Address { get; set; } = string.Empty;
  public string PreferredDate { get; set; } = string.Empty;
  public string PreferredTime { get; set; } = string.Empty;
  public string PaymentMethod { get; set; } = string.Empty;
  public string LoanRequired { get; set; } = string.Empty;
  public string DownPayment { get; set; } = string.Empty;
}