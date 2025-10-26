using Cars24.API.Models;
using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentController(
    AppointmentService appointmentService,
    UserService userService,
    CarService carService) : ControllerBase
{
    public class AppointmentDto
    {
        public required Appointment Appointment { get; set; }
        public Car? Car { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment([FromQuery] string userId, [FromBody] Appointment? appointment)
    {
        if (appointment == null) return BadRequest("Invalid appointment data.");
        if (string.IsNullOrEmpty(userId)) return BadRequest("UserId is required.");
        if (string.IsNullOrEmpty(appointment.CarId)) return BadRequest("CarId is required.");

        await appointmentService.CreateAppointmentAsync(appointment);

        var user = await userService.GetUserByIdAsync(userId);

        user.AppointmentId.Add(appointment.Id!);
        await userService.UpdateUserAsync(userId, user);

        return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.Id }, appointment);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAppointmentById(string id)
    {
        var appointment = await appointmentService.GetAppointmentByIdAsync(id);

        return Ok(appointment);
    }

    [HttpGet("user/{userId}/appointments")]
    public async Task<IActionResult> GetAppointmentByUserId(string userId)
    {
        var user = await userService.GetUserByIdAsync(userId);

        var results = new List<AppointmentDto>();

        foreach (var appointmentId in user.AppointmentId)
        {
            var appointment = await appointmentService.GetAppointmentByIdAsync(appointmentId);
            
            Car? car = null;
            if (!string.IsNullOrEmpty(appointment.CarId))
            {
                car = await carService.GetCarByIdAsync(appointment.CarId);
            }

            results.Add(new AppointmentDto
            {
                Appointment = appointment,
                Car = car
            });
        }

        return Ok(results);
    }
}