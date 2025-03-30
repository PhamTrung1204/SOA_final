using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalonManagementSystem.Shared.Models.ViewModels
{
    public class BookingViewModel
    {
        public Appointment Appointment { get; set; }
        public List<Staff> StaffList { get; set; }
        public List<Service> ServiceList { get; set; }
    }
}
