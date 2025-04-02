using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonManagementSystem.Shared.Models
{
    [Table("appointments")] // Đặt tên bảng trong cơ sở dữ liệu
    public class Appointment
    {
        [Key]
        [Column("appointment_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AppointmentId { get; set; }

        [Required]
        [Column("customer_id")]
        public int CustomerId { get; set; }

        [Required]
        [Column("staff_id")]
        public int StaffId { get; set; }

        [Required]
        [Column("service_id")]
        public int ServiceId { get; set; }

        [Required]
        [Column("appointment_date")]
        public DateTime AppointmentDate { get; set; }

        [Required]
        [Column("status", TypeName = "varchar(20)")]
        public string Status { get; set; } = "Pending"; // "Pending", "Confirmed", "Cancelled", "Completed"

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
