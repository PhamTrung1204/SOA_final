using CustomerService.Data;
using CustomerService.Repositories;
using CustomerService.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Consul; // Thêm để định nghĩa thông tin Swagger

var builder = WebApplication.CreateBuilder(args);

// Cấu hình Kestrel lắng nghe cổng 8080 và 8081 (HTTPS)
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080); // ✅ Lắng nghe đúng cổng Docker expose
});

// Thêm dịch vụ vào container
builder.Services.AddControllers();

// Đăng ký IHttpClientFactory
builder.Services.AddHttpClient();

builder.Services.AddSingleton<ServiceDiscovery.ConsulService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Cấu hình DbContext
builder.Services.AddDbContext<CustomerContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("CustomerDb")));

// Đăng ký Repository và Service
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService.Services.CustomerService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Thêm Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CustomerService API",
        Version = "v1",
        Description = "API for managing customers in Salon Management System"
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
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CustomerService API V1");
    c.RoutePrefix = string.Empty; // Đặt Swagger UI tại gốc (http://localhost:port/)
});

// Sau đó, sử dụng middleware CORS:
app.UseCors("AllowAll");

app.UseRouting();
//app.UseAuthentication(); // Thêm để bật xác thực JWT
//app.UseAuthorization();  // Thêm để bật phân quyền

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
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

    var serviceId = $"customer-{Guid.NewGuid()}";
    var serviceName = "customerservice";

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