using AppointmentService.Data;
using AppointmentService.Repositories;
using AppointmentService.Services;
using MessageBroker.Consumers;
using MessageBroker.EventHandlers;
using MessageBroker.Publishers;
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

// MessageBroker start
// Thêm dịch vụ vào DI container với cơ chế retry
builder.Services.AddSingleton<RabbitMQConfig>(sp =>
{
    var host = builder.Configuration["RabbitMQ:Host"];
    var config = new RabbitMQConfig(host);
    int retries = 5;
    while (retries > 0)
    {
        try
        {
            return config;
        }
        catch (Exception ex)
        {
            retries--;
            if (retries == 0) throw new Exception("Không thể kết nối RabbitMQ", ex);
            Thread.Sleep(5000); // Đợi 5 giây trước khi thử lại
        }
    }
    throw new Exception("Không thể khởi tạo RabbitMQConfig");
});
// Đăng ký Publishers
builder.Services.AddTransient<AppointmentEventPublisher>();
builder.Services.AddTransient<PaymentEventPublisher>();
builder.Services.AddTransient<CustomerEventPublisher>();
builder.Services.AddTransient<StaffEventPublisher>();
builder.Services.AddTransient<FeedbackEventPublisher>();

// Đăng ký Consumers (dùng HostedService để chạy nền)
builder.Services.AddHostedService<AppointmentBookedConsumer>();
builder.Services.AddHostedService<PaymentProcessedConsumer>();
builder.Services.AddHostedService<CustomerRegisteredConsumer>();
builder.Services.AddHostedService<StaffScheduleUpdatedConsumer>();
builder.Services.AddHostedService<FeedbackSubmittedConsumer>();

// Đăng ký Handlers
builder.Services.AddScoped<CustomerRegisteredHandler>();
builder.Services.AddScoped<AppointmentBookedHandler>();
builder.Services.AddScoped<PaymentProcessedHandler>();
builder.Services.AddScoped<StaffScheduleUpdatedHandler>();
builder.Services.AddScoped<FeedbackSubmittedHandler>();

//MessagerBroker end

// Add services to the container.
// Đăng ký DbContext với cơ chế retry
builder.Services.AddDbContext<AppointmentContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("AppointmentDb"),
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        });
});

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
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AppointmentService API V1");
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
var host = "appointmentservice";
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