using MongoDB.Driver;

namespace Cars24API.Services;

public class CarService
{
  private readonly IMongoCollection<Car> _cars;

  public CarService(IConfiguration config)
  {
    var client = new MongoClient(config.GetConnectionString("DefaultConnection"));

    var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
    _cars = database.GetCollection<Car>("Cars");
  }

  public async Task<List<Car>> GetAllCarsAsync() => await _cars.Find(car => true).ToListAsync();

  public async Task<Car?> GetCarByIdAsync(string id) => await _cars.Find(car => car.Id == id).FirstOrDefaultAsync();

  public async Task createCarAsync(Car car) => await _cars.InsertOneAsync(car);
}