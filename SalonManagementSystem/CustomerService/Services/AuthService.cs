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
        private readonly IConfiguration _configuration;

        public AuthService(ICustomerService customerService, IConfiguration configuration)
        {
            _customerService = customerService;
            _configuration = configuration;
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            var existingCustomer = await _customerService.GetCustomerByEmail(request.Email);
            if (existingCustomer != null)
                throw new Exception("Email already exists");

            var customer = new Customer
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            await _customerService.CreateCustomer(customer);
            return GenerateJwtToken(customer);
        }

        public async Task<string> LoginAsync(LoginRequest request)
        {
            var customer = await _customerService.GetCustomerByEmail(request.Email);
            if (customer == null || !BCrypt.Net.BCrypt.Verify(request.Password, customer.PasswordHash))
                throw new Exception("Invalid email or password");

            return GenerateJwtToken(customer);
        }

        private string GenerateJwtToken(Customer customer)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, customer.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("customerId", customer.CustomerId.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}