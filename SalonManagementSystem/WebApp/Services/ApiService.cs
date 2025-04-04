using Microsoft.Extensions.Configuration;
using SalonManagementSystem.Shared.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace WebApp.Services
{
    public class ApiService : IApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private bool _isAuthenticated = false;

        public ApiService(HttpClient httpClient, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;

            _httpClient.BaseAddress = new Uri(configuration["ApiGateway"]);

            var token = _httpContextAccessor.HttpContext?.Session.GetString("JwtToken");
            if (!string.IsNullOrEmpty(token))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                _isAuthenticated = true;
            }

            var apiGatewayUrl = _configuration["ApiGateway"];
            if (string.IsNullOrEmpty(apiGatewayUrl))
            {
                throw new Exception("API Gateway URL is not configured in appsettings.json");
            }
            _httpClient.BaseAddress = new Uri(apiGatewayUrl);
        }

        public bool IsAuthenticated => _isAuthenticated;

        public async Task<bool> ChangePasswordAsync(int customerId, string currentPassword, string newPassword)
        {
            try
            {
                // Gọi đến API endpoint để thay đổi mật khẩu
                var content = new StringContent(
                    JsonSerializer.Serialize(new { CurrentPassword = currentPassword, NewPassword = newPassword }),
                    Encoding.UTF8,
                    "application/json");

                var response = await _httpClient.PostAsync($"api/auth/{customerId}/change-password", content);

                if (response.IsSuccessStatusCode)
                {
                    return true;
                }

                // Nếu API trả về BadRequest, đọc lỗi từ response
                if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Lỗi từ API: {errorContent}");
                }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi gọi API đổi mật khẩu: {ex.Message}");
                return false;
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                Console.WriteLine($"Gửi yêu cầu đăng nhập cho email: {request.Email}");

                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                };

                var jsonRequest = JsonSerializer.Serialize(request, jsonOptions);
                Console.WriteLine($"Request JSON: {jsonRequest}");

                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("api/auth/login", content);

                var responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Response Status: {response.StatusCode}");
                Console.WriteLine($"Response Content: {responseContent}");

                // Luôn deserialize response, bất kể status code
                var authResponse = JsonSerializer.Deserialize<AuthResponse>(responseContent, jsonOptions);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Response success: {authResponse.Success}, Customer null?: {authResponse.Customer == null}");

                    if (authResponse.Success && authResponse.Customer != null)
                    {
                        Console.WriteLine($"Authentication successful, Customer ID: {authResponse.Customer.CustomerId}");
                        _isAuthenticated = true;
                    }
                    else
                    {
                        Console.WriteLine($"Đăng nhập thất bại mặc dù status code OK. Message: {authResponse.Message}");
                    }
                }
                else
                {
                    Console.WriteLine($"Đăng nhập thất bại với status code: {response.StatusCode}");
                }

                // Trả về authResponse bất kể thành công hay thất bại
                return authResponse;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in LoginAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return new AuthResponse
                {
                    Success = false,
                    Message = $"Lỗi kết nối: {ex.Message}"
                };
            }
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                };

                var jsonRequest = JsonSerializer.Serialize(request, jsonOptions);
                Console.WriteLine($"Request JSON: {jsonRequest}");

                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("api/auth/register", content);

                var responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Response Status: {response.StatusCode}");
                Console.WriteLine($"Response Content: {responseContent}");

                // Luôn deserialize response, bất kể status code
                var authResponse = JsonSerializer.Deserialize<AuthResponse>(responseContent, jsonOptions);

                if (response.IsSuccessStatusCode)
                {
                    if (authResponse.Success && authResponse.Customer != null)
                    {
                        _isAuthenticated = true;
                    }
                }

                // Trả về authResponse bất kể thành công hay thất bại
                return authResponse;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in RegisterAsync: {ex.Message}");
                return new AuthResponse
                {
                    Success = false,
                    Message = $"Lỗi kết nối: {ex.Message}"
                };
            }
        }

        private void CheckAuthentication()
        {
            // Kiểm tra nếu đã đăng nhập (có thể kiểm tra qua session)
            var customerId = _httpContextAccessor.HttpContext?.Session.GetInt32("CustomerId");
            _isAuthenticated = customerId.HasValue && customerId.Value > 0;
        }

        // Customer Service - số ít
        public async Task<List<Customer>> GetCustomersAsync()
        {

            CheckAuthentication();

            if (!_isAuthenticated)
                return new List<Customer>();

            var response = await _httpClient.GetAsync("api/customer");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Customer>>(responseData);
        }

        public async Task<Customer> GetCustomerAsync(int id)
        {
            CheckAuthentication();
            if (!_isAuthenticated) return null;

            var response = await _httpClient.GetAsync($"api/customer/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Customer>(responseData);
        }

        public async Task CreateCustomerAsync(Customer customer)
        {
            CheckAuthentication();
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to create a customer");

            var content = new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/customer", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateCustomerAsync(int id, Customer customer)
        {
            CheckAuthentication();
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to update a customer");

            var content = new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/customer/{id}", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteCustomerAsync(int id)
        {
            CheckAuthentication();
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to delete a customer");

            var response = await _httpClient.DeleteAsync($"api/customer/{id}");
            response.EnsureSuccessStatusCode();
        }

        // Staff Service - số ít
        public async Task<List<Staff>> GetStaffAsync()
        {
            if (!_isAuthenticated)
                return new List<Staff>();

            var response = await _httpClient.GetAsync("api/staff");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Staff>>(responseData);
        }

        public async Task<Staff> GetStaffAsync(int id)
        {
            if (!_isAuthenticated)
                return null;

            var response = await _httpClient.GetAsync($"api/staff/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Staff>(responseData);
        }

        public async Task CreateStaffAsync(Staff staff)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to create staff");

            var content = new StringContent(JsonSerializer.Serialize(staff), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/staff", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateStaffAsync(int id, Staff staff)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to update staff");

            var content = new StringContent(JsonSerializer.Serialize(staff), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/staff/{id}", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteStaffAsync(int id)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to delete staff");

            var response = await _httpClient.DeleteAsync($"api/staff/{id}");
            response.EnsureSuccessStatusCode();
        }

        // Service Service - số nhiều
        public async Task<List<Service>> GetServicesAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("api/services");
                response.EnsureSuccessStatusCode();
                var responseData = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<List<Service>>(responseData);
            }
            catch
            {
                // Return empty list if not authenticated or service is unavailable
                return new List<Service>();
            }
        }

        public async Task<Service> GetServiceAsync(int id)
        {
            if (!_isAuthenticated)
                return null;

            var response = await _httpClient.GetAsync($"api/services/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Service>(responseData);
        }

        public async Task CreateServiceAsync(Service service)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to create a service");

            var content = new StringContent(JsonSerializer.Serialize(service), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/services", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateServiceAsync(int id, Service service)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to update a service");

            var content = new StringContent(JsonSerializer.Serialize(service), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/services/{id}", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteServiceAsync(int id)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to delete a service");

            var response = await _httpClient.DeleteAsync($"api/services/{id}");
            response.EnsureSuccessStatusCode();
        }

        // Appointment Service - số ít
        public async Task<List<Appointment>> GetAppointmentsAsync()
        {
            if (!_isAuthenticated)
                return new List<Appointment>();

            var response = await _httpClient.GetAsync("api/appointment");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Appointment>>(responseData);
        }

        public async Task<Appointment> GetAppointmentAsync(int id)
        {
            if (!_isAuthenticated)
                return null;

            var response = await _httpClient.GetAsync($"api/appointment/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Appointment>(responseData);
        }

        public async Task CreateAppointmentAsync(Appointment appointment)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to create an appointment");

            var content = new StringContent(JsonSerializer.Serialize(appointment), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/appointment", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateAppointmentAsync(int id, Appointment appointment)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to update an appointment");

            var content = new StringContent(JsonSerializer.Serialize(appointment), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/appointment/{id}", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to delete an appointment");

            var response = await _httpClient.DeleteAsync($"api/appointment/{id}");
            response.EnsureSuccessStatusCode();
        }

        // Payment Service - số ít
        public async Task<List<Payment>> GetPaymentsAsync()
        {
            if (!_isAuthenticated)
                return new List<Payment>();

            var response = await _httpClient.GetAsync("api/payment");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Payment>>(responseData);
        }

        public async Task<Payment> GetPaymentAsync(int id)
        {
            if (!_isAuthenticated)
                return null;

            var response = await _httpClient.GetAsync($"api/payment/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Payment>(responseData);
        }

        public async Task CreatePaymentAsync(Payment payment)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to create a payment");

            var content = new StringContent(JsonSerializer.Serialize(payment), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/payment", content);
            response.EnsureSuccessStatusCode();
        }

        // Feedback Service - số ít
        public async Task<List<Feedback>> GetFeedbacksAsync()
        {
            if (!_isAuthenticated)
                return new List<Feedback>();

            var response = await _httpClient.GetAsync("api/feedback");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Feedback>>(responseData);
        }

        public async Task<Feedback> GetFeedbackAsync(int id)
        {
            if (!_isAuthenticated)
                return null;

            var response = await _httpClient.GetAsync($"api/feedback/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Feedback>(responseData);
        }

        public async Task CreateFeedbackAsync(Feedback feedback)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to create feedback");

            var content = new StringContent(JsonSerializer.Serialize(feedback), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/feedback", content);
            response.EnsureSuccessStatusCode();
        }
    }
}