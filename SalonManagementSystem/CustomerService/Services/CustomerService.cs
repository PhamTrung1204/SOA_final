using CustomerService.Repositories;
using SalonManagementSystem.Shared.Models;

namespace CustomerService.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repository;

        public CustomerService(ICustomerRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Customer>> GetAllCustomers()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Customer> GetCustomerById(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task CreateCustomer(Customer customer)
        {
            await _repository.AddAsync(customer);
            await _repository.SaveChangesAsync();
        }

        public async Task UpdateCustomer(int id, Customer customer)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) throw new Exception("Customer not found");

            existing.Name = customer.Name;
            existing.Email = customer.Email;
            existing.Phone = customer.Phone;

            await _repository.UpdateAsync(existing);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteCustomer(int id)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer == null) throw new Exception("Customer not found");

            await _repository.DeleteAsync(id);
            await _repository.SaveChangesAsync();
        }
    }
}
