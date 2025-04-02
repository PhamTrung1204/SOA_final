using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonManagementSystem.Shared.Models
{
    [Table("customers")] // Đặt tên bảng trong database
    public class Customer
    {
        [Key]
        [Column("customer_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CustomerId { get; set; }

        [Required]
        [Column("name", TypeName = "varchar(100)")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("email", TypeName = "varchar(255)")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("phone", TypeName = "varchar(20)")]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [Column("password_hash", TypeName = "text")]
        public string PasswordHash { get; set; }
    }
}
