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

builder.Services.AddEndpointsApiExplorer();

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

// Add DbContext + kết nối SQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dependency Injection
builder.Services.AddTransient<ConsulService>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<ServiceHandler>(); // Đã đổi tên class để tránh trùng với namespace

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

// Lấy đối tượng ConsulService từ DI container
var consulService = app.Services.GetRequiredService<ServiceDiscovery.ConsulService>();

// Cấu hình thông tin đăng ký dịch vụ
var serviceName = "service-service";
var serviceId = "service-service-1";
var host = "service-service";
var port = 8080;

// Đăng ký dịch vụ với Consul một cách bất đồng bộ
//await consulService.RegisterAsync(serviceName, serviceId, host, port);

// Hủy đăng ký dịch vụ khi ứng dụng dừng
var lifetime = app.Lifetime;
lifetime.ApplicationStopping.Register(() =>
{
    // Delegate không hỗ trợ async nên sử dụng GetAwaiter().GetResult() để đồng bộ hóa
    consulService.DeregisterAsync(serviceId).GetAwaiter().GetResult();
});

app.Run();
