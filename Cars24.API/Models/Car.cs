using MongoDB.Bson.Serialization.Attributes;

public class Specs
{
  public int Year { get; set; }

  public string Km { get; set; } = String.Empty;

  public string Fuel { get; set; } = String.Empty;

  public string Transmission { get; set; } = String.Empty;

  public string Owner { get; set; } = String.Empty;

  public string Insurance { get; set; } = String.Empty;
}

public class Car
{
  [BsonId]
  [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
  public string? Id { get; set; }

  public List<string> Images { get; set; } = new List<string>();

  public string Title { get; set; } = String.Empty;

  public string Price { get; set; } = String.Empty;

  public string Emi { get; set; } = String.Empty;

  public string Location { get; set; } = String.Empty;

  public Specs Specs { get; set; } = new Specs();

  public List<string> Features { get; set; } = new List<string>();

  public List<string> Highlights { get; set; } = new List<string>();
}