
using SalonManagementSystem.Shared.Models;

namespace CustomerService.Services
{
    public interface ICustomerService
    {
        Task<IEnumerable<Customer>> GetAllCustomers();
        Task<Customer> GetCustomerById(int id);
        Task CreateCustomer(Customer customer);
        Task UpdateCustomer(int id, Customer customer);
        Task DeleteCustomer(int id);
    }
}
