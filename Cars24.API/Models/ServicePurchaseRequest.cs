namespace Cars24.API.Models;

public class ServicePurchaseRequest
{
    public required string UserId { get; set; }
    public required string ServiceId { get; set; }
}