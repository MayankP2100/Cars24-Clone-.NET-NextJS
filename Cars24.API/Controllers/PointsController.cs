using Cars24.API.Models;
using Microsoft.AspNetCore.Mvc;
using Cars24.API.Services;

namespace Cars24.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PointsController : ControllerBase
{
    private readonly PointsService _pointsService;

    public PointsController(PointsService pointsService)
    {
        _pointsService = pointsService;
    }

    [HttpGet("balance/{userId}")]
    public async Task<ActionResult<long>> GetBalance(string userId)
    {
        var balance = await _pointsService.GetBalanceAsync(userId);
        return Ok(balance);
    }

    [HttpPost("apply")]
    public async Task<ActionResult<ApplyPointsResponse>> ApplyPoints([FromBody] ApplyPointsRequest req)
    {
        var available = await _pointsService.GetBalanceAsync(req.UserId);
        if (available < PointsConfig.MinPointsToApply)
            return Ok(new ApplyPointsResponse { FinalPrice = req.Price, PointsUsed = 0, RemainingBalance = available });

        var maxAllowed = Math.Min(available, PointsConfig.MaxPointsPerPurchase);
        if (req.MaxPointsToUse.HasValue) maxAllowed = Math.Min(maxAllowed, (long)req.MaxPointsToUse.Value);

        var (final, used) = await _pointsService.ApplyPointsToPriceAsync(req.UserId, req.Price, maxAllowed);
        var remaining = await _pointsService.GetBalanceAsync(req.UserId);
        return Ok(new ApplyPointsResponse { FinalPrice = final, PointsUsed = used, RemainingBalance = remaining });
    }

    [HttpPost("redeem")]
    public async Task<IActionResult> Redeem([FromBody] RedeemRequest req)
    {
        await _pointsService.RedeemPointsToWalletAsync(req.UserId, req.PointsToRedeem);
        return NoContent();
    }

    [HttpPost("service/purchase")]
    public async Task<ActionResult<ServicePurchaseResponse>> PurchaseServiceWithPoints(
        [FromBody] ServicePurchaseRequest req)
    {
        var costPoints = ServicePointCosts.GetPointsCost(req.ServiceId);
        if (costPoints <= 0) return BadRequest("Unknown service");

        var balance = await _pointsService.GetBalanceAsync(req.UserId);
        if (balance < costPoints) return BadRequest("Insufficient points");

        // Convert service currency cost and ask PointsService to spend exactly costPoints
        var currencyCost = ServicePointCosts.GetCurrencyCost(req.ServiceId);
        var (final, used) = await _pointsService.ApplyPointsToPriceAsync(req.UserId, currencyCost, costPoints);

        // final should be 0 if enough points used; record service purchase result
        return Ok(new ServicePurchaseResponse
        {
            ServiceId = req.ServiceId, PointsSpent = used,
            RemainingBalance = await _pointsService.GetBalanceAsync(req.UserId)
        });
    }
}