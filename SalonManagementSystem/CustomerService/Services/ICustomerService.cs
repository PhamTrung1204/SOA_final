using SalonManagementSystem.Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerService.Services
{
    public interface ICustomerService
    {
        Task<IEnumerable<Customer>> GetAllCustomers();
        Task<Customer> GetCustomerById(int id);
        Task CreateCustomer(Customer customer);
        Task UpdateCustomer(int id, Customer customer);
        Task DeleteCustomer(int id);
        Task<Customer> GetCustomerByEmail(string email); // Thêm để hỗ trợ đăng nhập
    }
}