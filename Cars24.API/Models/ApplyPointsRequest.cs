namespace Cars24.API.Models;

public class ApplyPointsRequest
{
    public required string UserId { get; set; }
    public required decimal Price { get; set; }
    public long? MaxPointsToUse { get; set; }
}