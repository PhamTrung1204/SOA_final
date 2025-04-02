namespace WebApp.Models
{
    public class Service
    {
        public int ServiceId { get; set; }       // ID
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public decimal Price { get; set; }       // Giá
        public int Duration { get; set; }        // Thời gian (phút)
    }
}
