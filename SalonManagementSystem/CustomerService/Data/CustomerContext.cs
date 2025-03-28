using Microsoft.EntityFrameworkCore;
using SalonManagementSystem.Shared.Models;
using System.Collections.Generic;

namespace CustomerService.Data
{
    public class CustomerContext : DbContext
    {
        public CustomerContext(DbContextOptions<CustomerContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
    }
}
