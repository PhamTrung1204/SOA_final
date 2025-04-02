using Consul;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ServiceDiscovery;
using ServiceService.Data;
using ServiceService.Repositories;
using ServiceService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

// Đăng ký IHttpClientFactory
builder.Services.AddHttpClient();

builder.Services.AddSingleton<ServiceDiscovery.ConsulService>();

// Add DbContext + kết nối SQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dependency Injection
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<ServiceHandler>(); // Đã đổi tên class để tránh trùng với namespace

// ✅ Thêm SwaggerGen + cấu hình OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Salon Service API",
        Version = "v1",
        Description = "API for managing salon services"
    });
});


// Add service for health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Cấu hình pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Thêm Swagger middleware
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SalonService API V1");
    c.RoutePrefix = string.Empty; // Đặt Swagger UI tại gốc (http://localhost:port/)
});

app.UseRouting();

//app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/api/health");

// Register with Consul
RegisterWithConsul(app);

app.Run();

void RegisterWithConsul(WebApplication app)
{
    var consulHost = Environment.GetEnvironmentVariable("CONSUL_HOST") ?? "localhost";
    var consulPort = 8500; // Default Consul port

    // Get service info from environment variables
    var serviceHost = Environment.GetEnvironmentVariable("SERVICE_HOST") ?? "localhost";
    var servicePort = int.Parse(Environment.GetEnvironmentVariable("SERVICE_PORT") ?? "8080");

    var serviceId = $"service-{Guid.NewGuid()}";
    var serviceName = "serviceservice";

    var consulClient = new ConsulClient(c => {
        c.Address = new Uri($"http://{consulHost}:{consulPort}");
    });

    var registration = new AgentServiceRegistration()
    {
        ID = serviceId,
        Name = serviceName,
        Address = serviceHost,
        Port = servicePort,
        Check = new AgentServiceCheck()
        {
            HTTP = $"http://{serviceHost}:{servicePort}/api/health",
            Interval = TimeSpan.FromSeconds(10),
            Timeout = TimeSpan.FromSeconds(5),
            DeregisterCriticalServiceAfter = TimeSpan.FromMinutes(1)
        }
    };

    // Register service with Consul
    consulClient.Agent.ServiceRegister(registration).Wait();

    // Deregister when the application stops
    app.Lifetime.ApplicationStopping.Register(() => {
        consulClient.Agent.ServiceDeregister(serviceId).Wait();
    });
}