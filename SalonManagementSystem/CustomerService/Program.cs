using CustomerService.Data;
using CustomerService.Repositories;
using CustomerService.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using ServiceDiscovery; // Giả sử ConsulService được định nghĩa trong namespace này

var builder = WebApplication.CreateBuilder(args);

// ========================
// Thêm dịch vụ vào container
// ========================

// Thêm Controller
builder.Services.AddControllers();

// Đăng ký DbContext với SQL Server
builder.Services.AddDbContext<CustomerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CustomerDb")));

// Đăng ký Repository và Service
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService.Services.CustomerService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Đăng ký ConsulService (Singleton, vì nó có thể dùng cho việc đăng ký service)
builder.Services.AddSingleton<ConsulService>();

// Cấu hình JWT Authentication
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// ========================
// Cấu hình Swagger
// ========================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CustomerService API",
        Version = "v1",
        Description = "API for managing customers in Salon Management System"
    });

    // Cấu hình hỗ trợ JWT trong Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "Nhập token với định dạng: Bearer {your token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme{
                Reference = new OpenApiReference{
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// ========================
// Cấu hình Middleware Pipeline
// ========================

// Kích hoạt Swagger cho mọi môi trường (nếu cần, bạn có thể chỉ bật ở Development)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CustomerService API V1");
    c.RoutePrefix = string.Empty; // Hiển thị Swagger UI tại gốc: http://localhost:5017/
});

// Nếu đang ở môi trường Development, hiển thị Developer Exception Page
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

// Bật xác thực và phân quyền
app.UseAuthentication();
app.UseAuthorization();

// Map Controllers
app.MapControllers();

// ========================
// Đăng ký và hủy đăng ký với Consul
// ========================
var consulService = app.Services.GetRequiredService<ConsulService>();
var serviceName = "customer-service";
var serviceId = "customer-service-1";
// Lưu ý: host và port tùy thuộc vào cấu hình của bạn
var host = "customer-service";
var port = 80;

// Nếu muốn đăng ký với Consul, bỏ comment dòng dưới đây
// await consulService.RegisterAsync(serviceName, serviceId, host, port);

// Hủy đăng ký khi ứng dụng dừng lại
app.Lifetime.ApplicationStopping.Register(() =>
{
    consulService.DeregisterAsync(serviceId).GetAwaiter().GetResult();
});

app.Run();
