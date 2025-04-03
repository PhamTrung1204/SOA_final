using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.Extensions.Configuration;
using Ocelot.Provider.Consul;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// Load cấu hình Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);



// Đăng ký Ocelot + Consul
builder.Services.AddOcelot(builder.Configuration)
                .AddConsul();

// Thêm CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebApp", policy =>
    {
        policy.WithOrigins("http://localhost:5007")
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .AllowAnyHeader();
    });
});

// Swagger (nếu bạn dùng)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Xử lý lỗi
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"error\": \"An unexpected error occurred.\"}");
    });
});

// Thêm CORS
app.UseCors("AllowWebApp");

// Middleware
app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapGet("/", () => "API Gateway is running...");
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Gateway V1");
        c.RoutePrefix = string.Empty;
    });
}

// ❗ Bắt buộc phải là cuối cùng
await app.UseOcelot();

app.Run();