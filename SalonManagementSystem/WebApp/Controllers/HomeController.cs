using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly IApiService _apiService;

        public HomeController(IApiService apiService)
        {
            _apiService = apiService;
        }

        //[Authorize] // Chỉ người dùng đã đăng nhập mới truy cập được
        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous] // Không cần đăng nhập
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                var token = await _apiService.LoginAsync(request);
                HttpContext.Session.SetString("Token", token);
                return RedirectToAction("Index");
            }
            catch
            {
                ViewBag.Error = "Invalid email or password";
                return View();
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            try
            {
                var token = await _apiService.RegisterAsync(request);
                HttpContext.Session.SetString("Token", token);
                return RedirectToAction("Index");
            }
            catch
            {
                ViewBag.Error = "Registration failed";
                return View();
            }
        }

        //[Authorize]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("Token");
            return RedirectToAction("Login");
        }
    }
}