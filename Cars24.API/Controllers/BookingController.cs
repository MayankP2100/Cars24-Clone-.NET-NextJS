using Cars24API.Models;
using Cars24API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController(BookingService bookingService, UserService userService, CarService carService) : ControllerBase
{
  public class BookingDto
  {
    public required Booking Booking { get; set; }
    public Car? Car { get; set; }
  }

  [HttpPost]
  public async Task<IActionResult> CreateBooking([FromQuery] string userId, [FromBody] Booking booking)
  {
    if (booking == null) return BadRequest("Invalid appointment data.");
    if (string.IsNullOrEmpty(userId)) return BadRequest("UserId is required.");
    if (string.IsNullOrEmpty(booking.CarId)) return BadRequest("CarId is required.");

    await bookingService.CreateBookingAsync(booking);

    var user = await userService.GetUserByIdAsync(userId);

    if (user == null) return NotFound("User not found.");

    user.BookingId.Add(booking.Id!);
    await userService.UpdateUserAsync(userId, user);

    return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetBookingById(string id)
  {
    var booking = await bookingService.GetBookingByIdAsync(id);
    if (booking == null) return NotFound("Appointment not found.");

    return Ok(booking);
  }

  [HttpGet("user/{userId}/bookings")]
  public async Task<IActionResult> GetBookingByUserId(string userId)
  {
    var user = await userService.GetUserByIdAsync(userId);

    if (user == null) return NotFound("User not found.");

    var results = new List<BookingDto>();

    foreach (var bookingId in user.BookingId)
    {
      var booking = await bookingService.GetBookingByIdAsync(bookingId);
      if (booking != null)
      {
        Car? car = null;
        if (!string.IsNullOrEmpty(booking.CarId))
        {
          car = await carService.GetCarByIdAsync(booking.CarId);
        }

        results.Add(new BookingDto
        {
          Booking = booking,
          Car = car
        });
      }
    }
    return Ok(results);
  }
}