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

builder.Services.AddEndpointsApiExplorer();

// ✅ Swagger cấu hình
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Staff Service API",
        Version = "v1",
        Description = "API for managing staff and schedules"
    });
});

// ✅ Cấu hình DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Dependency Injection
builder.Services.AddTransient<ConsulService>();

builder.Services.AddScoped<IStaffRepository, StaffRepository>();
builder.Services.AddScoped<IScheduleRepository, ScheduleRepository>();
builder.Services.AddScoped<StaffService.Services.StaffHandler>();

var app = builder.Build();

// ✅ Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

// Đăng ký dịch vụ với Consul cho staff-service
var consulService = app.Services.GetRequiredService<ServiceDiscovery.ConsulService>();
var serviceName = "staff-service";
var serviceId = "staff-service-1";
var host = "staff-service";
var port = 8080;

// Sử dụng await để đăng ký bất đồng bộ
//await consulService.RegisterAsync(serviceName, serviceId, host, port);

// Hủy đăng ký dịch vụ khi ứng dụng dừng
var lifetime = app.Lifetime;
lifetime.ApplicationStopping.Register(() =>
{
    // Vì delegate không hỗ trợ await trực tiếp nên dùng GetAwaiter().GetResult()
    consulService.DeregisterAsync(serviceId).GetAwaiter().GetResult();
});

app.Run();
