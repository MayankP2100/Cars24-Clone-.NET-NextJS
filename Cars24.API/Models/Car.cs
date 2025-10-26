using MongoDB.Bson.Serialization.Attributes;
using static System.String;

namespace Cars24.API.Models;

public class Specs
{
    public int Year { get; set; }

    public string Km { get; set; } = Empty;

    public string Fuel { get; set; } = Empty;

    public string Transmission { get; set; } = Empty;

    public string Owner { get; set; } = Empty;

    public string Insurance { get; set; } = Empty;
}

public class Car
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string? Id { get; set; }

    public List<string> Images { get; set; } = [];

    public string Title { get; set; } = Empty;

    public string Price { get; set; } = Empty;

    public string Emi { get; set; } = Empty;

    public string Location { get; set; } = Empty;

    public Specs Specs { get; set; } = new Specs();

    public List<string> Features { get; set; } = [];

    public List<string> Highlights { get; set; } = [];

    public string Tag { get; set; } = Empty;

    public double EstimatedMonthlyMaintenanceCost { get; set; } = 0;
}