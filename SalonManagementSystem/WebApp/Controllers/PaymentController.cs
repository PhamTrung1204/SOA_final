using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using SalonManagementSystem.Shared.Models.ViewModels;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class PaymentController : Controller
    {
        private readonly IApiService _apiService;

        public PaymentController(IApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<IActionResult> Index()
        {
            var payments = await _apiService.GetPaymentsAsync();
            return View(payments);
        }

        public IActionResult Process(int appointmentId)
        {
            var model = new PaymentViewModel { AppointmentId = appointmentId };
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Process(PaymentViewModel model)
        {
            if (ModelState.IsValid)
            {
                model.Payment.CreatedAt = DateTime.UtcNow;
                model.Payment.Status = "Completed";
                await _apiService.CreatePaymentAsync(model.Payment);
                return RedirectToAction("Index");
            }
            return View(model);
        }

        public async Task<IActionResult> Details(int id)
        {
            var payment = await _apiService.GetPaymentAsync(id);
            return View(payment);
        }
    }
}