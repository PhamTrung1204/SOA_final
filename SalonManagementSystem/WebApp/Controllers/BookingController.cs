using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using SalonManagementSystem.Shared.Models.ViewModels;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class BookingController : Controller
    {
        private readonly IApiService _apiService;

        public BookingController(IApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<IActionResult> Index()
        {
            var appointments = await _apiService.GetAppointmentsAsync();
            return View(appointments);
        }

        public async Task<IActionResult> Create()
        {
            var staff = await _apiService.GetStaffAsync();
            var services = await _apiService.GetServicesAsync();
            var model = new BookingViewModel
            {
                Appointment = new Appointment { CustomerId = 1 }, // Giả định customerId
                StaffList = staff,
                ServiceList = services
            };
            return View(model);
        }

        public async Task<IActionResult> BookAppointment(int serviceId)
        {
            // Check if user is authenticated by checking session
            var customerId = HttpContext.Session.GetInt32("CustomerId");
            if (!customerId.HasValue)
            {
                // Store the return URL in TempData to redirect back after login
                TempData["ReturnUrl"] = $"/BookAppointment?serviceId={serviceId}";
                return RedirectToAction("Login", "Auth");
            }

            
            var staffList = await _apiService.GetStaffAsync();
            var serviceList = await _apiService.GetServicesAsync();
            var viewModel = new BookingViewModel
            {
                ServiceId = serviceId,
                ServiceList = serviceList,
                StaffList = staffList,
                AppointmentDate = DateTime.Now.AddDays(1),
                CustomerId = customerId.Value
            };

            return View(viewModel);
        }
        [HttpPost]
        public async Task<IActionResult> BookAppointment(BookingViewModel model)
        {
            // Verify user is still authenticated
            var customerId = HttpContext.Session.GetInt32("CustomerId");
            if (!customerId.HasValue)
            {
                return RedirectToAction("Login", "Auth");
            }

            if (!ModelState.IsValid)
            {
                model.Service = await _apiService.GetServiceAsync(model.ServiceId);
                model.StaffList = await _apiService.GetStaffAsync();
                return View(model);
            }

            try
            {
                var appointment = new Appointment
                {
                    CustomerId = customerId.Value, // Use the session value
                    StaffId = model.StaffId,
                    ServiceId = model.ServiceId,
                    AppointmentDate = model.AppointmentDate,
                    Status = "Scheduled"
                };

                await _apiService.CreateAppointmentAsync(appointment);
                TempData["SuccessMessage"] = "Appointment booked successfully!";
                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", $"Error booking appointment: {ex.Message}");
                model.Service = await _apiService.GetServiceAsync(model.ServiceId);
                model.StaffList = await _apiService.GetStaffAsync();
                return View(model);
            }
        }
        public async Task<IActionResult> Details(int id)
        {
            var appointment = await _apiService.GetAppointmentAsync(id);
            return View(appointment);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var appointment = await _apiService.GetAppointmentAsync(id);
            var staff = await _apiService.GetStaffAsync();
            var services = await _apiService.GetServicesAsync();
            var model = new BookingViewModel
            {
                Appointment = appointment,
                StaffList = staff,
                ServiceList = services
            };
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, BookingViewModel model)
        {
            if (ModelState.IsValid)
            {
                await _apiService.UpdateAppointmentAsync(id, model.Appointment);
                return RedirectToAction("Index");
            }
            model.StaffList = await _apiService.GetStaffAsync();
            model.ServiceList = await _apiService.GetServicesAsync();
            return View(model);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var appointment = await _apiService.GetAppointmentAsync(id);
            return View(appointment);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _apiService.DeleteAppointmentAsync(id);
            return RedirectToAction("Index");
        }
    }
}