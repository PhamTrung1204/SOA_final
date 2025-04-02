using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonManagementSystem.Shared.Models
{
    [Table("services")] // Đặt tên bảng trong cơ sở dữ liệu
    public class Service
    {
        [Key]
        [Column("service_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ServiceId { get; set; }

        [Required]
        [Column("name")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column("price", TypeName = "decimal(10,2)")]
        public decimal Price { get; set; } // Giá dịch vụ

        [Required]
        [Column("duration")]
        public int Duration { get; set; } // Thời gian thực hiện (phút)
    }
}
