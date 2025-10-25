using Cars24API.Models;
using Cars24API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserAuthController : ControllerBase
{
  private readonly UserService _userService;

  public UserAuthController(UserService userService)
  {
    _userService = userService;
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetUserById(string id)
  {
    var user = await _userService.GetUserByIdAsync(id);

    if (user == null)
    {
      return NotFound("User not found.");
    }

    return Ok(user);
  }

  [HttpPost("signup")]
  public async Task<IActionResult> SignUp([FromBody] User user)
  {
    user.Id = null;

    var existingUser = await _userService.GetUsernameByEmailAsync(user.Email);

    if (existingUser != null)
    {
      return BadRequest("Email already in use.");
    }

    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

    await _userService.CreateUserAsync(user);

    return Ok(new
    {
      Message = "User registered successfully.",
      user = new
      {
        user.Id,
        user.FullName,
        user.Email,
        user.Phone
      }
    });
  }

  [HttpPost("login")]
  public async Task<IActionResult> LogIn([FromBody] LoginRequest request)
  {
    var user = await _userService.GetUsernameByEmailAsync(request.Email);

    if (user == null)
    {
      return NotFound("User not found.");
    }

    if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
    {
      return BadRequest("Invalid password.");
    }

    return Ok(new
    {
      Message = "Login successful.",
      user = new
      {
        user.Id,
        user.FullName,
        user.Email,
        user.Phone
      }
    });
  }

  public class LoginRequest
  {
    public string Email { get; set; } = String.Empty;
    public string Password { get; set; } = String.Empty;
  }
}