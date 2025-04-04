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
        public Service Service { get; set; }
        public List<Service> ServiceList { get; set; }
        public int CustomerId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public int StaffId { get; set; }
        public int ServiceId { get; set; }
    }
}
