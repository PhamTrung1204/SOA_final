using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Events
{
    public class FeedbackSubmittedEvent
    {
        public int FeedbackId { get; set; }
        public int AppointmentId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }

}
