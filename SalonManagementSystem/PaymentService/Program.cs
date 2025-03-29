using MessageBroker;
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

builder.Services.AddSingleton<ServiceDiscovery.ConsulService>();

// Đăng ký DbContext với SQL Server
builder.Services.AddDbContext<PaymentContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("PaymentDb")));

// Đăng ký Repository và Service với DI
builder.Services.AddTransient<ConsulService>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, PaymentService.Services.PaymentService>();

//// Cấu hình RabbitMQ
//builder.Services.AddSingleton<RabbitMqConfig>(sp =>
//    new RabbitMqConfig(builder.Configuration));

// Đăng ký Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.UseAuthorization();

app.MapControllers();

var consulService = app.Services.GetRequiredService<ServiceDiscovery.ConsulService>();
var serviceName = "payment-service";
var serviceId = "payment-service-1";
var host = "payment-service";
var port = 8080;

//await consulService.RegisterAsync(serviceName, serviceId, host, port);

app.Lifetime.ApplicationStopping.Register(() =>
{
    consulService.DeregisterAsync(serviceId).GetAwaiter().GetResult();
});

app.Run();
