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

        [AllowAnonymous] // Không cần đăng nhập
        [HttpGet]
        public IActionResult Login()
        {
            return View("~/Views/Home/Login.cshtml");
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return View("~/Views/Home/Login.cshtml", request);
            }

            try
            {
                var response = await _apiService.LoginAsync(request);
                HttpContext.Session.SetString("JwtToken", response.AccessToken);
                HttpContext.Session.SetString("RefreshToken", response.RefreshToken);
                return RedirectToAction("Index");
            }
            catch
            {
                ViewBag.Error = "Invalid email or password";
                return View("~/Views/Home/Login.cshtml", request);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult Register()
        {
            return View("~/Views/Home/Register.cshtml");
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
                HttpContext.Session.SetString("JwtToken", response.AccessToken);
                HttpContext.Session.SetString("RefreshToken", response.RefreshToken);
                return RedirectToAction("Index");
            }
            catch
            {
                ViewBag.Error = "Registration failed";
                return View("~/Views/Home/Register.cshtml", request);
            }
        }

        [Authorize]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("JwtToken");
            HttpContext.Session.Remove("RefreshToken");
            return RedirectToAction("Login");
        }
    }
}