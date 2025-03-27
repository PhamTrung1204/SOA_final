using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using StaffService.Data;
using StaffService.Repositories;
using StaffService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
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

app.Run();
