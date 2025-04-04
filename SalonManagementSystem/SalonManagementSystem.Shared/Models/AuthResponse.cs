using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalonManagementSystem.Shared.Models
{
    public class AuthResponse
    {
        public Customer Customer { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}
