using CustomerService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace CustomerService.Data
{
    public class CustomerContext : DbContext
    {
        public CustomerContext(DbContextOptions<CustomerContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
    }
}
