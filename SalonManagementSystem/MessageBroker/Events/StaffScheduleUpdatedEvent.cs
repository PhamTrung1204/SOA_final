using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBroker.Events
{
    public class StaffScheduleUpdatedEvent
    {
        public int StaffId { get; set; }
        public DateTime NewScheduleDate { get; set; }
    }

}
