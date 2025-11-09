using Cars24.API.Models;
using MongoDB.Driver;

namespace Cars24.API.Services;

public class WalletService
{
    public readonly IMongoCollection<Wallet> _wallets;
    private readonly IMongoCollection<WalletTransaction> _transactions;

    public WalletService(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("DefaultConnection"));
        var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        _wallets = database.GetCollection<Wallet>("Wallets");
        _transactions = database.GetCollection<WalletTransaction>("WalletTransactions");
    }

    public async Task<Wallet> GetOrCreateWalletAsync(string userId)
    {
        var wallet = await _wallets.Find(w => w.UserId == userId).FirstOrDefaultAsync();
        if (wallet != null) return wallet;

        wallet = new Wallet { UserId = userId, BalancePoints = 0 };
        await _wallets.InsertOneAsync(wallet);
        return wallet;
    }

    public async Task AddPointsAsync(string userId, long points, string type, string? referenceId = null,
        string? description = null)
    {
        var wallet = await GetOrCreateWalletAsync(userId);

        var update = Builders<Wallet>.Update
            .Inc(w => w.BalancePoints, points);

        await _wallets.UpdateOneAsync(w => w.Id == wallet.Id, update);

        var transaction = new WalletTransaction
        {
            WalletId = wallet.Id,
            UserId = userId,
            Change = points,
            Type = type,
            ReferenceId = referenceId,
            Description = description
        };

        await _transactions.InsertOneAsync(transaction);
    }

    public async Task<bool> RedeemPointsAsync(string userId, long points, string referenceId,
        string? description = null)
    {
        if (points <= 0) return false;

        var wallet = await GetOrCreateWalletAsync(userId);

        var filter = Builders<Wallet>.Filter.And(
            Builders<Wallet>.Filter.Eq(w => w.Id, wallet.Id),
            Builders<Wallet>.Filter.Gte(w => w.BalancePoints, points)
        );

        var update = Builders<Wallet>.Update
            .Inc(w => w.BalancePoints, -points);

        var result = await _wallets.UpdateOneAsync(filter, update);
        if (result.ModifiedCount == 0) return false;

        var transaction = new WalletTransaction
        {
            WalletId = wallet.Id,
            UserId = userId,
            Change = -points,
            Type = "redeem",
            ReferenceId = referenceId,
            Description = description
        };
        await _transactions.InsertOneAsync(transaction);
        return true;
    }

    public async Task<Wallet> GetWalletAsync(string userId)
    {
        return await GetOrCreateWalletAsync(userId);
    }
}