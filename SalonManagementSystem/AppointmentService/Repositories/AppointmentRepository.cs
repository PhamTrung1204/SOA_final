using AppointmentService.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalonManagementSystem.Shared.Models;

namespace AppointmentService.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly AppointmentContext _context;

        public AppointmentRepository(AppointmentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            return await _context.Appointments.ToListAsync();
        }

        public async Task<Appointment> GetByIdAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) {
                throw new Exception("Appointment not found");
            }
            return appointment;
        }

        public async Task<IEnumerable<Appointment>> GetByCustomerIdAsync(int customerId)
        {
            return await _context.Appointments.Where(a => a.CustomerId == customerId).ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetByStaffIdAsync(int staffId)
        {
            return await _context.Appointments.Where(a => a.StaffId == staffId).ToListAsync();
        }

        public async Task AddAsync(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
        }

        public async Task UpdateAsync(Appointment appointment)
        {
            _context.Appointments.Update(appointment);
            await SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment != null) _context.Appointments.Remove(appointment);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
