using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonManagementSystem.Shared.Models;

namespace AppointmentService.Data
{
    public class AppointmentContext : DbContext
    {
        public AppointmentContext(DbContextOptions<AppointmentContext> options) : base(options) { }

        public DbSet<Appointment> Appointments { get; set; }
    }
}
