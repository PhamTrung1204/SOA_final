using Microsoft.EntityFrameworkCore;
using SalonManagementSystem.Shared.Models;

namespace PaymentService.Data
{
    public class PaymentContext : DbContext
    {
        public PaymentContext(DbContextOptions<PaymentContext> options) : base(options) { }
        public DbSet<Payment> Payments { get; set; }
    }
}