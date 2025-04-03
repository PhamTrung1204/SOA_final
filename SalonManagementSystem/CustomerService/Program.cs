using CustomerService.Data;
using CustomerService.Repositories;
using CustomerService.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Swashbuckle.AspNetCore.SwaggerUI;
using Microsoft.OpenApi.Models;
using Consul;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using System.Text.Json;
using ServiceDiscovery;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ vào container
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

// Cấu hình DbContext
builder.Services.AddDbContext<CustomerContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("CustomerDb")));

// Đăng ký Repository và Service
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService.Services.CustomerService>();
builder.Services.AddScoped<IAuthService, AuthService>(); // Bỏ comment để đăng ký AuthService

// Kiểm tra xem có cấu hình JWT không
var jwtKey = builder.Configuration["Jwt:Key"];
if (!string.IsNullOrEmpty(jwtKey))
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });
}
else
{
    // Sử dụng cấu hình JWT mặc định hoặc vô hiệu hóa xác thực nếu đang trong môi trường phát triển
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            // Cấu hình tối thiểu để dịch vụ có thể chạy mà không gây ra lỗi
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = false
            };
        });

    // Ghi log cảnh báo
    Console.WriteLine("WARNING: JWT configuration is missing. Using minimal authentication setup.");
}

builder.Services.AddEndpointsApiExplorer();

// Thêm Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CustomerService API",
        Version = "v1",
        Description = "API for managing customers in Salon Management System"
    });

    // Cấu hình để hỗ trợ JWT trong Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token in the text input below.\nExample: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add service for health checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Luôn bật Swagger (bỏ qua điều kiện môi trường để kiểm tra)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Customer API V1");
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
app.MapHealthChecks("/api/health", new HealthCheckOptions
{
    // Return a detailed response that Consul can interpret
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = JsonSerializer.Serialize(
            new
            {
                status = report.Status.ToString(),
                checks = report.Entries.Select(e => new { name = e.Key, status = e.Value.Status.ToString() })
            });
        await context.Response.WriteAsync(result);
    }
});

app.UseAuthentication(); // Thêm để bật xác thực JWT
app.UseAuthorization();  // Thêm để bật phân quyền

app.MapControllers();

// Register with Consul
RegisterWithConsul(app);

app.Run();

async void RegisterWithConsul(WebApplication app)
{
    var consulHost = Environment.GetEnvironmentVariable("CONSUL_HOST") ?? "localhost";
    var consulPort = 8500; // Default Consul port

    // Get service info from environment variables
    var serviceHost = Environment.GetEnvironmentVariable("SERVICE_HOST") ?? "localhost";
    var servicePort = int.Parse(Environment.GetEnvironmentVariable("SERVICE_PORT") ?? "8080");

    var serviceId = $"customer-{Guid.NewGuid()}";
    var serviceName = "customerservice"; // Sửa tên service để khớp với Ocelot

    // Sử dụng ConsulService từ namespace ServiceDiscovery
    var consulService = app.Services.GetRequiredService<ConsulService>();

    // Register service with Consul
    await consulService.RegisterAsync(serviceName, serviceId, serviceHost, servicePort);

    // Deregister when the application stops
    app.Lifetime.ApplicationStopping.Register(async () => {
        await consulService.DeregisterAsync(serviceId);
    });
}