using Cars24.API.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Cars24.API.Services;

public class CarService
{
    private readonly IMongoCollection<Car> _cars;

    public CarService(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("DefaultConnection"));

        var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        _cars = database.GetCollection<Car>("Cars");
    }

    public async Task<List<Car>> GetAllCarsByCityAsync(string city = "All")
    {
        if (string.IsNullOrEmpty(city) || city == "All") return await _cars.Find(_ => true).ToListAsync();
        
        var filter = Builders<Car>.Filter.Regex(c => c.Location, new BsonRegularExpression($"^{city}$", "i"));
        return await _cars.Find(filter).ToListAsync();
    }

    public async Task<Car?> GetCarByIdAsync(string id) => await _cars.Find(car => car.Id == id).FirstOrDefaultAsync();

    public async Task CreateCarAsync(Car car) => await _cars.InsertOneAsync(car);
}