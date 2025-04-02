using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalonManagementSystem.Shared.Models
{
    [Table("schedules")] // Đặt tên bảng trong cơ sở dữ liệu
    public class Schedule
    {
        [Key]
        [Column("schedule_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScheduleId { get; set; }

        [Required]
        [Column("staff_id")]
        public int StaffId { get; set; }

        [Required]
        [Column("date")]
        public DateTime Date { get; set; } // Ngày làm việc

        [Required]
        [Column("start_time")]
        public TimeSpan StartTime { get; set; } // Giờ bắt đầu

        [Required]
        [Column("end_time")]
        public TimeSpan EndTime { get; set; } // Giờ kết thúc
    }
}
