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

        [HttpPost]
        public async Task<IActionResult> Create(BookingViewModel model)
        {
            if (ModelState.IsValid)
            {
                await _apiService.CreateAppointmentAsync(model.Appointment);
                return RedirectToAction("Index");
            }
            model.StaffList = await _apiService.GetStaffAsync();
            model.ServiceList = await _apiService.GetServicesAsync();
            return View(model);
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