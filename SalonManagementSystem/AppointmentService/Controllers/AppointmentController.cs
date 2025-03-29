using AppointmentService.Services;
using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using ServiceDiscovery; // Thêm namespace cho ServiceDiscovery
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json; // Để deserialize JSON từ các microservices

namespace AppointmentService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IHttpClientFactory _httpClientFactory; // Để gọi API của các microservices khác
        private readonly ConsulService _consulService; // Để khám phá dịch vụ qua Consul

        public AppointmentController(
            IAppointmentService appointmentService,
            IHttpClientFactory httpClientFactory,
            ConsulService consulService)
        {
            _appointmentService = appointmentService;
            _httpClientFactory = httpClientFactory;
            _consulService = consulService;
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
            var client = _httpClientFactory.CreateClient();

            // 1. Kiểm tra khách hàng tồn tại qua CustomerService
            var customerServiceUri = await _consulService.DiscoverServiceAsync("customer-service");
            var customerResponse = await client.GetAsync($"{customerServiceUri}/api/customers/{appointment.CustomerId}");
            if (!customerResponse.IsSuccessStatusCode)
                return BadRequest("Customer not found");

            // 2. Kiểm tra nhân viên tồn tại qua StaffService
            var staffServiceUri = await _consulService.DiscoverServiceAsync("staff-service");
            var staffResponse = await client.GetAsync($"{staffServiceUri}/api/staff/{appointment.StaffId}");
            if (!staffResponse.IsSuccessStatusCode)
                return BadRequest("Staff not found");

            // 3. Kiểm tra dịch vụ tồn tại qua ServiceService
            var serviceServiceUri = await _consulService.DiscoverServiceAsync("service-service");
            var serviceResponse = await client.GetAsync($"{serviceServiceUri}/api/services/{appointment.ServiceId}");
            if (!serviceResponse.IsSuccessStatusCode)
                return BadRequest("Service not found");

            // 4. Tạo lịch hẹn nếu tất cả hợp lệ
            await _appointmentService.CreateAppointment(appointment);
            return CreatedAtAction(nameof(GetById), new { id = appointment.AppointmentId }, appointment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Appointment appointment)
        {
            var client = _httpClientFactory.CreateClient();

            // Kiểm tra tính hợp lệ tương tự như Create
            var customerServiceUri = await _consulService.DiscoverServiceAsync("customer-service");
            var customerResponse = await client.GetAsync($"{customerServiceUri}/api/customers/{appointment.CustomerId}");
            if (!customerResponse.IsSuccessStatusCode)
                return BadRequest("Customer not found");

            var staffServiceUri = await _consulService.DiscoverServiceAsync("staff-service");
            var staffResponse = await client.GetAsync($"{staffServiceUri}/api/staff/{appointment.StaffId}");
            if (!staffResponse.IsSuccessStatusCode)
                return BadRequest("Staff not found");

            var serviceServiceUri = await _consulService.DiscoverServiceAsync("service-service");
            var serviceResponse = await client.GetAsync($"{serviceServiceUri}/api/services/{appointment.ServiceId}");
            if (!serviceResponse.IsSuccessStatusCode)
                return BadRequest("Service not found");

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
            var client = _httpClientFactory.CreateClient();

            // Kiểm tra nhân viên tồn tại qua StaffService
            var staffServiceUri = await _consulService.DiscoverServiceAsync("staff-service");
            var staffResponse = await client.GetAsync($"{staffServiceUri}/api/staff/{staffId}");
            if (!staffResponse.IsSuccessStatusCode)
                return BadRequest("Staff not found");

            var isAvailable = await _appointmentService.CheckStaffAvailability(staffId, appointmentDate);
            return Ok(new { IsAvailable = isAvailable });
        }
    }
}