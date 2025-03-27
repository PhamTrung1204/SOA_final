using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ServiceService.Data;
using ServiceService.Repositories;
using ServiceService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
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
app.Run();
