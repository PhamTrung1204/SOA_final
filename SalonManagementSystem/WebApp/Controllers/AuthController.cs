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

                Console.WriteLine("🟢 TOKEN: " + response.AccessToken); // 👈 Thêm log này

                HttpContext.Session.SetString("JwtToken", response.AccessToken);
                HttpContext.Session.SetString("RefreshToken", response.RefreshToken ?? "");

                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Login FAILED: " + ex.Message); // 👈 Log lỗi rõ
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
                HttpContext.Session.SetString("JwtToken", response.AccessToken);
                HttpContext.Session.SetString("RefreshToken", response.RefreshToken);
                return RedirectToAction("Index", "Home"); // Đăng ký xong tự login luôn
            }
            catch
            {
                ModelState.AddModelError("", "Registration failed.");
                return View(request);
            }
        }
    }
}
