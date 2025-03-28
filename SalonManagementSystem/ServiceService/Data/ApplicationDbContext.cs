using Microsoft.EntityFrameworkCore;
using SalonManagementSystem.Shared.Models;

namespace ServiceService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Service> Services { get; set; }
    }
}
