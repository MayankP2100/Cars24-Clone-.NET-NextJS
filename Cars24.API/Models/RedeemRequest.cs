namespace Cars24.API.Models;

public class RedeemRequest
{
    public required string UserId { get; set; }
    public required long PointsToRedeem { get; set; }
}