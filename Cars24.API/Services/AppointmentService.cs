using Cars24.API.Models;
using MongoDB.Driver;

namespace Cars24.API.Services;

public class AppointmentService
{
  private readonly IMongoCollection<Appointment> _appointments;

  public AppointmentService(IConfiguration config)
  {
    var client = new MongoClient(config.GetConnectionString("DefaultConnection"));
    var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
    _appointments = database.GetCollection<Appointment>("Appointments");
  }

  public async Task CreateAppointmentAsync(Appointment appointment)
  {
    await _appointments.InsertOneAsync(appointment);
  }

  public async Task<Appointment> GetAppointmentByIdAsync(string id)
  {
    return await _appointments.Find(a => a.Id == id).FirstOrDefaultAsync();
  }

  public async Task<List<Appointment>> GetAllAppointmentsAsync()
  {
    return await _appointments.Find(_ => true).ToListAsync();
  }
}