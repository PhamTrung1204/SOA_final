using CustomerService.Repositories;
using MessageBroker.Events;
using MessageBroker.Publishers;
using SalonManagementSystem.Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerService.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly CustomerEventPublisher _eventPublisher;
        private readonly ICustomerRepository _repository;

        public CustomerService(CustomerEventPublisher eventPublisher, ICustomerRepository repository)
        {
            _eventPublisher = eventPublisher;
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

            var @event = new CustomerRegisteredEvent
            {
                CustomerId = customer.CustomerId,
                Name = customer.Name,
                Email = customer.Email
            };
            _eventPublisher.PublishCustomerRegisteredEvent(@event);
        }

        public async Task UpdateCustomer(int id, Customer customer)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) throw new Exception("Customer not found");

            existing.Name = customer.Name;
            existing.Email = customer.Email;
            existing.PasswordHash = customer.PasswordHash;

            await _repository.UpdateAsync(existing);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteCustomer(int id)
        {
            await _repository.DeleteAsync(id);
            await _repository.SaveChangesAsync();
        }

        public async Task<Customer> GetCustomerByEmail(string email)
        {
            return await _repository.GetByEmailAsync(email);
        }
    }
}