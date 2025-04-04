using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        // Hiển thị trang profile
        public async Task<IActionResult> Profile()
        {
            // Get customer ID from session
            var customerId = HttpContext.Session.GetInt32("CustomerId");

            // If no customer ID in session, redirect to login
            if (customerId == null)
            {
                return RedirectToAction("Login");
            }

            // Get customer information using ID from session
            var customer = await _apiService.GetCustomerAsync(customerId.Value);
            if (customer == null)
            {
                return NotFound();
            }

            return View(customer);
        }

        // Also update UpdateProfile to use session data as a fallback
        [HttpPost]
        public async Task<IActionResult> UpdateProfile(Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return View("Profile", customer);
            }

            // If customer ID is not provided in the form, get it from session
            if (customer.CustomerId <= 0)
            {
                var sessionCustomerId = HttpContext.Session.GetInt32("CustomerId");
                if (sessionCustomerId != null)
                {
                    customer.CustomerId = sessionCustomerId.Value;
                }
                else
                {
                    return RedirectToAction("Login");
                }
            }

            try
            {
                // Call API service to update information
                await _apiService.UpdateCustomerAsync(customer.CustomerId, customer);

                // Add success message
                TempData["SuccessMessage"] = "Thông tin cá nhân đã được cập nhật thành công!";

                return RedirectToAction(nameof(Profile));
            }
            catch (System.Exception ex)
            {
                // Handle error
                TempData["ErrorMessage"] = $"Có lỗi xảy ra: {ex.Message}";
                return View("Profile", customer);
            }
        }

        // Update ChangePassword to also use session
        [HttpPost]
        public async Task<IActionResult> ChangePassword(string currentPassword, string newPassword, string confirmPassword)
        {
            // Get customer ID from session
            var customerId = HttpContext.Session.GetInt32("CustomerId");
            if (customerId == null)
            {
                return RedirectToAction("Login");
            }

            // Check if new password and confirm password match
            if (newPassword != confirmPassword)
            {
                TempData["ErrorMessage"] = "Mật khẩu xác nhận không khớp với mật khẩu mới!";
                return RedirectToAction(nameof(Profile));
            }

            // Validate new password
            if (string.IsNullOrEmpty(newPassword) || newPassword.Length < 8)
            {
                TempData["ErrorMessage"] = "Mật khẩu mới phải có ít nhất 8 ký tự!";
                return RedirectToAction(nameof(Profile));
            }

            try
            {
                // Call API to change password
                var result = await _apiService.ChangePasswordAsync(customerId.Value, currentPassword, newPassword);

                if (result)
                {
                    TempData["SuccessMessage"] = "Mật khẩu đã được thay đổi thành công!";
                }
                else
                {
                    TempData["ErrorMessage"] = "Mật khẩu hiện tại không chính xác hoặc có lỗi xảy ra!";
                }

                return RedirectToAction(nameof(Profile));
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Có lỗi xảy ra: {ex.Message}";
                return RedirectToAction(nameof(Profile));
            }
        }
    }
}
