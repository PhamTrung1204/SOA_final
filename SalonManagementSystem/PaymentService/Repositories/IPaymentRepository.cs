using PaymentService.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PaymentService.Repositories
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment> GetByIdAsync(int id);
        Task AddAsync(Payment payment);
        Task UpdateAsync(Payment payment);
        Task DeleteAsync(int id);
        Task SaveChangesAsync();
    }
}