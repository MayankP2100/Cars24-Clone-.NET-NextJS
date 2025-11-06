using Cars24.API.Models;
using MongoDB.Driver;

namespace Cars24.API.Services;

public class PricingService
{
    private readonly IMongoCollection<PricingMultiplier> _pricingMultiplierCollection;
    private readonly IMongoCollection<PricingAdjustment> _pricingAdjustmentCollection;

    private static readonly List<string> ValidIndianCities =
    [
        "Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai",
        "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Surat"
    ];

    public PricingService(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("DefaultConnection"));

        var database = client.GetDatabase(config["MongoDB:DatabaseName"]);

        _pricingMultiplierCollection = database.GetCollection<PricingMultiplier>("PricingMultipliers");
        _pricingAdjustmentCollection = database.GetCollection<PricingAdjustment>("PricingAdjustments");
    }

    public string InferVehicleTypeFromTitle(string carTitle)
    {
        var title = carTitle.ToLower();

        if (title.Contains("creta") || title.Contains("xuv") || title.Contains("fortuner") ||
            title.Contains("endeavour") || title.Contains("bolero") || title.Contains("mahindra xl") ||
            title.Contains("safari") || title.Contains("scorpio") || title.Contains("thar") ||
            title.Contains("duster") || title.Contains("seltos") || title.Contains("helix") ||
            title.Contains("nexon") || title.Contains("creta") || title.Contains("brezza") ||
            title.Contains("ertiga") || title.Contains("vitara"))
            return "suv";

        if (title.Contains("fortuner") || title.Contains("endeavour") || title.Contains("gypsy") ||
            title.Contains("bolero") || title.Contains("thar") || title.Contains("mahindra xl"))
            return "offroad";

        if (title.Contains("i10") || title.Contains("i20") || title.Contains("alto") ||
            title.Contains("swift") || title.Contains("wagon") || title.Contains("celerio") ||
            title.Contains("baleno") || title.Contains("polo") || title.Contains("tiago") ||
            title.Contains("punch") || title.Contains("kwid"))
            return "hatchback";

        if (title.Contains("city") || title.Contains("civic") || title.Contains("accord") ||
            title.Contains("altis") || title.Contains("fortuner") || title.Contains("maruti") ||
            title.Contains("dzire") || title.Contains("swift dzire") || title.Contains("ameo") ||
            title.Contains("vento") || title.Contains("aspire") || title.Contains("virtus"))
            return "sedan";

        return "sedan";
    }

    public string NormalizeCity(string city)
    {
        var normalized = city.Trim();
        var matched = ValidIndianCities.FirstOrDefault(c =>
            c.Equals(normalized, StringComparison.OrdinalIgnoreCase));

        return matched ?? "Mumbai";
    }

    public string GetRegionTypeByCity(string city)
    {
        var normalizedCity = NormalizeCity(city);

        return normalizedCity switch
        {
            "Mumbai" => "metro",
            "Delhi" => "metro",
            "Bangalore" => "metro",
            "Kolkata" => "metro",
            "Pune" => "metro",
            "Hyderabad" => "metro",
            "Ahmedabad" => "metro",
            "Jaipur" => "hilly",
            "Chennai" => "coastal",
            "Surat" => "coastal",
            _ => "metro"
        };
    }

    public string GetCurrentSeason()
    {
        var month = DateTime.UtcNow.Month;
        return month switch
        {
            >= 6 and <= 9 => "monsoon",
            >= 10 and <= 11 => "postMonsoon",
            >= 12 or <= 2 => "winter",
            _ => "summer"
        };
    }

    public async Task<PricingMultiplier?> GetPricingMultiplierAsync(string region, string season, string vehicleType)
    {
        return await _pricingMultiplierCollection
            .Find(x => x.Region.Equals(region, StringComparison.CurrentCultureIgnoreCase) &&
                       x.Season.Equals(season, StringComparison.CurrentCultureIgnoreCase) &&
                       x.VehicleType.Equals(vehicleType, StringComparison.CurrentCultureIgnoreCase))
            .FirstOrDefaultAsync();
    }

    public async Task<List<PricingMultiplier>> GetAllMultipliersAsync()
    {
        return await _pricingMultiplierCollection.Find(_ => true).ToListAsync();
    }

    public async Task CreatePricingMultiplierAsync(PricingMultiplier multiplier)
    {
        await _pricingMultiplierCollection.InsertOneAsync(multiplier);
    }

    public async Task UpdatePricingMultiplierAsync(string id, PricingMultiplier multiplier)
    {
        await _pricingMultiplierCollection.ReplaceOneAsync(x => x.Id == id, multiplier);
    }

    public async Task DeletePricingMultiplierAsync(string id)
    {
        await _pricingMultiplierCollection.DeleteOneAsync(x => x.Id == id);
    }

    public decimal CalculateRecommendedPrice(decimal basePrice, string region, string season, string vehicleType)
    {
        var regionMultiplier = GetDefaultRegionMultiplier(region, vehicleType);
        var seasonalMultiplier = GetDefaultSeasonalMultiplier(season, vehicleType);
        var recommendedPrice = basePrice * regionMultiplier * seasonalMultiplier;

        return Math.Round(recommendedPrice, 2);
    }

    private static decimal GetDefaultRegionMultiplier(string region, string vehicleType)
    {
        return (region.ToLower(), vehicleType.ToLower()) switch
        {
            ("metro", "suv") => 1.15m,
            ("metro", "hatchback") => 0.90m,
            ("metro", "sedan") => 1.05m,
            ("metro", _) => 1.0m,

            ("hilly", "suv") => 1.25m,
            ("hilly", "offroad") => 1.30m,
            ("hilly", "hatchback") => 1.10m,
            ("hilly", _) => 1.15m,

            ("rural", "suv") => 1.05m,
            ("rural", "hatchback") => 1.10m,
            ("rural", _) => 1.0m,

            ("coastal", "suv") => 1.10m,
            ("coastal", "sedan") => 1.08m,
            ("coastal", _) => 1.05m,

            _ => 1.0m
        };
    }

    private static decimal GetDefaultSeasonalMultiplier(string season, string vehicleType)
    {
        return (season.ToLower(), vehicleType.ToLower()) switch
        {
            ("monsoon", "suv") => 1.20m,
            ("monsoon", "offroad") => 1.25m,
            ("monsoon", "hatchback") => 0.95m,
            ("monsoon", _) => 1.05m,

            ("postmonsoon", "suv") => 1.10m,
            ("postmonsoon", "offroad") => 1.15m,
            ("postmonsoon", "sedan") => 1.08m,
            ("postmonsoon", _) => 1.05m,

            ("winter", "suv") => 1.05m,
            ("winter", "sedan") => 1.08m,
            ("winter", _) => 1.0m,

            ("summer", "hatchback") => 1.10m,
            ("summer", "suv") => 0.95m,

            _ => 1.0m
        };
    }

    private static decimal GetAgeDepreciationMultiplier(int yearOfManufacture)
    {
        var age = DateTime.UtcNow.Year - yearOfManufacture;

        return age switch
        {
            0 => 1.0m,
            1 => 0.97m,
            2 => 0.94m,
            3 => 0.91m,
            4 => 0.88m,
            5 => 0.85m,
            6 => 0.82m,
            7 => 0.79m,
            8 => 0.76m,
            9 => 0.73m,
            10 => 0.70m,
            _ => 0.65m
        };
    }

    private static decimal GetMileageMultiplier(long mileageKm)
    {
        return mileageKm switch
        {
            <= 50000 => 1.0m,
            <= 100000 => 0.98m,
            <= 150000 => 0.95m,
            <= 200000 => 0.92m,
            <= 250000 => 0.88m,
            <= 300000 => 0.83m,
            _ => 0.75m
        };
    }


    public async Task<PricingAdjustment> CreatePricingAdjustmentAsync(
        string carId, decimal basePrice, string city, string carTitle,
        int yearOfManufacture, long mileageKm)
    {
        var vehicleType = InferVehicleTypeFromTitle(carTitle);
        var region = GetRegionTypeByCity(NormalizeCity(city));
        var season = GetCurrentSeason();
        var regionMultiplier = GetDefaultRegionMultiplier(region, vehicleType);
        var seasonalMultiplier = GetDefaultSeasonalMultiplier(season, vehicleType);

        var marketAdjustedPrice = basePrice * regionMultiplier * seasonalMultiplier;

        var ageMultiplier = GetAgeDepreciationMultiplier(yearOfManufacture);
        var mileageMultiplier = GetMileageMultiplier(mileageKm);

        var recommendedPrice = marketAdjustedPrice * ageMultiplier * mileageMultiplier;
        recommendedPrice = Math.Round(recommendedPrice, 2);

        var priceChange = recommendedPrice - basePrice;
        var percentageChange = (priceChange / basePrice) * 100;

        var adjustment = new PricingAdjustment
        {
            CarId = carId,
            BasePrice = basePrice,
            Region = region,
            Season = season,
            VehicleType = vehicleType,
            RegionMultiplier = regionMultiplier,
            SeasonalMultiplier = seasonalMultiplier,
            RecommendedPrice = recommendedPrice,
            PriceChange = priceChange,
            PercentageChange = Math.Round(percentageChange, 2)
        };

        await _pricingAdjustmentCollection.InsertOneAsync(adjustment);
        return adjustment;
    }


    public async Task<PricingAdjustment?> GetPricingAdjustmentByCarIdAsync(string carId)
    {
        return await _pricingAdjustmentCollection
            .Find(x => x.CarId == carId)
            .FirstOrDefaultAsync();
    }
}