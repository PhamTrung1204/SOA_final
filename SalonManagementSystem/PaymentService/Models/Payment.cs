namespace PaymentService.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int AppointmentId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } // "Pending", "Completed", "Failed"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}