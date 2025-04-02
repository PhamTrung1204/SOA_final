using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonManagementSystem.Shared.Models
{
    [Table("staff")] // Đặt tên bảng trong cơ sở dữ liệu
    public class Staff
    {
        [Key]
        [Column("staff_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StaffId { get; set; }

        [Required]
        [Column("name")]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("email")]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Column("phone")]
        [MaxLength(15)]
        public string Phone { get; set; }

        [Required]
        [Column("role")]
        [MaxLength(50)]
        public string Role { get; set; } = string.Empty;

        [Column("skills", TypeName = "jsonb")] // Lưu danh sách kỹ năng dưới dạng JSON
        public List<string> Skills { get; set; } = new();
    }
}
