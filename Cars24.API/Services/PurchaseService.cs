using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Cars24.API.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Cars24.API.Services
{
    public class PurchaseService
    {
        private readonly IMongoCollection<Purchase> _collection;
        private readonly ReferralService _referralService;

        public PurchaseService(IConfiguration config, ReferralService referralService)
        {
            var client = new MongoClient(config.GetConnectionString("DefaultConnection"));
            var db = client.GetDatabase(config["MongoDB:DatabaseName"]);
            _collection = db.GetCollection<Purchase>("Purchases");
            _referralService = referralService;
        }

        public async Task<Purchase> CreateAsync(string userId, string carId, string carTitle, decimal price,
            string purchaseType, string? status = null)
        {
            var finalStatus = string.IsNullOrWhiteSpace(status) ? "completed" : status;
            var purchase = new Purchase
            {
                UserId = userId,
                CarId = carId,
                CarTitle = carTitle,
                PurchasePrice = price,
                PurchaseType = purchaseType,
                Status = finalStatus,
                PurchaseDate = DateTime.UtcNow
            };

            // Check if user already has a completed transaction
            var hasCompleted = await _collection.Find(p => p.UserId == userId && p.Status == "completed").AnyAsync();

            await _collection.InsertOneAsync(purchase);

            // If this is first completed transaction, trigger referral processing
            if (finalStatus == "completed" && !hasCompleted)
            {
                // fire-and-forget is acceptable for demo; await to ensure it's processed
                await _referralService.ProcessFirstTransactionAsync(userId, purchase.Id);
            }

            return purchase;
        }

        public async Task<List<Purchase>> GetByUserAsync(string userId)
        {
            return await _collection.Find(p => p.UserId == userId)
                .SortByDescending(p => p.PurchaseDate)
                .ToListAsync();
        }

        public async Task<Purchase?> GetByIdAsync(string id)
        {
            return await _collection.Find(p => p.Id == id).FirstOrDefaultAsync();
        }
    }
}