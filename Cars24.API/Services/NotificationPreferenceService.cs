using Cars24.API.Models;
using MongoDB.Driver;

namespace Cars24.API.Services;

public class NotificationPreferenceService
{
    private readonly IMongoCollection<NotificationPreference> _notificationPreferenceCollection;

    public NotificationPreferenceService(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("DefaultConnection"));

        var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        _notificationPreferenceCollection = database.GetCollection<NotificationPreference>("NotificationPreferences");
    }

    public async Task<NotificationPreference?> GetPreferenceByUserIdAsync(string userId)
    {
        return await _notificationPreferenceCollection.Find(preference => preference.UserId == userId)
            .FirstOrDefaultAsync();
    }

    public async Task<NotificationPreference?> GetPreferenceByIdAsync(string id)
    {
        return await _notificationPreferenceCollection.Find(preference => preference.Id == id).FirstOrDefaultAsync();
    }

    public async Task CreatePreferenceAsync(NotificationPreference preference)
    {
        await _notificationPreferenceCollection.InsertOneAsync(preference);
    }

    public async Task UpdatePreferenceAsync(string id, NotificationPreference preference)
    {
        await _notificationPreferenceCollection.ReplaceOneAsync(p => p.Id == id, preference);
    }

    public async Task DeletePreferenceAsync(string id)
    {
        await _notificationPreferenceCollection.DeleteOneAsync(p => p.Id == id);
    }
}