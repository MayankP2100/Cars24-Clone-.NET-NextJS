using MongoDB.Bson.Serialization.Attributes;

namespace Cars24.API.Models;

public class Appointment
{
  [BsonId]
  [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
  public string? Id { get; set; }

  public string? CarId { get; set; }

  public string ScheduledDate { get; set; } = String.Empty;

  public string ScheduledTime { get; set; } = String.Empty;

  public string Location { get; set; } = String.Empty;

  public string AppointmentType { get; set; } = String.Empty;

  public string Status { get; set; } = String.Empty;

  public string Notes { get; set; } = String.Empty;
}