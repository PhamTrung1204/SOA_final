using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonManagementSystem.Shared.Models
{
    [Table("feedbacks")] // Đặt tên bảng trong cơ sở dữ liệu
    public class Feedback
    {
        [Key]
        [Column("feedback_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FeedbackId { get; set; }

        [Required]
        [Column("appointment_id")]
        public int AppointmentId { get; set; }

        [Required]
        [Column("customer_id")]
        public int CustomerId { get; set; }

        [Column("comment", TypeName = "text")]
        public string Comment { get; set; } = string.Empty;

        [Required]
        [Range(1, 5)]
        [Column("rating")]
        public int Rating { get; set; } // Điểm đánh giá từ 1-5

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
