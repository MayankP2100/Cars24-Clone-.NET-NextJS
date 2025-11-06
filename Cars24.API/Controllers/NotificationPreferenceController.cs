using Cars24.API.Models;
using Cars24.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationPreferenceController(NotificationPreferenceService notificationPreferenceService)
    : ControllerBase
{
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserNotificationPreferences(string userId)
    {
        var preference = await notificationPreferenceService.GetPreferenceByUserIdAsync(userId);

        if (preference == null) return NotFound("Notification preferences not found");

        return Ok(preference);
    }

    [HttpPost("user/{userId}")]
    public async Task<IActionResult> CreateNotificationPreferences(string userId,
        [FromBody] NotificationPreference preference)
    {
        preference.UserId = userId;

        await notificationPreferenceService.CreatePreferenceAsync(preference);

        return CreatedAtAction(nameof(GetUserNotificationPreferences), new { userId }, preference);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNotificationPreferences(string id,
        [FromBody] NotificationPreference preference)
    {
        var existing = await notificationPreferenceService.GetPreferenceByIdAsync(id);

        if (existing == null) return NotFound("Notification preferences not found");

        preference.Id = id;

        await notificationPreferenceService.UpdatePreferenceAsync(id, preference);
        
        return Ok(preference);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotificationPreferences(string id)
    {
        var existing = await notificationPreferenceService.GetPreferenceByIdAsync(id);

        if (existing == null) return NotFound("Notification preferences not found");

        await notificationPreferenceService.DeletePreferenceAsync(id);

        return NoContent();
    }
}