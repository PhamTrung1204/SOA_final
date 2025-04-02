using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonManagementSystem.Shared.Models
{
    [Table("payments")] // Đặt tên bảng trong cơ sở dữ liệu
    public class Payment
    {
        [Key]
        [Column("payment_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentId { get; set; }

        [Required]
        [Column("appointment_id")]
        public int AppointmentId { get; set; }

        [Required]
        [Column("amount", TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; } // Giữ 2 chữ số sau dấu thập phân

        [Required]
        [Column("status")]
        [MaxLength(10)]
        public string Status { get; set; } = "Pending"; // "Pending", "Completed", "Failed"

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
