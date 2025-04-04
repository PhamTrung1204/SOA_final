using CustomerService.Services;
using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using System.Text.Json;
using System.Threading.Tasks;

namespace CustomerService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                Console.WriteLine($"👉 Login request for email: {request.Email}");
                var customer = await _authService.AuthenticateAsync(request.Email, request.Password);

                if (customer != null)
                {
                    Console.WriteLine($"🔑 Authentication successful for {customer.Email}");
                    Console.WriteLine($"Customer details: ID={customer.CustomerId}, Name={customer.Name}");

                    var response = new AuthResponse
                    {
                        Success = true,
                        Customer = customer,
                        Message = "Đăng nhập thành công"
                    };

                    // Log response data
                    Console.WriteLine($"✅ Sending success response: {JsonSerializer.Serialize(response)}");

                    return Ok(response);
                }

                Console.WriteLine($"❌ Authentication failed for {request.Email}");
                return Unauthorized(new AuthResponse
                {
                    Success = false,
                    Message = "Email hoặc mật khẩu không đúng"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Exception during login: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Log request để debug
                Console.WriteLine($"Register request received: {JsonSerializer.Serialize(request)}");

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage);

                    Console.WriteLine($"Model validation failed: {string.Join(", ", errors)}");
                    return BadRequest(new AuthResponse
                    {
                        Success = false,
                        Message = "Dữ liệu không hợp lệ"
                    });
                }

                var customer = await _authService.RegisterAsync(request);
                return Ok(new AuthResponse
                {
                    Success = true,
                    Customer = customer,
                    Message = "Đăng ký thành công"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in Register: {ex.Message}");
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordModel model)
        {
            try
            {
                bool result = await _authService.ChangePasswordAsync(id, model.CurrentPassword, model.NewPassword);

                if (result)
                {
                    return Ok(new { success = true, message = "Mật khẩu đã được thay đổi thành công" });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Mật khẩu hiện tại không chính xác" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Lỗi server: {ex.Message}" });
            }
        }
    }
}