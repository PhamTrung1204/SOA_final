using SalonManagementSystem.Shared.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PaymentService.Services
{
    public interface IPaymentService
    {
        Task<IEnumerable<Payment>> GetAllPayments();
        Task<Payment> GetPaymentById(int id);
        Task CreatePayment(Payment payment);
        Task UpdatePayment(int id, Payment payment);
        Task DeletePayment(int id);
    }
}