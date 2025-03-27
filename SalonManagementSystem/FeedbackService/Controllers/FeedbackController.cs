using Microsoft.AspNetCore.Mvc;
using FeedbackService.Models;
using FeedbackService.Services;
using System.Threading.Tasks;

namespace FeedbackService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly HttpClient _httpClient;
        public FeedbackController(IFeedbackService feedbackService, HttpClient httpClient)
        {
            _feedbackService = feedbackService;
            _httpClient = httpClient;
        }
        [HttpPost]
        public async Task<IActionResult> SubmitFeedback(Feedback feedback)
        {
            // Gọi API AppointmentService để kiểm tra trạng thái
            var response = await _httpClient.GetAsync($"http://appointmentservice/api/appointments/{feedback.AppointmentId}");
            if (!response.IsSuccessStatusCode) return BadRequest("Invalid appointment");

            var appointment = await response.Content.ReadFromJsonAsync<Appointment>();
            if (appointment.Status != "Completed")
                return BadRequest("Feedback can only be submitted for completed appointments");

            feedback.CreatedAt = DateTime.UtcNow;
            await _feedbackService.CreateFeedback(feedback);
            return Ok(feedback);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var feedbacks = await _feedbackService.GetAllFeedbacks();
            return Ok(feedbacks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var feedback = await _feedbackService.GetFeedbackById(id);
            return feedback != null ? Ok(feedback) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Feedback feedback)
        {
            await _feedbackService.CreateFeedback(feedback);
            return CreatedAtAction(nameof(GetById), new { id = feedback.FeedbackId }, feedback);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Feedback feedback)
        {
            await _feedbackService.UpdateFeedback(id, feedback);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _feedbackService.DeleteFeedback(id);
            return NoContent();
        }
    }
}