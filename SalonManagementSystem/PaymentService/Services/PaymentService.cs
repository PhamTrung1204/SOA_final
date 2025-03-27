using PaymentService.Repositories;
using SalonManagementSystem.Shared.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PaymentService.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _repository;

        public PaymentService(IPaymentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Payment>> GetAllPayments()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Payment> GetPaymentById(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task CreatePayment(Payment payment)
        {
            await _repository.AddAsync(payment);
            await _repository.SaveChangesAsync();
        }

        public async Task UpdatePayment(int id, Payment payment)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) throw new Exception("Payment not found");

            existing.Amount = payment.Amount;
            existing.Status = payment.Status;

            await _repository.UpdateAsync(existing);
            await _repository.SaveChangesAsync();
        }

        public async Task DeletePayment(int id)
        {
            var payment = await _repository.GetByIdAsync(id);
            if (payment == null) throw new Exception("Payment not found");

            await _repository.DeleteAsync(id);
            await _repository.SaveChangesAsync();
        }
    }
}