using Microsoft.EntityFrameworkCore;
using SalonManagementSystem.Shared.Models;

namespace StaffService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
    }
}
