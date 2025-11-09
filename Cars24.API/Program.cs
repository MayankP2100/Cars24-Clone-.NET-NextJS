using Cars24.API.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;

builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<AppointmentService>();
builder.Services.AddSingleton<BookingService>();

builder.Services.AddScoped<CarService>();
builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<NotificationPreferenceService>();
builder.Services.AddScoped<PricingService>();
builder.Services.AddScoped<ReferralService>();
builder.Services.AddScoped<WalletService>();
builder.Services.AddScoped<PurchaseService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Cars24 API v1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();


app.MapGet("/db-check", async () =>
{
    try
    {
        var client = new MongoClient(connectionString);
        var dbList = await client.ListDatabaseNamesAsync();

        return Results.Ok("MongoDB connection successful. Databases: " + string.Join(", ", await dbList.ToListAsync()));
    }
    catch (Exception e)
    {
        return Results.Problem("MongoDB connection failed: " + e.Message);
    }
});

app.UseCors("AllowAll");

app.MapControllers();

app.Run();