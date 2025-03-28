using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalonManagementSystem.Shared.Models
{
    public class Service
    {
        public int ServiceId { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public decimal Price { get; set; }
        public int Duration { get; set; } // đơn vị: phút
    }
}
