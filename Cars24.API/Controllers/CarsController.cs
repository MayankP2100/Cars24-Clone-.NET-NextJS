using Cars24.API.Models;
using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController(CarService carService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCarById(string id)
    {
        var car = await carService.GetCarByIdAsync(id);

        if (car == null) return NotFound();

        return Ok(car);
    }

    [HttpGet]
    public async Task<IActionResult> GetCarSummaries()
    {
        var cars = await carService.GetAllCarsAsync();

        return Ok(cars);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCar([FromBody] Car? car)
    {
        if (car == null)
        {
            return BadRequest("Car data is required.");
        }

        var brand = _avgMaintenanceCost.Keys
            .FirstOrDefault(b => car.Title.Contains(b, StringComparison.CurrentCultureIgnoreCase));

        var baseMaintenanceCost = 0;
        if (brand != null && _avgMaintenanceCost.TryGetValue(brand, out var value))
        {
            baseMaintenanceCost = value;
        }

        var carAge = DateTime.Now.Year - car.Specs.Year;

        var kmString = car.Specs.Km;
        var cleaned = new string(kmString.Where(char.IsDigit).ToArray());
        var kms = int.TryParse(cleaned, out var result) ? result : 0;

        var ageMultiplier = carAge switch
        {
            >= 4 and <= 6 => 1.3,
            >= 7 and <= 10 => 1.6,
            > 10 => 2.0,
            _ => 1.0
        };

        var kmMultiplier = kms switch
        {
            > 40000 and <= 80000 => 1.2,
            > 80000 and <= 120000 => 1.5,
            > 120000 => 1.8,
            _ => 1.0
        };

        var estimatedAnnual = baseMaintenanceCost * ageMultiplier * kmMultiplier;
        var estimatedMonthly = estimatedAnnual / 12.0;

        var tag = estimatedMonthly switch
        {
            <= 4000 => "Low Maintenance Expected",
            <= 8000 => "Moderate Maintenance Expected",
            _ => "High Maintenance Expected",
        };

        car.Tag = tag;
        car.EstimatedMonthlyMaintenanceCost = estimatedMonthly;

        await carService.CreateCarAsync(car);

        return CreatedAtAction(nameof(GetCarById), new { id = car.Id }, car);
    }

    private readonly Dictionary<string, int> _avgMaintenanceCost = new()
    {
        { "Maruti", 6000 },
        { "Suzuki", 6000 },
        { "Tata", 7000 },
        { "Hyundai", 8000 },
        { "Mahindra", 8500 },
        { "Honda", 7500 },
        { "Toyota", 7500 },
        { "Kia", 8500 },
        { "Ford", 9500 },
        { "Skoda", 9500 },
        { "Volkswagen", 10000 },
        { "Nissan", 7000 },
        { "Renault", 7500 },
        { "MG", 9000 },
        { "Jeep", 13000 },
        { "BMW", 116000 },
        { "Mercedes", 109000 },
        { "Mercedes-Benz", 109000 },
        { "Audi", 118000 },
        { "Jaguar", 160000 },
        { "Land Rover", 170000 },
        { "Volvo", 110000 },
        { "Lexus", 80000 },
        { "Mini", 122000 },
        { "Porsche", 170000 },
        { "Tesla", 120000 },
        { "Maserati", 143000 },
        { "Chevrolet", 8500 },
        { "Fiat", 8000 },
        { "Mitsubishi", 10000 },
        { "Subaru", 9000 },
        { "Datsun", 7000 },
        { "Buick", 87300 },
        { "Acura", 71900 },
        { "Cadillac", 112400 },
        { "Infiniti", 91600 },
        { "Mazda", 66300 },
        { "Chrysler", 87300 },
        { "Dodge", 91000 },
        { "Ram", 99200 },
        { "Genesis", 75200 },
        { "Lincoln", 126200 },
    };
}