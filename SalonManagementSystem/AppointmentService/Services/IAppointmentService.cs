using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;

namespace AppointmentService.Services
{
    public interface IAppointmentService
    {
        Task<IEnumerable<Appointment>> GetAllAppointments();
        Task<Appointment> GetAppointmentById(int id);
        Task<IEnumerable<Appointment>> GetAppointmentsByCustomerId(int customerId);
        Task<IEnumerable<Appointment>> GetAppointmentsByStaffId(int staffId);
        Task CreateAppointment(Appointment appointment);
        Task UpdateAppointment(int id, Appointment appointment);
        Task DeleteAppointment(int id);
        Task<bool> CheckStaffAvailability(int staffId, DateTime appointmentDate);
    }
}
