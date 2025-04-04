using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using SalonManagementSystem.Shared.Models;

namespace CustomerService.Services
{
    public class AuthService : IAuthService
    {
        private readonly ICustomerService _customerService;

        public AuthService(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        public async Task<Customer> AuthenticateAsync(string email, string password)
        {
            var customers = await _customerService.GetAllCustomers();
            Console.WriteLine($"Đang tìm kiếm customer với email: {email}");

            var customer = customers.FirstOrDefault(c => c.Email == email);

            if (customer == null)
            {
                Console.WriteLine($"❌ Không tìm thấy customer với email: {email}");
                return null;
            }

            Console.WriteLine($"✅ Đã tìm thấy customer: {customer.Name}");

            // Kiểm tra xem PasswordHash có giá trị không
            if (string.IsNullOrEmpty(customer.PasswordHash))
            {
                Console.WriteLine("❌ Hash mật khẩu trong database rỗng hoặc null");
                return null;
            }

            Console.WriteLine($"Hash mật khẩu lưu trữ: {customer.PasswordHash.Substring(0, Math.Min(20, customer.PasswordHash.Length))}...");

            // Xác thực mật khẩu
            bool isPasswordValid = VerifyPasswordHash(password, customer.PasswordHash);
            Console.WriteLine($"Kết quả xác thực mật khẩu: {isPasswordValid}");

            if (isPasswordValid)
                return customer;

            return null;
        }

        public async Task<Customer> RegisterAsync(RegisterRequest request)
        {
            Console.WriteLine($"Đang đăng ký customer với email: {request.Email}");

            // Kiểm tra email tồn tại
            var customers = await _customerService.GetAllCustomers();
            if (customers.Any(c => c.Email == request.Email))
            {
                Console.WriteLine($"❌ Email đã tồn tại: {request.Email}");
                throw new Exception("Email already exists");
            }

            // Hash mật khẩu
            string hashedPassword = HashPassword(request.Password);
            Console.WriteLine($"Mật khẩu đã được hash: {hashedPassword.Substring(0, Math.Min(20, hashedPassword.Length))}...");

            // Tạo customer mới
            var customer = new Customer
            {
                Name = request.Name,
                Email = request.Email,
                Phone = "", // Có thể bổ sung sau
                PasswordHash = hashedPassword
            };

            await _customerService.CreateCustomer(customer);
            Console.WriteLine($"✅ Đã đăng ký thành công customer: {customer.Name}");
            return customer;
        }

        private string HashPassword(string password)
        {
            try
            {
                // Sử dụng workFactor mặc định là 10 để tăng tính bảo mật
                string hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 10);
                Console.WriteLine($"Đã hash mật khẩu thành công: {hash.Substring(0, Math.Min(20, hash.Length))}...");
                return hash;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi khi hash mật khẩu: {ex.Message}");
                throw;
            }
        }

        private bool VerifyPasswordHash(string password, string storedHash)
        {
            try
            {
                if (string.IsNullOrEmpty(storedHash) || string.IsNullOrEmpty(password))
                {
                    Console.WriteLine("❌ Mật khẩu hoặc hash để verify rỗng");
                    return false;
                }

                // Xác thực mật khẩu bằng BCrypt
                bool result = BCrypt.Net.BCrypt.Verify(password, storedHash);

                Console.WriteLine($"Kết quả xác thực BCrypt: {result}");
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi khi xác thực mật khẩu: {ex.Message}");

                // Thử cách khác nếu storedHash không phải định dạng BCrypt
                if (!storedHash.StartsWith("$2") && password == storedHash)
                {
                    Console.WriteLine("⚠️ Xác thực bằng so sánh trực tiếp: THÀNH CÔNG");
                    return true;
                }

                return false;
            }
        }

        public async Task<bool> ChangePasswordAsync(int customerId, string currentPassword, string newPassword)
        {
            // Lấy danh sách khách hàng
            var customers = await _customerService.GetAllCustomers();

            // Tìm khách hàng theo customerId
            Console.WriteLine($"Đang tìm kiếm customer với ID: {customerId}");
            var customer = customers.FirstOrDefault(c => c.CustomerId == customerId);

            if (customer == null)
            {
                Console.WriteLine($"❌ Không tìm thấy customer với ID: {customerId}");
                return false;
            }

            Console.WriteLine($"✅ Đã tìm thấy customer: {customer.Name}");

            // Xác thực mật khẩu hiện tại
            bool isCurrentPasswordValid = VerifyPasswordHash(currentPassword, customer.PasswordHash);
            Console.WriteLine($"Kết quả xác thực mật khẩu hiện tại: {isCurrentPasswordValid}");

            if (!isCurrentPasswordValid)
            {
                return false;
            }

            // Hash mật khẩu mới
            string newHashedPassword = HashPassword(newPassword);
            Console.WriteLine($"Mật khẩu mới đã được hash: {newHashedPassword.Substring(0, Math.Min(20, newHashedPassword.Length))}...");

            // Cập nhật mật khẩu
            customer.PasswordHash = newHashedPassword;
            await _customerService.UpdateCustomer(customer.CustomerId, customer); // Đã sửa ở đây

            Console.WriteLine($"✅ Đã cập nhật mật khẩu thành công cho customer: {customer.Name}");

            return true;
        }
    }
}