namespace Cars24.API.Models;

public class ApplyPointsResponse
{
    public decimal FinalPrice { get; set; }
    public long PointsUsed { get; set; }
    public long RemainingBalance { get; set; }
}