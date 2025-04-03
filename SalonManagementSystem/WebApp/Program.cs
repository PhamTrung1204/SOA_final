using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký IHttpContextAccessor
builder.Services.AddHttpContextAccessor();
builder.Configuration.AddEnvironmentVariables();
builder.Configuration["ApiGateway"] = builder.Configuration["GATEWAY_URL"];

// Cấu hình dịch vụ

// Thêm xác thực JWT
// Thêm cấu hình Authentication với default scheme
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
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

// Thêm dịch vụ MVC với Newtonsoft.Json để xử lý JSON
builder.Services.AddControllersWithViews()
    .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

// Thêm HttpClient để gọi API
builder.Services.AddRazorPages();

// Thêm Session để lưu token tạm thời (nếu cần)
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddControllersWithViews(); // phải có cái này
builder.Services.AddHttpClient(); // đã dùng HttpClient

// Thêm HttpContextAccessor để truy cập HttpContext trong ApiService
builder.Services.AddHttpClient<ApiService>(); // Chỉ cần đăng ký HttpClient một lần
builder.Services.AddScoped<IApiService, ApiService>();

// Xây dựng ứng dụng
var app = builder.Build();

// Cấu hình pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Thêm middleware xác thực và phân quyền
app.UseAuthentication();
app.UseAuthorization();

// Thêm middleware Session
app.UseSession();

// Định tuyến MVC
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Thêm định tuyến cho Razor Pages
app.MapRazorPages();

app.Run();