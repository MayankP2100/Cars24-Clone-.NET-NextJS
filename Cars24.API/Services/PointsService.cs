namespace Cars24.API.Services;

public class PointsService
{
    private readonly WalletService _walletService;

    public PointsService(WalletService walletService)
    {
        _walletService = walletService;
    }

    public async Task<long> GetBalanceAsync(string userId)
    {
        var wallet = await _walletService.GetWalletAsync(userId);
        return wallet.BalancePoints;
    }

    public async Task EarnPointsForPurchaseAsync(string userId, decimal purchaseAmount, string relatedPurchaseId)
    {
        var points = (long)Math.Floor(purchaseAmount / PointsConfig.CurrencyPerPoint);
        if (points <= 0) return;

        await _walletService.AddPointsAsync(userId, points, "earn", relatedPurchaseId, "Earned points for purchase");
    }

    public async Task<(decimal finalPrice, long pointsUsed)> ApplyPointsToPriceAsync(string userId, decimal price,
        long maxAllowedPoints = long.MaxValue)
    {
        var balance = await GetBalanceAsync(userId);

        var maxCoverValue = price * PointsConfig.MaxPointsCoverFraction;
        var maxCoverPoints = (long)Math.Floor(maxCoverValue / PointsConfig.CurrencyPerPoint);

        var usablePoints = Math.Min(balance, Math.Min(maxCoverPoints, maxAllowedPoints));
        if (usablePoints <= 0) return (price, 0);

        var discount = usablePoints * PointsConfig.CurrencyPerPoint;
        var final = price - discount;
        if (final < 0) final = 0;

        await _walletService.RedeemPointsAsync(userId, usablePoints, "", $"Spent {usablePoints} points for discount");

        return (final, usablePoints);
    }

    public async Task RedeemPointsToWalletAsync(string userId, long pointsToRedeem)
    {
        var balance = await GetBalanceAsync(userId);
        if (pointsToRedeem <= 0 || pointsToRedeem > balance)
            throw new InvalidOperationException("Insufficient points");

        await _walletService.RedeemPointsAsync(userId, pointsToRedeem, "", "Redeemed points to wallet");
    }
}