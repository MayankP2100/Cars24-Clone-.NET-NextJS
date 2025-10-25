using Cars24API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24API.Controllers;

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
    var result = cars.Select(car => new
    {
      car.Id,
      car.Title,
      car.Specs.Km,
      car.Specs.Fuel,
      car.Specs.Transmission,
      car.Specs.Owner,
      car.Price,
      car.Emi,
      car.Location,
      Image = car.Images
    });

    return Ok(cars);
  }

  [HttpPost]
  public async Task<IActionResult> CreateCar([FromBody] Car car)
  {
    if (car == null)
    {
      return BadRequest("Car data is required.");
    }

    await carService.createCarAsync(car);

    return CreatedAtAction(nameof(GetCarById), new { id = car.Id }, car);
  }
}