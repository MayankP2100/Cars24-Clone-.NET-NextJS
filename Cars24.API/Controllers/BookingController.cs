using Cars24.API.Models;
using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24.API.Controllers;

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

    if (string.IsNullOrEmpty(booking.Id))
    {
      return BadRequest("Booking ID is null or empty after creation.");
    }

    var user = await userService.GetUserByIdAsync(userId);
    if (user == null) return NotFound("User not found.");

    if (user.BookingId == null)
    {
      user.BookingId = new List<string>();
    }

    user.BookingId.Add(booking.Id);
    await userService.UpdateUserAsync(user.Id!, user);

    return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, new { booking, booking.CarId });
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

    if (user.BookingId == null)
    {
      user.BookingId = new List<string>();
    }

    if (user.BookingId.Count == 0)
    {
      return Ok(results);
    }

    var validBookingIds = new List<string>();
    foreach (var bookingId in user.BookingId)
    {
      var booking = await bookingService.GetBookingByIdAsync(bookingId);
      if (booking != null && booking.CarId != null)
      {
        validBookingIds.Add(bookingId);
        var car = await carService.GetCarByIdAsync(booking.CarId);
        results.Add(new BookingDto
        {
          Booking = booking,
          Car = car
        });
      }
    }

    user.BookingId = validBookingIds;
    await userService.UpdateUserAsync(user.Id!, user);

    return Ok(results);
  }
}