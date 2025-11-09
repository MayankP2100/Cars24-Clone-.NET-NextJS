using System.Threading.Tasks;
using Cars24.API.Models;
using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24.API.Controllers
{
    [ApiController]
    [Route("api/purchase")]
    public class PurchaseController : ControllerBase
    {
        private readonly PurchaseService _purchaseService;

        public PurchaseController(PurchaseService purchaseService)
        {
            _purchaseService = purchaseService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePurchaseRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.UserId) || string.IsNullOrWhiteSpace(request.CarId) || string.IsNullOrWhiteSpace(request.PurchaseType))
                return BadRequest("Invalid request.");

            var purchase = await _purchaseService.CreateAsync(
                request.UserId,
                request.CarId,
                request.CarTitle,
                request.Price,
                request.PurchaseType,
                request.Status);

            return CreatedAtAction(nameof(GetById), new { id = purchase.Id }, purchase);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser([FromRoute] string userId)
        {
            var list = await _purchaseService.GetByUserAsync(userId);
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var p = await _purchaseService.GetByIdAsync(id);
            if (p == null) return NotFound();
            return Ok(p);
        }
    }
}