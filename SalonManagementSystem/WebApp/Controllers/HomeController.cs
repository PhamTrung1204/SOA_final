using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;

using WebApp.Services;

namespace Frontend.WebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly IApiService _apiService;

        public HomeController(IApiService apiService)
        {
            _apiService = apiService ?? throw new ArgumentNullException(nameof(apiService));
        }

        [AllowAnonymous] // Chỉ người dùng đã đăng nhập mới truy cập được
        public async Task<IActionResult> Index()
        {
            var services = await _apiService.GetServicesAsync();
            return View("~/Views/Home/Index.cshtml", services);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState không hợp lệ khi đăng nhập");
                return View("~/Views/Home/Login.cshtml", request);
            }

            try
            {
                Console.WriteLine($"Đang gửi yêu cầu đăng nhập cho: {request.Email}");
                var response = await _apiService.LoginAsync(request);

                Console.WriteLine($"Kết quả đăng nhập: Success={response.Success}, Message={response.Message}, Customer null?={response.Customer == null}");

                if (response.Success)
                {
                    if (response.Customer != null)
                    {
                        Console.WriteLine($"Đăng nhập thành công, đang lưu thông tin vào session cho customer: {response.Customer.Name}");

                        HttpContext.Session.SetInt32("CustomerId", response.Customer.CustomerId);
                        HttpContext.Session.SetString("CustomerName", response.Customer.Name);
                        HttpContext.Session.SetString("CustomerEmail", response.Customer.Email);

                        // Kiểm tra xem session có được lưu thành công không
                        var savedId = HttpContext.Session.GetInt32("CustomerId");
                        var savedName = HttpContext.Session.GetString("CustomerName");
                        Console.WriteLine($"Đã lưu vào session: ID={savedId}, Name={savedName}");

                        return RedirectToAction("Index");
                    }
                    else
                    {
                        Console.WriteLine("⚠️ Đăng nhập thành công nhưng Customer là null");
                        ViewBag.Error = "Không lấy được thông tin tài khoản.";
                        return View("~/Views/Home/Login.cshtml", request);
                    }
                }

                Console.WriteLine($"❌ Đăng nhập thất bại: {response.Message}");
                ViewBag.Error = response.Message ?? "Sai tài khoản hoặc mật khẩu.";
                return View("~/Views/Home/Login.cshtml", request);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Exception trong HomeController.Login: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                ViewBag.Error = "Sai tài khoản hoặc mật khẩu.";
                return View("~/Views/Home/Login.cshtml", request);
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return View("~/Views/Home/Register.cshtml", request);
            }

            try
            {
                var response = await _apiService.RegisterAsync(request);

                // Kiểm tra response.Success thay vì chỉ bắt exception
                if (response.Success)
                {
                    // Nếu đăng ký thành công, thực hiện đăng nhập luôn
                    if (response.Customer != null)
                    {
                        HttpContext.Session.SetInt32("CustomerId", response.Customer.CustomerId);
                        HttpContext.Session.SetString("CustomerName", response.Customer.Name);
                        HttpContext.Session.SetString("CustomerEmail", response.Customer.Email);
                    }
                    return RedirectToAction("Index");
                }

                // Hiển thị thông báo lỗi từ server
                ViewBag.Error = response.Message ?? "Đăng ký thất bại";
                return View("~/Views/Home/Register.cshtml", request);
            }
            catch (Exception ex)
            {
                ViewBag.Error = $"Đăng ký thất bại: {ex.Message}";
                return View("~/Views/Home/Register.cshtml", request);
            }
        }

        [Authorize]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("CurrentUser");
            return RedirectToAction("Login");
        }
    }
}