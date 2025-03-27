using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;

namespace AppointmentService.Repositories
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetAllAsync();
        Task<Appointment> GetByIdAsync(int id);
        Task<IEnumerable<Appointment>> GetByCustomerIdAsync(int customerId);
        Task<IEnumerable<Appointment>> GetByStaffIdAsync(int staffId);
        Task AddAsync(Appointment appointment);
        Task UpdateAsync(Appointment appointment);
        Task DeleteAsync(int id);
        Task SaveChangesAsync();
    }
}
