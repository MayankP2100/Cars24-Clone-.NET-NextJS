using Cars24.API.Models;
using MongoDB.Driver;

namespace Cars24.API.Services;

public class ReferralService
{
    private readonly IMongoCollection<Referral> _referrals;
    private readonly WalletService _walletService;

    private const long ReferredUserPoints = 50;
    private const long ReferrerPoints = 100;

    public ReferralService(IConfiguration config, WalletService walletService)
    {
        var client = new MongoClient(config.GetConnectionString("DefaultConnection"));
        var db = client.GetDatabase(config["MongoDB:DatabaseName"]);

        _referrals = db.GetCollection<Referral>("Referrals");
        _walletService = walletService;
    }

    public async Task<string> CreateReferralCodeAsync(string referrerUserId)
    {
        var code = $"R-{Guid.NewGuid().ToString()[..8].ToUpperInvariant()}";

        var referral = new Referral
        {
            Code = code,
            ReferrerUserId = referrerUserId
        };

        await _referrals.InsertOneAsync(referral);
        return code;
    }

    public async Task<bool> ClaimReferralAsync(string code, string referredUserId)
    {
        var filter = Builders<Referral>.Filter.And(
            Builders<Referral>.Filter.Eq(r => r.Code, code),
            Builders<Referral>.Filter.Eq(r => r.ReferredUserId, null)
        );
        
        var update = Builders<Referral>.Update
            .Set(r => r.ReferredUserId, referredUserId);
        
        var result = await _referrals.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task ProcessFirstTransactionAsync(string referredUserId, string referenceId)
    {
        var referral = await _referrals.Find(r => r.ReferredUserId == referredUserId && !r.IsRedeemed)
            .FirstOrDefaultAsync();
        if (referral == null) return;

        await _walletService.AddPointsAsync(referredUserId, ReferredUserPoints, "referral_reward", referral.Id,
            "Reward for first purchase after referral");
        await _walletService.AddPointsAsync(referral.ReferrerUserId, ReferrerPoints, "referral_reward", referral.Id,
            $"Referral reward for referring {referredUserId}");

        var update = Builders<Referral>.Update
            .Set(r => r.IsRedeemed, true);

        await _referrals.UpdateOneAsync(r => r.Id == referral.Id, update);
    }

    public async Task<Referral?> GetByCodeAsync(string code)
    {
        return await _referrals.Find(r => r.Code == code).FirstOrDefaultAsync();
    }
}