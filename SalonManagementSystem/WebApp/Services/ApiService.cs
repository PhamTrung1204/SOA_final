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

        public ApiService(HttpClient httpClient, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;

            _httpClient.BaseAddress = new Uri(_configuration["ApiGateway"]);
            var token = _httpContextAccessor.HttpContext.Session.GetString("Token");
            if (!string.IsNullOrEmpty(token))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }
        }

        public async Task<string> LoginAsync(LoginRequest request)
        {
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/auth/login", content);
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<Dictionary<string, string>>(responseData);
            return result["token"];
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/auth/register", content);
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<Dictionary<string, string>>(responseData);
            return result["token"];
        }

        public async Task<List<Customer>> GetCustomersAsync()
        {
            var response = await _httpClient.GetAsync("api/customers");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Customer>>(responseData);
        }

        public async Task<Customer> GetCustomerAsync(int id)
        {
            var response = await _httpClient.GetAsync($"api/customers/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Customer>(responseData);
        }

        public async Task CreateCustomerAsync(Customer customer)
        {
            var content = new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/customers", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateCustomerAsync(int id, Customer customer)
        {
            var content = new StringContent(JsonSerializer.Serialize(customer), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/customers/{id}", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteCustomerAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"api/customer/{id}");
            response.EnsureSuccessStatusCode();
        }

        public async Task<List<Staff>> GetStaffAsync()
        {
            var response = await _httpClient.GetAsync("api/staff");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Staff>>(responseData);
        }

        public async Task<Staff> GetStaffAsync(int id)
        {
            var response = await _httpClient.GetAsync($"api/staff/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Staff>(responseData);
        }

        public async Task CreateStaffAsync(Staff staff)
        {
            var content = new StringContent(JsonSerializer.Serialize(staff), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/staff", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateStaffAsync(int id, Staff staff)
        {
            var content = new StringContent(JsonSerializer.Serialize(staff), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/staff/{id}", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteStaffAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"api/staff/{id}");
            response.EnsureSuccessStatusCode();
        }

        public async Task<List<Service>> GetServicesAsync()
        {
            var response = await _httpClient.GetAsync("api/services");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Service>>(responseData);
        }

        public async Task<Service> GetServiceAsync(int id)
        {
            var response = await _httpClient.GetAsync($"api/services/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Service>(responseData);
        }

        public async Task CreateServiceAsync(Service service)
        {
            var content = new StringContent(JsonSerializer.Serialize(service), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/services", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateServiceAsync(int id, Service service)
        {
            var content = new StringContent(JsonSerializer.Serialize(service), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/services/{id}", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteServiceAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"api/services/{id}");
            response.EnsureSuccessStatusCode();
        }

        public async Task<List<Appointment>> GetAppointmentsAsync()
        {
            var response = await _httpClient.GetAsync("api/appointments");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Appointment>>(responseData);
        }

        public async Task<Appointment> GetAppointmentAsync(int id)
        {
            var response = await _httpClient.GetAsync($"api/appointments/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Appointment>(responseData);
        }

        public async Task CreateAppointmentAsync(Appointment appointment)
        {
            var content = new StringContent(JsonSerializer.Serialize(appointment), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/appointment", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task UpdateAppointmentAsync(int id, Appointment appointment)
        {
            var content = new StringContent(JsonSerializer.Serialize(appointment), Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"api/appointment/{id}", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            var response = await _httpClient.DeleteAsync($"api/appointments/{id}");
            response.EnsureSuccessStatusCode();
        }

        public async Task<List<Payment>> GetPaymentsAsync()
        {
            var response = await _httpClient.GetAsync("api/payments");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Payment>>(responseData);
        }

        public async Task<Payment> GetPaymentAsync(int id)
        {
            var response = await _httpClient.GetAsync($"api/payments/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Payment>(responseData);
        }

        public async Task CreatePaymentAsync(Payment payment)
        {
            var content = new StringContent(JsonSerializer.Serialize(payment), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/payments", content);
            response.EnsureSuccessStatusCode();
        }

        public async Task<List<Feedback>> GetFeedbacksAsync()
        {
            var response = await _httpClient.GetAsync("api/feedback");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Feedback>>(responseData);
        }

        public async Task<Feedback> GetFeedbackAsync(int id)
        {
            var response = await _httpClient.GetAsync($"api/feedback/{id}");
            response.EnsureSuccessStatusCode();
            var responseData = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Feedback>(responseData);
        }

        public async Task CreateFeedbackAsync(Feedback feedback)
        {
            var content = new StringContent(JsonSerializer.Serialize(feedback), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/feedback", content);
            response.EnsureSuccessStatusCode();
        }
    }
}