using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
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
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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

// Đăng ký dịch vụ với Consul cho staff-service
var consulService = app.Services.GetRequiredService<ServiceDiscovery.ConsulService>();
var serviceName = "staff-service";
var serviceId = "staff-service-1";
var host = "staff-service";
var port = 8080;

// Sử dụng await để đăng ký bất đồng bộ
await consulService.RegisterAsync(serviceName, serviceId, host, port);

// Hủy đăng ký dịch vụ khi ứng dụng dừng
var lifetime = app.Lifetime;
lifetime.ApplicationStopping.Register(() =>
{
    // Vì delegate không hỗ trợ await trực tiếp nên dùng GetAwaiter().GetResult()
    consulService.DeregisterAsync(serviceId).GetAwaiter().GetResult();
});

app.Run();