namespace Cars24.API.Models;

public class ServicePurchaseResponse
{
    public string ServiceId { get; set; }
    public long PointsSpent { get; set; }
    public long RemainingBalance { get; set; }
}