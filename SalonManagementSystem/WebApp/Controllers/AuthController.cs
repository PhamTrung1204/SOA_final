using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class AuthController : Controller
    {
        private readonly ApiService _apiService;

        public AuthController(ApiService apiService)
        {
            _apiService = apiService;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
                return View(request);

            try
            {
                var response = await _apiService.LoginAsync(request);

                if (response.Success)
                {
                    // Lưu thông tin người dùng vào session
                    if (response.Customer != null)
                    {
                        // Có thể lưu ID của customer hoặc thông tin khác nếu cần
                        HttpContext.Session.SetInt32("CustomerId", response.Customer.CustomerId);
                        HttpContext.Session.SetString("CustomerName", response.Customer.Name);
                        HttpContext.Session.SetString("CustomerEmail", response.Customer.Email);
                    }

                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError("", response.Message ?? "Sai tài khoản hoặc mật khẩu.");
                    return View(request);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Login FAILED: " + ex.Message);
                ModelState.AddModelError("", "Sai tài khoản hoặc mật khẩu.");
                return View(request);
            }
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View(); // Sẽ tìm /Views/Auth/Register.cshtml
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return View(request);

            try
            {
                var response = await _apiService.RegisterAsync(request);

                if (response.Success)
                {
                    // Lưu thông tin người dùng vào session
                    if (response.Customer != null)
                    {
                        HttpContext.Session.SetInt32("CustomerId", response.Customer.CustomerId);
                        HttpContext.Session.SetString("CustomerName", response.Customer.Name);
                        HttpContext.Session.SetString("CustomerEmail", response.Customer.Email);
                    }

                    return RedirectToAction("Index", "Home"); // Đăng ký xong tự login luôn
                }
                else
                {
                    ModelState.AddModelError("", response.Message ?? "Registration failed.");
                    return View(request);
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "Registration failed: " + ex.Message);
                return View(request);
            }
        }

        public IActionResult Logout()
        {
            // Xóa thông tin session
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
    }
}
