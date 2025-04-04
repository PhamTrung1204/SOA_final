using SalonManagementSystem.Shared.Models;
using System.Threading.Tasks;

namespace CustomerService.Services
{
    public interface IAuthService
    {
        Task<Customer> AuthenticateAsync(string email, string password);
        Task<Customer> RegisterAsync(RegisterRequest request);
        Task<bool> ChangePasswordAsync(int customerId, string currentPassword, string newPassword);
    }
}