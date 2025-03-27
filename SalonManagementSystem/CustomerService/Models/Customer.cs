namespace CustomerService.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Phone { get; set; } = String.Empty;
    }
}
