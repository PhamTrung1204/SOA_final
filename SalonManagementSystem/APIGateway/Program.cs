using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.Extensions.Configuration;
using Ocelot.Provider.Consul;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ Ocelot và cấu hình Consul
builder.Services.AddOcelot(builder.Configuration)
                .AddConsul();  // Đăng ký Ocelot sử dụng Consul làm service discovery

// Thêm Swagger nếu bạn cần tài liệu API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Sử dụng Swagger nếu môi trường phát triển
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Gateway V1");
        c.RoutePrefix = string.Empty;  // Đặt Swagger UI tại gốc (http://localhost:5000/)
    });
}

app.UseAuthorization();

// Sử dụng Ocelot để thực hiện routing
await app.UseOcelot();

// Khởi chạy ứng dụng
app.Run();
