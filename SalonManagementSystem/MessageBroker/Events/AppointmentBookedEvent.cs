using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Events
{
    public class AppointmentBookedEvent
    {
        public int AppointmentId { get; set; }
        public int CustomerId { get; set; }
        public int StaffId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; }
    }

}
