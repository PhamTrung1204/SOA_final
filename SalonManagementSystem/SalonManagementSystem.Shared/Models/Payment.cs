using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalonManagementSystem.Shared.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int AppointmentId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = "Pending"; // "Pending", "Completed", "Failed"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
