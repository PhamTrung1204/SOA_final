using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalonManagementSystem.Shared.Models.ViewModels
{
    public class PaymentViewModel
    {
        public Payment Payment { get; set; }
        public int AppointmentId { get; set; }
    }
}
