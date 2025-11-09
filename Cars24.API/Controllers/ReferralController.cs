using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24.API.Controllers;

[ApiController]
[Route("api/{controller}")]
public class ReferralController : ControllerBase
{
    private readonly ReferralService _referralService;
    private readonly WalletService _walletService;

    public ReferralController(ReferralService referralService, WalletService walletService)
    {
        _referralService = referralService;
        _walletService = walletService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromQuery] string userId)
    {
        var code = await _referralService.CreateReferralCodeAsync(userId);
        return Ok(new { Code = code });
    }

    [HttpPost]
    public async Task<IActionResult> Claim([FromQuery] string code, [FromQuery] string referredUserId)
    {
        var ok = await _referralService.ClaimReferralAsync(code, referredUserId);
        if (!ok) return BadRequest("Invalid or already claimed code.");
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> FirstTransaction([FromQuery] string referredUserId, [FromQuery] string referenceId)
    {
        await _referralService.ProcessFirstTransactionAsync(referredUserId, referenceId);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetWallet([FromQuery] string userId)
    {
        var wallet = await _walletService.GetWalletAsync(userId);
        return Ok(wallet);
    }

    [HttpPost]
    public async Task<IActionResult> Redeem([FromQuery] string userId, [FromQuery] long points,
        [FromQuery] string referenceId)
    {
        var ok = await _walletService.RedeemPointsAsync(userId, points, referenceId, "Redeem for discount/service");
        if (!ok) return BadRequest("Insufficient points or invalid request.");
        return Ok();
    }
}