using Consul;
using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Repositories;
using PaymentService.Services;
using ServiceDiscovery;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Đăng ký IHttpClientFactory
builder.Services.AddHttpClient();

builder.Services.AddSingleton<ConsulService>();

// Đăng ký DbContext với SQL Server
builder.Services.AddDbContext<PaymentContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PaymentDb")));

// Đăng ký Repository và Service với DI

builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, PaymentService.Services.PaymentService>();

// Cấu hình RabbitMQ
//builder.Services.AddSingleton<RabbitMqConfig>(sp =>
//    new RabbitMqConfig(builder.Configuration));

// Đăng ký Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add service for health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Payment API v1");
        c.RoutePrefix = string.Empty; // Swagger UI ở đường dẫn gốc
    });
}

app.UseHttpsRedirection();

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

    var serviceId = $"payment-{Guid.NewGuid()}";
    var serviceName = "paymentservice";

    // Sử dụng ConsulService từ namespace ServiceDiscovery
    var consulService = app.Services.GetRequiredService<ConsulService>();

    // Register service with Consul
    await consulService.RegisterAsync(serviceName, serviceId, serviceHost, servicePort);

    // Deregister when the application stops
    app.Lifetime.ApplicationStopping.Register(async () => {
        await consulService.DeregisterAsync(serviceId);
    });
}