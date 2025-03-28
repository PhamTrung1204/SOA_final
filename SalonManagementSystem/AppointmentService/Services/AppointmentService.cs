using AppointmentService.Repositories;
using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;

namespace AppointmentService.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _repository;

        public AppointmentService(IAppointmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointments()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Appointment> GetAppointmentById(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByCustomerId(int customerId)
        {
            return await _repository.GetByCustomerIdAsync(customerId);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByStaffId(int staffId)
        {
            return await _repository.GetByStaffIdAsync(staffId);
        }

        public async Task CreateAppointment(Appointment appointment)
        {
            if (!await CheckStaffAvailability(appointment.StaffId, appointment.AppointmentDate))
            {
                throw new Exception("Nhân viên không rảnh vào thời điểm đã chọn.");
            }

            appointment.Status = "Pending";
            await _repository.AddAsync(appointment);
            await _repository.SaveChangesAsync();
        }

        public async Task UpdateAppointment(int id, Appointment appointment)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) throw new Exception("Không tìm thấy lịch hẹn.");

            existing.CustomerId = appointment.CustomerId;
            existing.StaffId = appointment.StaffId;
            existing.ServiceId = appointment.ServiceId;
            existing.AppointmentDate = appointment.AppointmentDate;
            existing.Status = appointment.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(existing);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteAppointment(int id)
        {
            var appointment = await _repository.GetByIdAsync(id);
            if (appointment == null) throw new Exception("Không tìm thấy lịch hẹn.");

            await _repository.DeleteAsync(id);
            await _repository.SaveChangesAsync();
        }

        public async Task<bool> CheckStaffAvailability(int staffId, DateTime appointmentDate)
        {
            var existingAppointments = await _repository.GetByStaffIdAsync(staffId);
            return !existingAppointments.Any(a => a.AppointmentDate == appointmentDate && a.Status != "Cancelled");
        }
    }
}
