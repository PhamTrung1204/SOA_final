using AppointmentService.Services;
using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;

namespace AppointmentService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _appointmentService.GetAllAppointments();
            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var appointment = await _appointmentService.GetAppointmentById(id);
            return appointment != null ? Ok(appointment) : NotFound();
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomerId(int customerId)
        {
            var appointments = await _appointmentService.GetAppointmentsByCustomerId(customerId);
            return Ok(appointments);
        }

        [HttpGet("staff/{staffId}")]
        public async Task<IActionResult> GetByStaffId(int staffId)
        {
            var appointments = await _appointmentService.GetAppointmentsByStaffId(staffId);
            return Ok(appointments);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Appointment appointment)
        {
            await _appointmentService.CreateAppointment(appointment);
            return CreatedAtAction(nameof(GetById), new { id = appointment.AppointmentId }, appointment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Appointment appointment)
        {
            await _appointmentService.UpdateAppointment(id, appointment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _appointmentService.DeleteAppointment(id);
            return NoContent();
        }

        [HttpGet("check-availability/{staffId}")]
        public async Task<IActionResult> CheckAvailability(int staffId, [FromQuery] DateTime appointmentDate)
        {
            var isAvailable = await _appointmentService.CheckStaffAvailability(staffId, appointmentDate);
            return Ok(new { IsAvailable = isAvailable });
        }
    }
}
