using AppointmentService.Data;
using AppointmentService.Repositories;
using AppointmentService.Services;
using Microsoft.EntityFrameworkCore;

using ServiceDiscovery;

using Microsoft.OpenApi.Models;

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
    options.UseSqlServer(builder.Configuration.GetConnectionString("AppointmentDb")));

// Đăng ký các dịch vụ cần thiết
builder.Services.AddTransient<ConsulService>();
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

        Title = "AppointmentService API",
        Version = "v1",
        Description = "API for managing appointment in Salon Management System"

    });
});

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
//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

var consulService = app.Services.GetRequiredService<ConsulService>();


var serviceName = "appointment-service";
var serviceId = "appointment-service-1";
var host = "appointmentservice";
var port = 8080;

// Nếu bạn cần đăng ký với Consul, bỏ comment dòng dưới đây
// await consulService.RegisterAsync(serviceName, serviceId, host, port);

// Hủy đăng ký khi ứng dụng dừng
app.Lifetime.ApplicationStopping.Register(() =>
{
    consulService.DeregisterAsync(serviceId).GetAwaiter().GetResult();
});

app.Run();
