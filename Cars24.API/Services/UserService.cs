using Cars24.API.Models;
using MongoDB.Driver;

namespace Cars24.API.Services;

public class UserService
{
  private readonly IMongoCollection<User> _users;

  public UserService(IConfiguration config)
  {
    var client = new MongoClient(config.GetConnectionString("DefaultConnection"));
    var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
    _users = database.GetCollection<User>("Users");
  }

  internal async Task<User?> GetUsernameByEmailAsync(string email) => await _users.Find(user => user.Email == email).FirstOrDefaultAsync();

  internal async Task CreateUserAsync(User user) => await _users.InsertOneAsync(user);

  internal async Task<User> GetUserByIdAsync(string id) => await _users.Find(user => user.Id == id).FirstOrDefaultAsync()!;

  internal async Task UpdateUserAsync(string userId, User user) => await _users.ReplaceOneAsync(u => u.Id == userId, user);

}