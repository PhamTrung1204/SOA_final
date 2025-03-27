using MessageBroker;
using Microsoft.EntityFrameworkCore;
using PaymentService.Data;
using PaymentService.Repositories;
using PaymentService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Đăng ký DbContext với SQL Server
builder.Services.AddDbContext<PaymentContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("PaymentDb")));

// Đăng ký Repository và Service với DI
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, PaymentService.Services.PaymentService>();
// Cấu hình RabbitMQ
builder.Services.AddSingleton<RabbitMQConfig>(sp =>
    new RabbitMQConfig(builder.Configuration));
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