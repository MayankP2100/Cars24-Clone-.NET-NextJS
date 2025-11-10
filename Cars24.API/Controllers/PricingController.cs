using Cars24.API.Models;
using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PricingController(PricingService pricingService, PointsService pointsService) : ControllerBase
{
    [HttpGet("multipliers")]
    public async Task<IActionResult> GetAllMultipliers()
    {
        var multipliers = await pricingService.GetAllMultipliersAsync();
        return Ok(multipliers);
    }

    [HttpGet("multiplier")]
    public async Task<IActionResult> GetPricingMultiplier([FromQuery] string region, [FromQuery] string season,
        [FromQuery] string vehicleType)
    {
        var multiplier = await pricingService.GetPricingMultiplierAsync(region, season, vehicleType);
        if (multiplier == null)
            return NotFound(new { message = "Pricing multiplier not found" });

        return Ok(multiplier);
    }

    [HttpPost("multiplier")]
    public async Task<IActionResult> CreatePricingMultiplier([FromBody] PricingMultiplier multiplier)
    {
        await pricingService.CreatePricingMultiplierAsync(multiplier);
        return CreatedAtAction(nameof(GetPricingMultiplier), multiplier);
    }

    [HttpPut("multiplier/{id}")]
    public async Task<IActionResult> UpdatePricingMultiplier(string id, [FromBody] PricingMultiplier multiplier)
    {
        await pricingService.UpdatePricingMultiplierAsync(id, multiplier);
        return Ok(multiplier);
    }

    [HttpDelete("multiplier/{id}")]
    public async Task<IActionResult> DeletePricingMultiplier(string id)
    {
        await pricingService.DeletePricingMultiplierAsync(id);
        return NoContent();
    }

    [HttpPost("adjustment/{carId}")]
    public async Task<IActionResult> CreatePricingAdjustment(string carId,
        [FromBody] CreatePricingAdjustmentRequest request)
    {
        var adjustment =
            await pricingService.CreatePricingAdjustmentAsync(carId, request.BasePrice, request.City, request.CarTitle,
                request.YearOfManufacture, request.MileageKm);
        return CreatedAtAction(nameof(GetPricingAdjustment), new { carId }, adjustment);
    }

    [HttpGet("adjustment/{carId}")]
    public async Task<IActionResult> GetPricingAdjustment(string carId)
    {
        var adjustment = await pricingService.GetPricingAdjustmentByCarIdAsync(carId);
        if (adjustment == null)
            return NotFound(new { message = "Pricing adjustment not found" });

        return Ok(adjustment);
    }

    [HttpPost("calculate")]
    public async Task<IActionResult> CalculatePrice([FromBody] CalculatePriceRequest request)
    {
        var vehicleType = pricingService.InferVehicleTypeFromTitle(request.CarTitle);
        var region = pricingService.GetRegionTypeByCity(pricingService.NormalizeCity(request.City));
        var season = pricingService.GetCurrentSeason();
        var recommendedPrice = pricingService.CalculateRecommendedPrice(request.BasePrice, region, season, vehicleType);

        return Ok(new
        {
            basePrice = request.BasePrice,
            city = request.City,
            region = region,
            season = season,
            vehicleType = vehicleType,
            recommendedPrice = recommendedPrice,
            priceChange = recommendedPrice - request.BasePrice,
            percentageChange = Math.Round(((recommendedPrice - request.BasePrice) / request.BasePrice) * 100, 2)
        });
    }

    [HttpPost("calculate-with-points")]
    public async Task<IActionResult> CalculatePriceWithPoints([FromBody] CalculatePriceWithPointsRequest request)
    {
        var vehicleType = pricingService.InferVehicleTypeFromTitle(request.CarTitle);
        var region = pricingService.GetRegionTypeByCity(pricingService.NormalizeCity(request.City));
        var season = pricingService.GetCurrentSeason();
        var recommendedPrice = pricingService.CalculateRecommendedPrice(request.BasePrice, region, season, vehicleType);

        var (finalPrice, pointsUsed) = await pointsService.ApplyPointsToPriceAsync(request.UserId, recommendedPrice,
            request.MaxPointsToUse ?? long.MaxValue);
        var remainingBalance = await pointsService.GetBalanceAsync(request.UserId);

        return Ok(new
        {
            basePrice = request.BasePrice,
            recommendedPrice = recommendedPrice,
            finalPrice = finalPrice,
            pointsUsed = pointsUsed,
            remainingBalance = remainingBalance,
            savings = recommendedPrice - finalPrice
        });
    }
}

public class CreatePricingAdjustmentRequest
{
    public required decimal BasePrice { get; set; }
    public required string City { get; set; }
    public required string CarTitle { get; set; }
    public required int YearOfManufacture { get; set; }
    public required long MileageKm { get; set; }
}

public class CalculatePriceRequest
{
    public required decimal BasePrice { get; set; }
    public required string City { get; set; }
    public required string CarTitle { get; set; }
}

public class CalculatePriceWithPointsRequest
{
    public required string UserId { get; set; }
    public required decimal BasePrice { get; set; }
    public required string City { get; set; }
    public required string CarTitle { get; set; }
    public long? MaxPointsToUse { get; set; }
}