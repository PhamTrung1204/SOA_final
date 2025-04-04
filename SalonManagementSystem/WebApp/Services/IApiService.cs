using SalonManagementSystem.Shared.Models;

namespace WebApp.Services
{
    public interface IApiService
    {
        //Login
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        //Customer
        Task<List<Customer>> GetCustomersAsync();
        Task<Customer> GetCustomerAsync(int id);
        Task CreateCustomerAsync(Customer customer);
        Task UpdateCustomerAsync(int id, Customer customer);
        Task DeleteCustomerAsync(int id);
        //
        Task<List<Staff>> GetStaffAsync();
        Task<Staff> GetStaffAsync(int id);
        Task CreateStaffAsync(Staff staff);
        Task UpdateStaffAsync(int id, Staff staff);
        Task DeleteStaffAsync(int id);
        //
        Task<List<Service>> GetServicesAsync();
        Task<Service> GetServiceAsync(int id);
        Task CreateServiceAsync(Service service);
        Task UpdateServiceAsync(int id, Service service);
        Task DeleteServiceAsync(int id);
        //
        Task<List<Appointment>> GetAppointmentsAsync();
        Task<Appointment> GetAppointmentAsync(int id);
        Task CreateAppointmentAsync(Appointment appointment);
        Task UpdateAppointmentAsync(int id, Appointment appointment);
        Task DeleteAppointmentAsync(int id);
        Task<List<Payment>> GetPaymentsAsync();
        Task<Payment> GetPaymentAsync(int id);
        Task CreatePaymentAsync(Payment payment);
        Task<List<Feedback>> GetFeedbacksAsync();
        Task<Feedback> GetFeedbackAsync(int id);
        Task CreateFeedbackAsync(Feedback feedback);
        // Thêm phương thức mới cho việc đổi mật khẩu
        Task<bool> ChangePasswordAsync(int customerId, string currentPassword, string newPassword);
    }
}
