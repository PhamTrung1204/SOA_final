using CustomerService.Data;
using Microsoft.EntityFrameworkCore;
using SalonManagementSystem.Shared.Models;

namespace CustomerService.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly CustomerContext _context;

        public CustomerRepository(CustomerContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer> GetByIdAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer is null)
            {
                throw new Exception("Customer not found");
            }
            return customer;
        }

        public async Task AddAsync(Customer customer)
        {
            await _context.Customers.AddAsync(customer);
        }

        public async Task UpdateAsync(Customer customer)
        {
            _context.Customers.Update(customer);
            await SaveChangesAsync();
        }


        public async Task DeleteAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer != null) _context.Customers.Remove(customer);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
