using Microsoft.AspNetCore.Mvc;
using FeedbackService.Services;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System;
using SalonManagementSystem.Shared.Models;
using Feedback = SalonManagementSystem.Shared.Models.Feedback;


namespace FeedbackService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackService _feedbackService;
        private readonly HttpClient _httpClient;

        public FeedbackController(IFeedbackService feedbackService, IHttpClientFactory httpClientFactory)
        {
            _feedbackService = feedbackService;
            _httpClient = httpClientFactory.CreateClient(); // Sử dụng IHttpClientFactory
        }

        // 🏷️ Gọi API AppointmentService để kiểm tra trạng thái
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitFeedback([FromBody] Feedback feedback)
        {
            if (feedback == null || feedback.AppointmentId == 0)
                return BadRequest("Invalid feedback data");

            try
            {
                // Gọi API AppointmentService
                var response = await _httpClient.GetAsync($"http://appointmentservice/api/appointments/{feedback.AppointmentId}");
                if (!response.IsSuccessStatusCode)
                    return BadRequest("Invalid appointment");

                // Đọc dữ liệu appointment
                var appointment = await response.Content.ReadFromJsonAsync<Appointment>();
                if (appointment == null)
                    return BadRequest("Appointment not found");

                // Kiểm tra trạng thái appointment
                if (appointment.Status != "Completed")
                    return BadRequest("Feedback can only be submitted for completed appointments");

                // Tạo feedback
                feedback.CreatedAt = DateTime.UtcNow;
                await _feedbackService.CreateFeedback(feedback);
                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // 🏷️ Lấy tất cả feedback
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var feedbacks = await _feedbackService.GetAllFeedbacks();
            return Ok(feedbacks);
        }

        // 🏷️ Lấy feedback theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var feedback = await _feedbackService.GetFeedbackById(id);
            return feedback != null ? Ok(feedback) : NotFound();
        }

        // 🏷️ Tạo feedback mới
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] Feedback feedback)
        {
            if (feedback == null)
                return BadRequest("Invalid feedback data");

            await _feedbackService.CreateFeedback(feedback);
            return CreatedAtAction(nameof(GetById), new { id = feedback.FeedbackId }, feedback);
        }

        // 🏷️ Cập nhật feedback
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Feedback feedback)
        {
            if (feedback == null || id != feedback.FeedbackId)
                return BadRequest("Feedback ID mismatch");

            await _feedbackService.UpdateFeedback(id, feedback);
            return NoContent();
        }

        // 🏷️ Xóa feedback
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _feedbackService.DeleteFeedback(id);
            return NoContent();
        }
    }
}
