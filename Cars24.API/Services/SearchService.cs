using System.Text.RegularExpressions;
using Cars24.API.Models;
using static System.String;

namespace Cars24.API.Services;

public class SearchService : ISearchService
{
    private readonly CarService _carService;

    public SearchService(CarService carService)
    {
        _carService = carService;
    }

    private static readonly List<string> BrandList =
    [
        "Maruti", "Suzuki", "Tata", "Hyundai", "Mahindra", "Honda",
        "Toyota", "Kia", "Ford", "Skoda", "Volkswagen", "Nissan", "Renault",
        "MG", "Jeep", "BMW", "Mercedes", "Mercedes-Benz", "Audi", "Jaguar",
        "Land Rover", "Volvo", "Lexus", "Mini", "Porsche", "Tesla", "Maserati",
        "Chevrolet", "Fiat", "Mitsubishi", "Subaru", "Datsun", "Buick", "Acura",
        "Cadillac", "Infiniti", "Mazda", "Chrysler", "Dodge", "Ram", "Genesis", "Lincoln"
    ];

    public async Task<List<string>> SearchListingsAsync(string query, string city)
    {
        var cars = await _carService.GetAllCarsByCityAsync(city);

        var results = new List<CarListingResult>();

        foreach (var car in cars)
        {
            var brand = ExtractBrand(car.Title);
            var model = ExtractModel(car.Title);

            double score = 0;

            if (!IsNullOrEmpty(brand))
            {
                var dist = LevenshteinDistance(query.ToLower(), brand.ToLower());
                score += Math.Max(0, 20 - dist);
            }

            if (!IsNullOrEmpty(model))
            {
                var dist = LevenshteinDistance(query.ToLower(), model.ToLower());
                score += Math.Max(0, 20 - dist);
            }

            if (car.Title.IndexOf(query, StringComparison.OrdinalIgnoreCase) >= 0)
                score += 5;

            if (!IsNullOrEmpty(city) && car.Location.Equals(city, StringComparison.OrdinalIgnoreCase))
                score += 3;

            const int minScore = 20;
            
            if (score > minScore)
            {
                results.Add(new CarListingResult
                {
                    Id = car.Id!,
                    Title = car.Title,
                    Brand = brand,
                    Model = model,
                    Location = car.Location,
                    Score = score
                });
            }
            Console.WriteLine($"TITLE='{car.Title}' BRAND='{brand}' MODEL='{model}' QUERY='{query}' SCORE={score}");
            
        }
        

        var carsWithBestScores = results.OrderByDescending(r => r.Score).ToList();
        return carsWithBestScores.Select(c => c.Id).ToList();
    }

    public async Task<List<string>> GetSuggestionsAsync(string query)
    {
        var cars = await _carService.GetAllCarsByCityAsync("All");

        var brands = cars.Select(car => ExtractBrand(car.Title))
            .Where(b => !IsNullOrEmpty(b))
            .Distinct()
            .ToList();

        var models = cars.Select(car => ExtractModel(car.Title))
            .Where(m => !IsNullOrEmpty(m))
            .Distinct()
            .ToList();

        var suggestions = brands.Concat(models).Distinct();

        var matched = suggestions
            .Where(s => s.IndexOf(query, StringComparison.OrdinalIgnoreCase) >= 0)
            .Take(10)
            .ToList();

        return matched;
    }

    public static string ExtractBrand(string title)
    {
        foreach (var brand in BrandList)
        {
            if (!IsNullOrWhiteSpace(brand) && title.IndexOf(brand, StringComparison.OrdinalIgnoreCase) >= 0)
            {
                return brand;
            }
        }

        return Empty;
    }

    private string ExtractModel(string title)
    {
        var parts = title.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var idx = 0;

        if (int.TryParse(parts[0], out _)) idx = 1;

        for (; idx < parts.Length; idx++)
        {
            if (BrandList.Any(b => string.Equals(b, parts[idx], StringComparison.OrdinalIgnoreCase)))
            {
                idx++;
                break;
            }
        }

        var modelParts = new List<string>();
        for (; idx < parts.Length; idx++)
        {
            if (Regex.IsMatch(parts[idx], @"^\d{2,4}$")) break;
            modelParts.Add(parts[idx]);
        }

        return string.Join(" ", modelParts).Trim();
    }

    private int LevenshteinDistance(string a, string b)
    {
        if (IsNullOrEmpty(a)) return b.Length;
        if (IsNullOrEmpty(b)) return a.Length;

        var costs = new int[b.Length + 1];
        for (var j = 0; j < costs.Length; j++)
            costs[j] = j;

        for (var i = 1; i <= a.Length; i++)
        {
            costs[0] = i;
            var prevCost = i - 1;
            for (var j = 1; j <= b.Length; j++)
            {
                var curCost = costs[j];
                var add = a[i - 1] == b[j - 1] ? 0 : 1;
                costs[j] = Math.Min(Math.Min(costs[j] + 1, costs[j - 1] + 1), prevCost + add);
                prevCost = curCost;
            }
        }

        return costs[b.Length];
    }
}