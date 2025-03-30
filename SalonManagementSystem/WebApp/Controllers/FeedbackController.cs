using Microsoft.AspNetCore.Mvc;
using SalonManagementSystem.Shared.Models;
using SalonManagementSystem.Shared.Models.ViewModels;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class FeedbackController : Controller
    {
        private readonly IApiService _apiService;

        public FeedbackController(IApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task<IActionResult> Index()
        {
            var feedbacks = await _apiService.GetFeedbacksAsync();
            return View(feedbacks);
        }

        public IActionResult Submit(int appointmentId)
        {
            var model = new FeedbackViewModel { AppointmentId = appointmentId };
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Submit(FeedbackViewModel model)
        {
            if (ModelState.IsValid)
            {
                model.Feedback.CreatedAt = DateTime.UtcNow;
                await _apiService.CreateFeedbackAsync(model.Feedback);
                return RedirectToAction("Index");
            }
            return View(model);
        }

        public async Task<IActionResult> Details(int id)
        {
            var feedback = await _apiService.GetFeedbackAsync(id);
            return View(feedback);
        }
    }
}