using AppointmentService.Data;
using AppointmentService.Repositories;
using AppointmentService.Services;
using Microsoft.EntityFrameworkCore;
using ServiceDiscovery;
using Microsoft.OpenApi.Models;
using Consul;

var builder = WebApplication.CreateBuilder(args);


// ----------------------------
// Cấu hình các dịch vụ trong container
// ----------------------------

// Đăng ký DbContext cho SQL Server

builder.Services.AddControllers();

// Đăng ký IHttpClientFactory
builder.Services.AddHttpClient();

builder.Services.AddSingleton<ConsulService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


builder.Services.AddDbContext<AppointmentContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("AppointmentDb")));

// Đăng ký các dịch vụ cần thiết

builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IAppointmentService, AppointmentService.Services.AppointmentService>();


builder.Services.AddControllers();

// ----------------------------
// Cấu hình Swagger
// ----------------------------
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {

        Title = "Appointment API",
        Version = "v1",
        Description = "API for managing appointments"


    });
});

// Add service for health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// ----------------------------
// Cấu hình middleware pipeline
// ----------------------------

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


// Sau đó, sử dụng middleware CORS:
app.UseCors("AllowAll");
app.UseRouting();
app.UseHttpsRedirection();
//app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/api/health");

// Register with Consul
RegisterWithConsul(app);
app.Run();

async void RegisterWithConsul(WebApplication app)
{
    // Get service info from environment variables
    var serviceHost = Environment.GetEnvironmentVariable("SERVICE_HOST") ?? "localhost";
    var servicePort = int.Parse(Environment.GetEnvironmentVariable("SERVICE_PORT") ?? "8080");
    var serviceId = $"appointment-{Guid.NewGuid()}";
    var serviceName = "appointmentservice";

    // Sử dụng ConsulService từ namespace ServiceDiscovery
    var consulService = app.Services.GetRequiredService<ConsulService>();

    // Register service with Consul
    await consulService.RegisterAsync(serviceName, serviceId, serviceHost, servicePort);

    // Deregister when the application stops
    app.Lifetime.ApplicationStopping.Register(async () => {
        await consulService.DeregisterAsync(serviceId);
    });
}