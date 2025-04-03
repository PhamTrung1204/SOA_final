using Consul;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ServiceDiscovery;
using StaffService.Data;
using StaffService.Repositories;
using StaffService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

// Đăng ký IHttpClientFactory
builder.Services.AddHttpClient();

builder.Services.AddSingleton<ServiceDiscovery.ConsulService>();

// ✅ Cấu hình DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Dependency Injection
builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<IScheduleRepository, ScheduleRepository>();
builder.Services.AddScoped<StaffHandler>();

// ✅ Swagger cấu hình
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {

        Title = "Appointment API",
        Version = "v1",
        Description = "API for Staff and Schedules"


    });
});

// Add service for health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Luôn bật Swagger (bỏ qua điều kiện môi trường để kiểm tra)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Appointment API V1");
    c.RoutePrefix = string.Empty; // Hiển thị Swagger UI tại gốc, ví dụ: http://localhost:5017/
});

// Cấu hình pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

//app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/api/health");

// Register with Consul
RegisterWithConsul(app);

app.Run();

async void RegisterWithConsul(WebApplication app)
{
    var consulHost = Environment.GetEnvironmentVariable("CONSUL_HOST") ?? "localhost";
    var consulPort = 8500; // Default Consul port

    // Get service info from environment variables
    var serviceHost = Environment.GetEnvironmentVariable("SERVICE_HOST") ?? "localhost";
    var servicePort = int.Parse(Environment.GetEnvironmentVariable("SERVICE_PORT") ?? "8080");

    var serviceId = $"staff-{Guid.NewGuid()}";
    var serviceName = "staffservice";

    // Sử dụng ConsulService từ namespace ServiceDiscovery
    var consulService = app.Services.GetRequiredService<ConsulService>();

    // Register service with Consul
    await consulService.RegisterAsync(serviceName, serviceId, serviceHost, servicePort);

    // Deregister when the application stops
    app.Lifetime.ApplicationStopping.Register(async () => {
        await consulService.DeregisterAsync(serviceId);
    });
}