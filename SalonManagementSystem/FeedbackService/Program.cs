using Microsoft.EntityFrameworkCore;
using FeedbackService.Data;
using FeedbackService.Repositories;
using FeedbackService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Đăng ký IHttpClientFactory
builder.Services.AddHttpClient();

builder.Services.AddSingleton<ServiceDiscovery.ConsulService>();

// Đăng ký DbContext với SQL Server
builder.Services.AddDbContext<FeedbackContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FeedbackDb")));

// Đăng ký Repository và Service với DI
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<IFeedbackService, FeedbackService.Services.FeedbackService>();

// Đăng ký HttpClient cho AppointmentService
builder.Services.AddHttpClient("AppointmentService", client =>
{
    client.BaseAddress = new Uri("http://appointmentservice/"); // Địa chỉ của AppointmentService
});

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
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Feedback API v1");
        c.RoutePrefix = string.Empty; // Swagger UI ở đường dẫn gốc
    });
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

var consulService = app.Services.GetRequiredService<ServiceDiscovery.ConsulService>();
var serviceName = "feedback-service";
var serviceId = "feedback-service-1";
var host = "feedback-service";
var port = 8080;

await consulService.RegisterAsync(serviceName, serviceId, host, port);

app.Lifetime.ApplicationStopping.Register(() =>
{
    consulService.DeregisterAsync(serviceId).GetAwaiter().GetResult();
});

app.Run();
