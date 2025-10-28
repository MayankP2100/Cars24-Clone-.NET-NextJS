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
    public async Task<IActionResult> GetCarSummaries([FromQuery] string city = "All")
    {
        var cars = await carService.GetAllCarsByCityAsync(city);

        return Ok(cars);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCar([FromBody] Car? car)
    {
        if (car == null)
        {
            return BadRequest("Car data is required.");
        }

        var brand = _brandSpecs.Keys
            .FirstOrDefault(b => car.Title.Contains(b, StringComparison.CurrentCultureIgnoreCase));

        var spec = brand != null && _brandSpecs.TryGetValue(brand, out var foundSpec)
            ? foundSpec
            : new BrandMaintenanceSpec
            {
                MaintenanceCost = 0, ServiceIntervalKm = 10000, TireReplacementKm = 40000, BatteryReplacementYears = 4
            };

        var baseMaintenanceCost = spec.MaintenanceCost;

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

        var nextServiceKm = ((kms / spec.ServiceIntervalKm) + 1) * spec.ServiceIntervalKm;
        car.MaintenanceInsights.ServiceInsight = $"Next major service due in {nextServiceKm - kms:n0} km";

        car.MaintenanceInsights.TireInsight = kms >= spec.TireReplacementKm
            ? "Tire replacement recommended soon"
            : $"Tire replacement likely after {spec.TireReplacementKm - kms:n0} km";

        car.MaintenanceInsights.BatteryInsight = carAge >= spec.BatteryReplacementYears
            ? "Check battery health - possible replacement needed soon"
            : $"Battery typically replaced after {spec.BatteryReplacementYears - carAge} years";

        car.Tag = tag;
        car.MaintenanceInsights.MonthlyMaintenanceCost = (int)estimatedMonthly;

        await carService.CreateCarAsync(car);

        return CreatedAtAction(nameof(GetCarById), new { id = car.Id }, car);
    }

    private class BrandMaintenanceSpec
    {
        public int MaintenanceCost { get; set; }
        public int ServiceIntervalKm { get; set; }
        public int TireReplacementKm { get; set; }
        public int BatteryReplacementYears { get; set; }
    }

    private readonly Dictionary<string, BrandMaintenanceSpec> _brandSpecs = new()
    {
        {
            "Maruti",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 6000, ServiceIntervalKm = 10000, TireReplacementKm = 45000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Suzuki",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 6000, ServiceIntervalKm = 10000, TireReplacementKm = 45000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Tata",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 7000, ServiceIntervalKm = 10000, TireReplacementKm = 45000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Hyundai",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 8000, ServiceIntervalKm = 10000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Mahindra",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 8500, ServiceIntervalKm = 10000, TireReplacementKm = 45000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Honda",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 7500, ServiceIntervalKm = 10000, TireReplacementKm = 45000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Toyota",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 7500, ServiceIntervalKm = 10000, TireReplacementKm = 50000,
                BatteryReplacementYears = 5
            }
        },
        {
            "Kia",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 8500, ServiceIntervalKm = 10000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Ford",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 9500, ServiceIntervalKm = 15000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Skoda",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 9500, ServiceIntervalKm = 15000, TireReplacementKm = 50000,
                BatteryReplacementYears = 5
            }
        },
        {
            "Volkswagen",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 10000, ServiceIntervalKm = 15000, TireReplacementKm = 50000,
                BatteryReplacementYears = 5
            }
        },
        {
            "Nissan",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 7000, ServiceIntervalKm = 10000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Renault",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 7500, ServiceIntervalKm = 10000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "MG",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 9000, ServiceIntervalKm = 10000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Jeep",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 13000, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 4
            }
        },
        {
            "BMW",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 116000, ServiceIntervalKm = 15000, TireReplacementKm = 40000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Mercedes",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 109000, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Mercedes-Benz",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 109000, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Audi",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 118000, ServiceIntervalKm = 15000, TireReplacementKm = 40000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Jaguar",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 160000, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Land Rover",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 170000, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Volvo",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 110000, ServiceIntervalKm = 15000, TireReplacementKm = 40000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Lexus",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 80000, ServiceIntervalKm = 15000, TireReplacementKm = 45000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Mini",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 122000, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Porsche",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 170000, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Tesla",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 120000, ServiceIntervalKm = 15000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Maserati",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 143000, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Chevrolet",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 8500, ServiceIntervalKm = 15000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Fiat",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 8000, ServiceIntervalKm = 10000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Mitsubishi",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 10000, ServiceIntervalKm = 15000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Subaru",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 9000, ServiceIntervalKm = 15000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Datsun",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 7000, ServiceIntervalKm = 10000, TireReplacementKm = 40000,
                BatteryReplacementYears = 4
            }
        },
        {
            "Buick",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 87300, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Acura",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 71900, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Cadillac",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 112400, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Infiniti",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 91600, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Mazda",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 66300, ServiceIntervalKm = 15000, TireReplacementKm = 40000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Chrysler",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 87300, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Dodge",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 91000, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Ram",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 99200, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Genesis",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 75200, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
        {
            "Lincoln",
            new BrandMaintenanceSpec
            {
                MaintenanceCost = 126200, ServiceIntervalKm = 15000, TireReplacementKm = 35000,
                BatteryReplacementYears = 3
            }
        },
    };
}