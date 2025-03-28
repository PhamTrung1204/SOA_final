using Microsoft.EntityFrameworkCore;
using FeedbackService.Data;
using FeedbackService.Repositories;
using FeedbackService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Đăng ký DbContext với SQL Server
builder.Services.AddDbContext<FeedbackContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FeedbackDb")));

// Đăng ký Repository và Service với DI
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<IFeedbackService, FeedbackService.Services.FeedbackService>();
builder.Services.AddHttpClient("AppointmentService", client =>
{
    client.BaseAddress = new Uri("http://appointmentservice/"); // Địa chỉ của AppointmentService
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();