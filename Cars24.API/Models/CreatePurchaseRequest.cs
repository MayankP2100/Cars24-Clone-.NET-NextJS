using System;

namespace Cars24.API.Models
{
    public class CreatePurchaseRequest
    {
        public string UserId { get; set; } = default!;
        public string CarId { get; set; } = default!;
        public string CarTitle { get; set; } = default!;
        public decimal Price { get; set; }
        public string PurchaseType { get; set; } = default!; // "buy" or "sell"
        public string? Status { get; set; } // optional; default used if null
    }
}