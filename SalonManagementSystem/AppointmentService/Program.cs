using AppointmentService.Data;
using AppointmentService.Repositories;
using AppointmentService.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

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

// Add services to the container.
builder.Services.AddDbContext<AppointmentContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AppointmentDb")));

builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IAppointmentService, AppointmentService.Services.AppointmentService>();

// Thêm Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AppointmentService API",
        Version = "v1",
        Description = "API for managing appointment in Salon Management System"
    });
});

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
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AppointmentrService API V1");
    c.RoutePrefix = string.Empty; // Đặt Swagger UI tại gốc (http://localhost:port/)
});

// Sau đó, sử dụng middleware CORS:
app.UseCors("AllowAll");
app.UseRouting();
//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();


var consulService = app.Services.GetRequiredService<ServiceDiscovery.ConsulService>();
var serviceName = "appointment-service";
var serviceId = "appointment-service-1";
var host = "appointment-service";
var port = 8080;

// Đăng ký dịch vụ với Consul một cách bất đồng bộ
await consulService.RegisterAsync(serviceName, serviceId, host, port);

// Hủy đăng ký dịch vụ khi ứng dụng dừng
var lifetime = app.Lifetime;
lifetime.ApplicationStopping.Register(() =>
{
    // Delegate không hỗ trợ async nên sử dụng GetAwaiter().GetResult() để đồng bộ hóa
    consulService.DeregisterAsync(serviceId).GetAwaiter().GetResult();
});

app.Run();