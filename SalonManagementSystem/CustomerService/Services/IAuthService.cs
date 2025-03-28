using SalonManagementSystem.Shared.Models;
using System.Threading.Tasks;

namespace CustomerService.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequest request);
        Task<string> LoginAsync(LoginRequest request);
    }
}