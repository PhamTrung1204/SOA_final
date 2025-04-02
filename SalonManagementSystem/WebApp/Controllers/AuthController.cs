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

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return View(request);
            }

            try
            {
                var response = await _apiService.LoginAsync(request);
                HttpContext.Session.SetString("JwtToken", response.AccessToken);
                HttpContext.Session.SetString("RefreshToken", response.RefreshToken);
                return RedirectToAction("Index", "Home");
            }
            catch
            {
                ModelState.AddModelError("", "Invalid email or password.");
                return View(request);
            }
        }
    }
}
