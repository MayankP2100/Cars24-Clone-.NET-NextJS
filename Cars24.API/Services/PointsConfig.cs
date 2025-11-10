namespace Cars24.API.Services;

public static class PointsConfig
{
    public const decimal CurrencyPerPoint = 10m;
    
    public const decimal MaxPointsCoverFraction = 0.5m;

    public const long MinPointsToApply = 5;

    public const long MaxPointsPerPurchase = 1000;
}