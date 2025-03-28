using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalonManagementSystem.Shared.Models
{
    public class Staff
    {
        public int StaffId { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Role { get; set; } = String.Empty;
        public List<string> Skills { get; set; } = new();
    }
}
