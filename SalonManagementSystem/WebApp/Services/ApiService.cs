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

            var token = _httpContextAccessor.HttpContext?.Session.GetString("Token");
            if (!string.IsNullOrEmpty(token))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                _isAuthenticated = true;
            }
        }

        public bool IsAuthenticated => _isAuthenticated;

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/auth/login", content);
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            _isAuthenticated = true;
            return JsonSerializer.Deserialize<AuthResponse>(responseData);
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/auth/register", content);
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<AuthResponse>(responseData);
        }

        // Customer Service - số ít
        public async Task<List<Customer>> GetCustomersAsync()
        {
            if (!_isAuthenticated)
                return new List<Customer>();

            var response = await _httpClient.GetAsync("api/customer");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Customer>>(responseData);
        }

        public async Task<Customer> GetCustomerAsync(int id)
        {
            if (!_isAuthenticated)
                return null;

            var response = await _httpClient.GetAsync($"api/customer/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Customer>(responseData);
        }

        public async Task CreateCustomerAsync(Customer customer)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to create a customer");

            var content = new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/customer", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateCustomerAsync(int id, Customer customer)
        {
            if (!_isAuthenticated)
                throw new UnauthorizedAccessException("User must be authenticated to update a customer");

            var content = new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/customer/{id}", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteCustomerAsync(int id)
        {
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