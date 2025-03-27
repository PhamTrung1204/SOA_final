namespace FeedbackService.Models
{
    public class Feedback
    {
        public int FeedbackId { get; set; }
        public int AppointmentId { get; set; }
        public int CustomerId { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; } // Điểm đánh giá từ 1-5
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}